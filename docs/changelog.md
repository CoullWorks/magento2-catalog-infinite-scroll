# Catalog Infinite Scroll for Magento 2 changelog

Newest first. The format follows Keep a Changelog and Semantic Versioning.

## 2.1.1, 16 November 2026

- **Back from the last page** now restores every earlier page and the scroll position, and shows the end message. Before, Back from a product opened on the final page (`?p=4`) showed only that page.
- **The loading dots and the End Status Text now show.** Both appear, and loading, end and error messages are announced through an `aria-live="polite"` region. The error message no longer repeats the end text.
- **Back from page 3** returns to page 3 with the saved scroll position every time. Auto-load is held off while the restore settles, so no extra page loads after it.
- **Layout modes** now lay out cleanly on Luma. Default, Masonry, Isotope and Packery show a grid without overlapping items, after loading, after Back and after a resize.
- Configuration paths and the public API are unchanged. No layout option was removed.

## 2.1.0, 16 November 2026

- **View More** now shows at every width when Load On Scroll is No, and hides after the last page.
- The URL is replaced with the real page (`?p=N`, other parameters kept) and adds no history entries.
- **Back from a product page** restores the earlier pages and the scroll position. State is kept in `sessionStorage`, only when Update Browser URL is on.
- **Enable Infinite Scroll** can be set per website and store view.
- New widget parameters: Scroll Threshold, Track Virtual Pageviews, Update Browser URL and Debug Logging. Empty inherits the store setting.
- Hyvä is not supported, and the documentation now says so.

## 2.0.3, 28 September 2026

PHP 8.5 support, so the module installs on Magento 2.4.9. Magento 2.4.9 runs production on PHP 8.5, which the Composer constraint did not allow. The constraint now includes `~8.5.0`. No code changes were needed.

## 2.0.2, 9 September 2026

The admin configuration tab logo now loads. The admin stylesheet was declared in a layout file Magento does not read, and moved to where it does.

## 2.0.1, 8 September 2026

- Infinite scroll now survives AJAX layered navigation. Previously it stopped working after a filter replaced the list until the page was reloaded.
- No more overlapping items after append in masonry, isotope and packery modes.

## 2.0.0, 8 September 2026

The first CoullWorks release, a rebrand and modernisation of `boxleaf/module-infinatescroll`. This is a breaking change: package, module, namespace and configuration paths all changed, so it installs as a new module.

- Package `coullworks/module-catalog-infinite-scroll`, module `CoullWorks_CatalogInfiniteScroll`.
- Licensed MIT.
- Works on any list through a widget for Page Builder, CMS pages and static blocks.
- Analytics moved from Universal Analytics to GA4 `gtag`.
