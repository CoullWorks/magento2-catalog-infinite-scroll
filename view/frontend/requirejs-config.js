/**
 * CoullWorks Catalog Infinite Scroll for Magento 2.
 *
 * @author    danrcoull <ttechitsolutions@gmail.com>
 * @copyright Copyright (c) 2020-2026 CoullWorks
 * @license   MIT
 * @link      https://github.com/CoullWorks/magento2-catalog-infinite-scroll
 *
 * Libraries are self-hosted (no third-party CDN). The layout libraries
 * (masonry/isotope/packery) are only fetched when their mode is selected,
 * so a default-mode store downloads none of them.
 */
var config = {
    paths: {
        'coullworksCatalogInfiniteScroll': 'CoullWorks_CatalogInfiniteScroll/js/scroll',
        'infinite-scroll': 'CoullWorks_CatalogInfiniteScroll/js/vendor/infinite-scroll.pkgd.min',
        'imagesloaded': 'CoullWorks_CatalogInfiniteScroll/js/vendor/imagesloaded.pkgd.min',
        'jquery-bridget': 'CoullWorks_CatalogInfiniteScroll/js/vendor/jquery-bridget',
        'masonry': 'CoullWorks_CatalogInfiniteScroll/js/vendor/masonry.pkgd.min',
        'isotope': 'CoullWorks_CatalogInfiniteScroll/js/vendor/isotope.pkgd.min',
        'packery': 'CoullWorks_CatalogInfiniteScroll/js/vendor/packery.pkgd.min'
    },
    shim: {
        'infinite-scroll': { deps: ['jquery'] },
        'masonry': { deps: ['jquery'] },
        'isotope': { deps: ['jquery'] },
        'packery': { deps: ['jquery'] }
    }
};
