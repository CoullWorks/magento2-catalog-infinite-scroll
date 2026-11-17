# Catalog Infinite Scroll reference

## JS options

Magento's `x-magento-init` starts the `coullworksCatalogInfiniteScroll` component once for every element matching the container selector. The block writes this payload for you from the admin settings. To drive any list yourself, write the same shape:

```html
<script type="text/x-magento-init">
{
    ".my-list-container": {
        "coullworksCatalogInfiniteScroll": {
            "config": {
                "path": ".my-next-link",
                "container": ".my-list-container",
                "append": ".my-list-item",
                "checkLastPage": ".my-next-link",
                "scrollThreshold": 100,
                "loadOnScroll": true,
                "hideNav": ".my-pager",
                "debug": false
            },
            "settings": {
                "enabled": true,
                "analytics": true,
                "updateUrl": true,
                "status": true,
                "text": "No more items",
                "display_type": "1"
            }
        }
    }
}
</script>
```

### `config`

| Option | Meaning | Default |
|---|---|---|
| `path` | Selector of the next link. If it matches nothing on the page the component stays idle, but still watches for a replaced list | `.pages-item-next .action.next` |
| `append` | Selector of one item, appended from every new page | `.item.product.product-item` |
| `checkLastPage` | Selector used to detect the last page. Falls back to `path` | same as `path` |
| `scrollThreshold` | Pixels from the bottom at which loading starts | `100` |
| `loadOnScroll` | Auto load. Forced to `false` below 768 px | `true` |
| `hideNav` | Selector of the pager to hide, or `false` | `false` |
| `debug` | Console logging, and the library's debug output | `false` |
| `container` | Container selector. Used to find the replacement list after AJAX filtering. Set by the block, required for list replacement to work | none |
| `status` | The block sends `.page-load-status` or `false`. The component decides from `settings.status` instead | none |

### `settings`

| Option | Meaning | Default |
|---|---|---|
| `enabled` | `false` makes the component do nothing at all. The block always sends `true` | `true` |
| `analytics` | Send virtual pageviews | `true` |
| `updateUrl` | Replace the URL with the page just loaded | `true` |
| `status` | Show the loading dots and the end or error text | `true` |
| `text` | End and error message | `No more products` |
| `display_type` | `1` default, `2` masonry, `3` isotope, `4` packery | `1` |
| `page` | Internal page counter, increased on every append. Not for you to set | `1` |

## Events

- **`append.infiniteScroll`** is fired by the scroll library on the list after each page is appended. The module listens to it to count the page, update the URL and send analytics. You can listen too: `$('.products.list').on('append.infiniteScroll', function (e, response, path) {})`.
- **`contentUpdated`** is triggered by the module on `body` after each append, so Magento widgets such as swatches, lazy images and add-to-cart re-initialise on the new items. Listen to it to run your own code on new products.

## Analytics and virtual pageviews

When Track Virtual Pageviews is Yes, each appended page sends a page view:

- With **GA4** (`window.gtag` exists): `gtag('event', 'page_view', { page_path, page_location })` for the page loaded.
- Otherwise with **legacy analytics.js** (`window.ga`): `ga('set', 'page', path)` then `ga('send', 'pageview')`.
- If neither is present, nothing is sent.

## History

The module changes the address with `history.replaceState` (not `pushState`) when the loaded path has a `p=` parameter, keeping other query parameters. No history entry is added. See [How it behaves](behaviour.md#the-address-bar-follows-the-page).

## Debug logging

Switch Debug Logging to Yes and open the browser console. Messages start with `[CoullWorks Infinite Scroll]` and show when the component starts, which container it found, when the URL changes and when it finds no next link. Switch it off in production.

## CSS hooks

| Class | What it is |
|---|---|
| `cw-infinite-scroll--layout` | Added to the list in Masonry, Isotope and Packery modes. Product items start at opacity 0 with a 0.2 s transition |
| `cw-infinite-scroll--ready` | Added once images are measured. Items go to opacity 1 |
| `cw-infinite-scroll__status`, `.page-load-status` | The status wrapper. Hidden until the library shows it. Top border `#ddd`, centred, grey `#777` text |
| `cw-infinite-scroll__more`, `.view-more-button` | The View More wrapper and button. The button is `action primary`, hidden by CSS and shown by script when needed. Its text is the translatable phrase "View More" |
| `loader-ellips`, `loader-ellips__dot` | The four-dot loading animation, hidden from assistive technology. Dot colour `#555` |
| `infinite-scroll-request`, `infinite-scroll-last`, `infinite-scroll-error` | Library state elements inside the status block, shown and hidden by the library |


The module defines no CSS custom properties or LESS variables. The colours above are fixed. To change them, override the classes in your theme.

## Templates

`view/frontend/templates/scroll.phtml` writes the status template (loader, last-page and error paragraphs and the View More button, as `x-magento-template` script `coullworks-scroll-status`) and the `x-magento-init` payload from the block. Override it in your theme only if you need different markup.

## Accessibility

- The loading dots are `aria-hidden`.
- View More is a real `<button type="button">`, so it is reachable and operable by keyboard.
- The end and error messages are plain paragraphs with no `aria-live` or `role="status"`, so a screen reader does not announce new items or the end message on its own. If you need announcements, add an `aria-live` region through a theme override or listen to `contentUpdated`.

## Self-hosted libraries

Only `uiComponent`, `jquery` and `mage/template` load up front. The scroll library (`infinite-scroll`, `imagesloaded`, `jquery-bridget`) loads when the component boots, and `masonry`, `isotope` or `packery` loads only when selected. All of them live in the module's `js/vendor` folder, so no request goes to a CDN.

## Bundled libraries

Infinite Scroll 3.0.6, Isotope 3.0.6 (both GPLv3 or commercial) and Packery 2.1.2 (GPLv3 or commercial), plus Masonry, imagesLoaded and jQuery Bridget. The module's own code is MIT. Licence details are in `THIRD-PARTY-LICENSES.md` in the module.

## Translations

`i18n/en_US.csv` holds the 29 phrases the module uses: field labels and comments, layout names, "View More" and the default texts. Copy the file into your own language pack to translate them.

## What the module does not install

- No CLI commands.
- No cron jobs.
- No data patches, database tables, web API routes or `events.xml` observers. The module has only its module declaration, `config.xml`, ACL, widget and admin configuration files.
