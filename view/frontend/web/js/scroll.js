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
            this.baseSelector = this.config.container || null;

            if (!this.settings.enabled) {
                return;
            }

            // An AJAX filter (layered navigation) can replace the list after load,
            // so keep watching even when there's nothing to page through yet.
            this._watchForReplacement();

            var hasNext = $(this.config.path).length > 0;

            // The final page has no next link, but Back from a product page still
            // has to rebuild the earlier pages, so only a plain visit stops here.
            if (!hasNext && !this._shouldRestore()) {
                this._log('No next-page link found for selector:', this.config.path);

                return;
            }

            this._boot(hasNext);
        },

        /**
         * Lazily load the core scroll libraries, then wire everything up.
         */
        _boot: function (hasNext) {
            var self = this,
                deps = hasNext ? ['infinite-scroll', 'imagesloaded', 'jquery-bridget'] : ['imagesloaded', 'jquery-bridget'];

            require(deps, function () {
                var libs = [].slice.call(arguments),
                    jQueryBridget = libs.pop(),
                    imagesLoaded = libs.pop(),
                    bridget = $.bridget || jQueryBridget;

                if (hasNext) {
                    bridget('infiniteScroll', libs[0], $);
                    libs[0].imagesLoaded = imagesLoaded;
                }

                self._imagesLoaded = imagesLoaded;
                self._log('Initialised on', self.config.container || self.element);
                self._buildStatusBlock();
                self._initLayout(function () {
                    self._restoreHistory(function () {
                        if (hasNext) {
                            self._initScroll();
                        } else {
                            self._showEnd();
                        }

                        self._trackPageViews();
                        self._trackScroll();
                    });
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
                var bridget = $.bridget || jQueryBridget,
                    sizer = { columnWidth: '.cw-grid-sizer', gutter: 10 },
                    tag;

                bridget(mode, Layout, $);

                // The sizer is an empty item the stylesheet gives the column width, so
                // the library measures real columns instead of theme margins.
                tag = /^(OL|UL)$/.test(self.element.tagName) ? 'li' : 'div';
                self.$sizer = $('<' + tag + ' class="cw-grid-sizer" aria-hidden="true"></' + tag + '>');
                self.$element.prepend(self.$sizer);
                self._layoutMode = mode;

                // Start only once the images are measured, so items never stack at 0,0.
                imagesLoaded(self.element, function () {
                    self.$element[mode]($.extend({
                        itemSelector: self.config.append,
                        percentPosition: true,
                        transitionDuration: 0,
                        masonry: sizer
                    }, sizer));
                    self.outlayer = self.$element.data(mode);
                    self.$element.addClass('cw-infinite-scroll--ready');
                    self._relayoutOnImages();
                    done();
                });
            });
        },

        /**
         * Re-run the layout. After items were added outside the library (a Back
         * restore) the item list is rebuilt first. Isotope keeps its own filtered
         * list, so it re-arranges instead.
         *
         * @param {Boolean} [reload]
         */
        _relayout: function (reload) {
            var layout = this.outlayer;

            if (!layout) {
                return;
            }

            if (reload) {
                layout.reloadItems();
            }

            if (this._layoutMode === 'isotope') {
                layout.arrange();
            } else {
                layout.layout();
            }
        },

        /**
         * Images that finish after the first measure (lazy or slow) change item
         * heights, so lay the grid out again as each one arrives.
         */
        _relayoutOnImages: function () {
            var self = this,
                timer = null;

            self._imagesLoaded(self.element).on('progress', function () {
                window.clearTimeout(timer);
                timer = window.setTimeout(function () {
                    self._relayout();
                }, 50);
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
            this.$live = this.$status.filter('.cw-infinite-scroll__live');
        },

        /**
         * Say something to screen readers through the polite live region.
         *
         * @param {String} text
         */
        _announce: function (text) {
            if (this.$live && this.$live.length) {
                this.$live.text(text || '');
            }
        },

        /**
         * Final page reached without loading anything (Back to ?p=last): there is
         * no scroll instance to show the end message, so show it directly.
         */
        _showEnd: function () {
            if (!this.settings.status || !this.$status) {
                return;
            }

            this.$status.filter('.page-load-status').show().find('.infinite-scroll-last').show();
            this._announce(this.settings.text);
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
                    status: self.settings.status && self.$status ? self.$status.filter('.page-load-status')[0] : false,
                    outlayer: self.outlayer || false,
                    debug: !!self.config.debug
                };

            self.$element.infiniteScroll(options);

            if (self.settings.status && self.$live) {
                self.$element.on('request.infiniteScroll', function () {
                    self._announce(self.$live.data('loading'));
                }).on('append.infiniteScroll', function () {
                    // The end message can arrive first; only clear our own loading note.
                    if (self.$live.text() === self.$live.data('loading')) {
                        self._announce('');
                    }
                }).on('last.infiniteScroll', function () {
                    self._announce(self.settings.text);
                }).on('error.infiniteScroll', function () {
                    self._announce(self.$live.data('error'));
                });
            }

            self.$element.on('append.infiniteScroll', function (event, response, path) {
                $('body').trigger('contentUpdated');
                self.settings.page += 1;
                self._maybeUpdateUrl(path);
            });

            self._initViewMore();
        },

        /**
         * Wire the "View More" button. It is shown on narrow viewports (where
         * auto-load is always off) and, at any width, whenever Load On Scroll is
         * set to No, so there is always a way to load the next page.
         */
        _initViewMore: function () {
            var self = this,
                $button = self.$status ? self.$status.find('.view-more-button') : $(),
                query = window.matchMedia('(min-width: 768px)');

            $button.off('click.cwInfiniteScroll').on('click.cwInfiniteScroll', function () {
                self.$element.infiniteScroll('loadNextPage');
            });

            // Nothing left to load, so the button has no job any more.
            self.$element.on('last.infiniteScroll', function () {
                self._lastPageReached = true;
                $button.hide();
            });

            function apply(mql) {
                var wanted = mql.matches && self.config.loadOnScroll;

                // While a Back restore settles, scrolling must not trigger a load:
                // the restore itself moves the page and would fetch the next one.
                self.$element.infiniteScroll('option', { loadOnScroll: !!wanted && !self._settling });
                $button.toggle(!wanted && !self._lastPageReached);
            }

            if (self._restored) {
                self._settling = true;
                window.setTimeout(function () {
                    self._settling = false;
                    apply(query);
                }, 800);
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
         * The URL is replaced rather than pushed: every loaded page used to add
         * a history entry, so the Back button had to be pressed once per loaded
         * page before it left the list. The query string is kept, so the URL
         * is a real, shareable link to the page just loaded (e.g. ?p=3).
         *
         * @param {String} path
         */
        _maybeUpdateUrl: function (path) {
            if (!this.settings.updateUrl || !path || urlParam('p', path) === null) {
                return;
            }

            var link = document.createElement('a'),
                page = parseInt(urlParam('p', path), 10);

            link.href = path;
            window.history.replaceState(window.history.state, document.title, link.pathname + link.search);
            this._rememberPage(page);
            this._log('URL updated to', link.pathname + link.search);
        },

        /**
         * Storage key for this list: the page URL without the page number,
         * so every page of the same listing shares one record.
         *
         * @return {String}
         */
        _storeKey: function () {
            var query = window.location.search.replace(/([?&])p=[^&#]*&?/, '$1').replace(/[?&]$/, '');

            return 'cwis:' + window.location.pathname + query + '|' + (this.config.container || '');
        },

        /**
         * Current listing page number from the address bar.
         *
         * @return {Number}
         */
        _currentPage: function () {
            return parseInt(urlParam('p', window.location.search), 10) || 1;
        },

        /**
         * Persist which pages this visit has loaded and where the shopper is
         * scrolled, so Back from a product page can put the list back as it was.
         *
         * @param {Number} [page]
         */
        _rememberPage: function (page) {
            var state = this._state || { first: this._currentPage(), last: this._currentPage(), scrollY: 0 };

            if (page) {
                state.last = Math.max(state.last, page);
            }

            state.scrollY = Math.round(window.pageYOffset || 0);
            this._state = state;

            try {
                window.sessionStorage.setItem(this._storeKey(), JSON.stringify(state));
            } catch (e) {
                this._log('sessionStorage unavailable:', e && e.message);
            }
        },

        /**
         * Remember the scroll position while the shopper browses the list.
         */
        _trackScroll: function () {
            var self = this,
                timer = null;

            if (!self.settings.updateUrl) {
                return;
            }

            $(window).off('.cwInfiniteScroll').on('scroll.cwInfiniteScroll', function () {
                if (timer) {
                    return;
                }

                timer = window.setTimeout(function () {
                    timer = null;
                    self._rememberPage();
                }, 200);
            });
            $(window).on('pagehide.cwInfiniteScroll', function () {
                self._rememberPage();
            });
        },

        /**
         * True when the browser is showing this page through Back/Forward.
         *
         * @return {Boolean}
         */
        _isHistoryNavigation: function () {
            var entries = window.performance && window.performance.getEntriesByType ?
                window.performance.getEntriesByType('navigation') : [];

            return !!entries.length && entries[0].type === 'back_forward';
        },

        /**
         * Whether this load may need the earlier pages put back.
         *
         * @return {Boolean}
         */
        _shouldRestore: function () {
            return this.settings.updateUrl && this._currentPage() > 1 && this._isHistoryNavigation();
        },

        /**
         * Back/Forward to a list whose URL names the last page loaded (?p=N):
         * the browser reloads only page N, so fetch the earlier pages, put them
         * back in front and return to the saved scroll position. The next page
         * the library loads is still N+1, so nothing is loaded twice.
         *
         * @param {Function} done
         */
        _restoreHistory: function (done) {
            var self = this,
                saved = null,
                current = self._currentPage(),
                pages = [],
                i;

            if (!self._shouldRestore()) {
                self._state = { first: current, last: current, scrollY: 0 };
                done();

                return;
            }

            try {
                saved = JSON.parse(window.sessionStorage.getItem(self._storeKey()) || 'null');
            } catch (e) {
                saved = null;
            }

            if (!saved || saved.last !== current || saved.first >= current) {
                self._state = saved && saved.last === current ? saved : { first: current, last: current, scrollY: 0 };
                done();

                return;
            }

            self._state = saved;

            for (i = saved.first; i < current; i++) {
                pages.push(i);
            }

            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
            }

            $.when.apply($, $.map(pages, function (page) {
                return $.ajax({ url: self._pageUrl(page), dataType: 'html' }).then(function (html) {
                    return { page: page, html: html };
                });
            })).done(function () {
                var results = pages.length === 1 ? [arguments[0]] : [].slice.call(arguments),
                    $first = self.$element.find(self.config.append).first(),
                    index = $(self.config.container || self.element).index(self.element),
                    inserted = [];

                results.sort(function (a, b) {
                    return a.page - b.page;
                });

                $.each(results, function (n, result) {
                    var doc = new window.DOMParser().parseFromString(result.html, 'text/html'),
                        lists = doc.querySelectorAll(self.config.container || ''),
                        list = lists[index > -1 ? index : 0],
                        $items = list ? $(list).find(self.config.append) : $();

                    $items.each(function () {
                        var node = document.importNode(this, true);

                        $(node).insertBefore($first);
                        inserted.push(node);
                    });
                });

                self._restored = true;
                self._log('Restored pages', saved.first, 'to', current - 1, 'after history navigation');

                // Settle the layout only once the restored images have their size,
                // otherwise the saved position lands on content that is still moving.
                self._whenImagesSettle(inserted, function () {
                    self._relayout(true);
                    $('body').trigger('contentUpdated');
                    window.scrollTo(0, saved.scrollY || 0);
                    self._restoreScrollMode();
                    window.requestAnimationFrame(function () {
                        window.requestAnimationFrame(function () {
                            done();
                        });
                    });
                });
            }).fail(function () {
                self._log('Could not restore earlier pages; showing the current page only');
                self._restoreScrollMode();
                done();
            });
        },

        /**
         * Run the callback when the given images have loaded, or after a few
         * seconds at most so a broken image cannot hold the page back.
         *
         * @param {Array} nodes
         * @param {Function} callback
         */
        _whenImagesSettle: function (nodes, callback) {
            var finished = false,
                finish = function () {
                    if (!finished) {
                        finished = true;
                        callback();
                    }
                };

            window.setTimeout(finish, 4000);
            this._imagesLoaded(nodes, finish);
        },

        /**
         * Hand scrolling back to the browser after a restore.
         */
        _restoreScrollMode: function () {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        },

        /**
         * URL of listing page n, keeping the other query parameters.
         *
         * @param {Number} n
         * @return {String}
         */
        _pageUrl: function (n) {
            var query = window.location.search.replace(/([?&])p=[^&#]*&?/, '$1').replace(/[?&]$/, ''),
                glue = query.indexOf('?') > -1 ? '&' : '?';

            return window.location.pathname + (n > 1 ? query + glue + 'p=' + n : query);
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
         * Re-initialise on the new list when AJAX layered navigation (or any
         * script) replaces the product list without a full page reload.
         */
        _watchForReplacement: function () {
            var self = this;

            if (self._observer || !self.baseSelector || typeof window.MutationObserver !== 'function') {
                return;
            }

            var scope = document.querySelector('.column.main') ||
                    document.querySelector('.columns') ||
                    document.body,
                pending = null;

            self._observer = new window.MutationObserver(function () {
                if (pending) {
                    return;
                }

                pending = window.setTimeout(function () {
                    pending = null;

                    // Our list is still on the page (e.g. our own appends) — nothing to do.
                    if (self.element && document.body.contains(self.element)) {
                        return;
                    }

                    var next = document.querySelector(self.baseSelector);

                    if (!next || next === self.element) {
                        return;
                    }

                    self._log('List replaced — re-initialising on the new list');
                    self._teardown();
                    self.element = next;
                    self.$element = $(next);
                    self.outlayer = false;

                    if ($(self.config.path).length > 0) {
                        self._boot();
                    }
                }, 150);
            });

            self._observer.observe(scope, { childList: true, subtree: true });
        },

        /**
         * Tear down the current Infinite Scroll instance and status block.
         */
        _teardown: function () {
            try {
                this.$element.infiniteScroll('destroy');
            } catch (e) {
                this._log('teardown:', e && e.message);
            }

            if (this.$status) {
                this.$status.remove();
                this.$status = null;
            }

            this.$element.removeClass('cw-infinite-scroll--layout cw-infinite-scroll--ready');
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
