/**
 * CoullWorks Catalog Infinite Scroll for Magento 2.
 *
 * @author    danrcoull <ttechitsolutions@gmail.com>
 * @copyright Copyright (c) 2020-2026 CoullWorks
 * @license   MIT
 * @link      https://github.com/CoullWorks/magento2-catalog-infinite-scroll
 *
 * One reusable component, initialised once per matched container by
 * Magento's x-magento-init. Only jquery, uiComponent and mage/template
 * load up front; the scroll and layout libraries load on demand so the
 * critical render path (and LCP) is untouched.
 */
define([
    'uiComponent',
    'jquery',
    'mage/template'
], function (Component, $, mageTemplate) {
    'use strict';

    /**
     * Read a query-string parameter from a URL, or null if absent.
     *
     * @param {String} name
     * @param {String} url
     * @return {String|null}
     */
    function urlParam(name, url) {
        var match = new RegExp('[?&]' + name + '=([^&#]*)').exec(url || '');

        return match && typeof match[1] !== 'undefined' ? match[1] : null;
    }

    return Component.extend({
        defaults: {
            settings: {
                enabled: true,
                analytics: true,
                updateUrl: true,
                status: true,
                text: 'No more products',
                display_type: '1',
                page: 1
            },
            config: {
                path: '.pages-item-next .action.next',
                append: '.item.product.product-item',
                checkLastPage: '.pages-item-next .action.next',
                scrollThreshold: 100,
                loadOnScroll: true,
                hideNav: false,
                debug: false
            }
        },

        /**
         * Magento calls this once for every element matching the container
         * selector, so several lists on one page each get their own instance.
         *
         * @param {Object} config
         * @param {HTMLElement} element
         */
        initialize: function (config, element) {
            this._super();

            $.extend(true, this.config, (config && config.config) || {});
            $.extend(true, this.settings, (config && config.settings) || {});

            this.element = element;
            this.$element = $(element);
            this.outlayer = false;

            if (!this.settings.enabled) {
                return;
            }

            if ($(this.config.path).length === 0) {
                this._log('No next-page link found for selector:', this.config.path);

                return;
            }

            this._boot();
        },

        /**
         * Lazily load the core scroll libraries, then wire everything up.
         */
        _boot: function () {
            var self = this;

            require(['infinite-scroll', 'imagesloaded', 'jquery-bridget'], function (InfiniteScroll, imagesLoaded, jQueryBridget) {
                var bridget = $.bridget || jQueryBridget;

                bridget('infiniteScroll', InfiniteScroll, $);
                InfiniteScroll.imagesLoaded = imagesLoaded;

                self._imagesLoaded = imagesLoaded;
                self._buildStatusBlock();
                self._initLayout(function () {
                    self._initScroll();
                    self._trackPageViews();
                });
            });
        },

        /**
         * Load and apply an optional masonry/isotope/packery layout, only when
         * one is selected. Default mode adds no extra weight and never hides
         * content, so LCP is unaffected.
         *
         * @param {Function} done
         */
        _initLayout: function (done) {
            var self = this,
                modes = { '2': 'masonry', '3': 'isotope', '4': 'packery' },
                mode = modes[String(self.settings.display_type)];

            if (!mode) {
                done();

                return;
            }

            // The reveal (opacity) is scoped to layout modes only — see _module.less.
            self.$element.addClass('cw-infinite-scroll--layout');

            require([mode, 'imagesloaded', 'jquery-bridget'], function (Layout, imagesLoaded, jQueryBridget) {
                var bridget = $.bridget || jQueryBridget;

                bridget(mode, Layout, $);

                self.$element[mode]({
                    itemSelector: 'none', // hold layout until images are measured
                    columnWidth: self.config.append,
                    percentPosition: true,
                    gutter: 10
                });
                self.outlayer = self.$element.data(mode);

                imagesLoaded(self.element, function () {
                    self.$element.addClass('cw-infinite-scroll--ready');
                    self.$element[mode]('option', { itemSelector: self.config.append });
                    self.$element[mode]('reloadItems');
                    self.$element[mode]('layout');
                    done();
                });
            });
        },

        /**
         * Insert this instance's own status/loader block after the list.
         */
        _buildStatusBlock: function () {
            var template = mageTemplate('#coullworks-scroll-status'),
                markup = template({ data: { text: this.settings.text } });

            this.$status = $(markup);
            this.$status.insertAfter(this.$element);
        },

        /**
         * Start Infinite Scroll on this list and bind the append handlers.
         */
        _initScroll: function () {
            var self = this,
                options = {
                    path: self.config.path,
                    append: self.config.append,
                    checkLastPage: self.config.checkLastPage || self.config.path,
                    history: false,
                    prefill: false,
                    scrollThreshold: self.config.scrollThreshold,
                    loadOnScroll: self.config.loadOnScroll,
                    hideNav: self.config.hideNav || false,
                    status: self.settings.status && self.$status ? self.$status.find('.page-load-status')[0] : false,
                    outlayer: self.outlayer || false,
                    debug: !!self.config.debug
                };

            self.$element.infiniteScroll(options);

            self.$element.on('append.infiniteScroll', function (event, response, path) {
                $('body').trigger('contentUpdated');
                self.settings.page += 1;
                self._maybeUpdateUrl(path);
            });

            self._initViewMore();
        },

        /**
         * On narrow viewports, swap auto-load for a "View More" button.
         */
        _initViewMore: function () {
            var self = this,
                $button = self.$status ? self.$status.find('.view-more-button') : $(),
                query = window.matchMedia('(min-width: 768px)');

            function apply(mql) {
                if (mql.matches) {
                    $button.hide();
                    self.$element.infiniteScroll('option', { loadOnScroll: self.config.loadOnScroll });
                } else {
                    $button.show();
                    self.$element.infiniteScroll('option', { loadOnScroll: false });
                    $button.off('click.cwInfiniteScroll').on('click.cwInfiniteScroll', function () {
                        self.$element.infiniteScroll('loadNextPage');
                    });
                }
            }

            apply(query);

            if (typeof query.addEventListener === 'function') {
                query.addEventListener('change', apply);
            } else if (typeof query.addListener === 'function') {
                query.addListener(apply);
            }
        },

        /**
         * Reflect the loaded page in the address bar when enabled.
         *
         * @param {String} path
         */
        _maybeUpdateUrl: function (path) {
            if (!this.settings.updateUrl || !path || urlParam('p', path) === null) {
                return;
            }

            var clean = path.indexOf('?') > -1 ? path.substring(0, path.indexOf('?')) : path;

            window.history.pushState(null, document.title, clean);
            this._log('URL updated to', clean);
        },

        /**
         * Send a virtual pageview to GA4 (gtag) or legacy analytics.js on append.
         */
        _trackPageViews: function () {
            if (!this.settings.analytics) {
                return;
            }

            var self = this;

            this.$element.on('append.infiniteScroll', function (event, response, path) {
                var link = document.createElement('a');

                link.href = path;

                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'page_view', {
                        page_path: link.pathname + link.search,
                        page_location: link.href
                    });
                } else if (typeof window.ga === 'function') {
                    window.ga('set', 'page', link.pathname);
                    window.ga('send', 'pageview');
                }

                self._log('Tracked pageview:', link.pathname);
            });
        },

        /**
         * Console logging, gated behind the debug setting.
         */
        _log: function () {
            if (this.config.debug && window.console && window.console.log) {
                window.console.log.apply(window.console, ['[CoullWorks Infinite Scroll]'].concat([].slice.call(arguments)));
            }
        }
    });
});
