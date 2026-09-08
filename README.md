<p align="center">
  <img src="assets/banner.png" alt="CoullWorks Catalog Infinite Scroll for Magento 2" width="820">
</p>

<h1 align="center">Catalog Infinite Scroll</h1>

<p align="center">
  <b>Seamless AJAX infinite scroll &amp; load-more for Magento 2.</b><br>
  Auto-loads the next page of products as shoppers reach the bottom — on category,
  search, <b>Page Builder</b>, <b>CMS</b> and <b>widget</b> lists — with optional
  masonry, isotope and packery layouts. Configured entirely from the admin, tuned
  to protect Core Web Vitals, and self-hosted with <b>zero third-party CDN calls</b>.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT"></a>
  <a href="https://github.com/CoullWorks/magento2-catalog-infinite-scroll/releases/latest"><img src="https://img.shields.io/github/v/release/CoullWorks/magento2-catalog-infinite-scroll?label=version&color=ff6a2c" alt="latest release"></a>
  <img src="https://img.shields.io/badge/Magento-2.4.7%20–%202.4.9-f46f25" alt="Magento 2.4.7–2.4.9">
  <img src="https://img.shields.io/badge/PHP-8.2%20|%208.3%20|%208.4-777bb4" alt="PHP 8.2–8.4">
  <img src="https://img.shields.io/badge/CDN%20calls-none-brightgreen" alt="no third-party CDN">
</p>

---

Replace clunky numbered pagination with a continuous, app-like browsing experience.
Shoppers keep scrolling and products keep loading — no clicks, no full page reloads —
which keeps them in the catalogue longer. On narrow screens it switches to a tidy
**View More** button instead of hijacking the scroll.

## Why

Most infinite-scroll extensions bolt onto the category page and stop there, pull their
JavaScript from public CDNs, and quietly hurt your Largest Contentful Paint by hiding
the grid until a layout library boots.

This one is built the opposite way:

- **It works on any list**, not just the category grid — a widget drops it onto Page
  Builder blocks, CMS pages and static blocks, and it can drive several lists on one page.
- **It protects LCP.** The default mode never hides your products, and the masonry /
  isotope / packery libraries only download when you actually choose one of them.
- **It calls nothing external.** Every library is self-hosted in the module, so there's
  no third-party request, no CSP headache and nothing to break when a CDN does.

## Install

```sh
composer require coullworks/module-catalog-infinite-scroll
bin/magento module:enable CoullWorks_CatalogInfiniteScroll
bin/magento setup:upgrade
bin/magento setup:di:compile           # production mode only
bin/magento setup:static-content:deploy -f   # production mode only
bin/magento cache:flush
```

Requires Magento Open Source / Adobe Commerce **2.4.7–2.4.9** on **PHP 8.2–8.4**.

## Configure

**Stores → Configuration → CoullWorks → Catalog Infinite Scroll.** Enable it and the
module attaches to your category and search result pages automatically. Every option is
per store view.

| Setting | What it does | Default |
|---|---|---|
| **Enable Infinite Scroll** | Auto-attach to category & search lists (widgets work regardless). | Yes |
| **Load On Scroll** | Auto-load near the bottom vs. only on the "View More" button. | Yes |
| **Scroll Threshold (px)** | Distance from the bottom at which loading starts. | 100 |
| **Track Virtual Pageviews** | Send a `page_view` to GA4 (`gtag`) or legacy `analytics.js` per page. | Yes |
| **Update Browser URL** | Reflect the loaded page in the address bar (History API). | Yes |
| **Next Button Selector** | CSS selector for the pagination "next" link. | `.pages-item-next .action.next` |
| **List Container Selector** | CSS selector(s) for the list wrapper. Comma-separate for several lists. | category & Page Builder grids |
| **Item Selector** | CSS selector for a single item in the list. | `.item.product.product-item` |
| **Hide Pagination** / **Pagination Selector** | Hide the original pager once scroll takes over. | Yes |
| **Show End Status** / **End Status Text** | Loading spinner + an end-of-list message. | Yes / "No more products" |
| **Layout Mode** | Default grid, or Masonry / Isotope / Packery. | Default |
| **Debug Logging** | Log lifecycle events to the browser console. | No |

## Layout modes

`Default` keeps your theme's native grid — nothing extra loads. Choose **Masonry**,
**Isotope** or **Packery** and the matching library is fetched **only then**, and the
grid fades in once images are measured so items don't jump. The default mode never hides
content, so it has no effect on LCP.

## Use it on any list (Page Builder, CMS, static blocks)

Add the **"Infinite Scroll (CoullWorks)"** widget wherever you can insert content:

- **Page Builder** — add an *Insert Widget* content type to any row/column.
- **CMS pages & static blocks** — *Insert Widget* in the editor, or the `{{widget}}` directive.
- **Layout XML** — a `<widget>` / `<block>` instruction.

Point it at the list's **Container Selector**, **Item Selector** and **Next Button
Selector**, pick a layout mode, and it runs — no code. Because Magento initialises the
component per matched element, one page can host several independent infinite lists.

**AJAX layered navigation:** if a filter replaces the product list without a full page
reload, the module detects the swap and re-initialises on the new list automatically —
no theme wiring or extension-specific hooks required.

<details>
<summary><b>Wiring it up by hand on a fully custom list</b></summary>

The block emits a standard `text/x-magento-init`. To drive an arbitrary list yourself,
render the same shape, pointing the component at your selectors:

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

`display_type`: `1` default · `2` masonry · `3` isotope · `4` packery. Works on any
nested markup, `<div>` or `<ul>`, as long as the container holds repeating items and
there's a "next" link to follow.
</details>

## Performance &amp; Core Web Vitals

- **No render-blocking and no CDN.** Only `jquery`, `uiComponent` and `mage/template`
  (already on the page) load up front; the scroll library loads asynchronously after render.
- **Pay only for what you use.** Masonry/Isotope/Packery are lazy-`require`d per mode.
- **LCP-safe reveal.** The grid-hiding reveal is scoped to layout modes only.
- **Analytics-aware.** Appends fire a GA4 virtual pageview so infinite scroll doesn't
  blank your page metrics.

## How it works

- A small `uiComponent` (`view/frontend/web/js/scroll.js`) is initialised once per matched
  container by `text/x-magento-init`, so the same code drives the auto-attach and every widget.
- A single PHP block (`Block/Scroll.php`) builds the init payload, preferring widget
  parameters over store config — one source of truth, reused everywhere.
- The frontend stack is [Infinite Scroll](https://infinite-scroll.com), with
  [Masonry](https://masonry.desandro.com) / [Isotope](https://isotope.metafizzy.co) /
  [Packery](https://packery.metafizzy.co), all **self-hosted** under
  `view/frontend/web/js/vendor/`.

## Compatibility

| | |
|---|---|
| **Magento** | Open Source / Adobe Commerce 2.4.7, 2.4.8, 2.4.9 |
| **PHP** | 8.2, 8.3, 8.4 |
| **Themes** | Luma, Hyvä-adjacent and custom themes (jQuery/RequireJS frontends) — set the selectors to match your markup |

## Development

```sh
composer install
vendor/bin/phpcs --standard=phpcs.xml     # Magento 2 coding standard
vendor/bin/phpunit                        # unit tests (needs magento/framework)
```

CI (GitHub Actions) runs PHP lint across 8.2/8.3/8.4, the Magento 2 coding standard,
`composer validate` and ESLint on every push and PR.

## Roadmap

- **CoullWorks Infinite Scroll SDK** — a dependency-free (MIT) infinite-scroll library,
  raw TS/JS plus a React wrapper, to replace the Metafizzy stack and make this module MIT
  end to end.
- **CoullWorks Core** — a shared base module (branding, helpers, config plumbing) reused
  across all CoullWorks Magento plugins.

## Third-party licenses

The bundled browser libraries keep their own licenses; Infinite Scroll, Isotope and
Packery are **GPLv3 / commercial**. Details and the commercial-licensing note are in
[THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md).

## Support

Free and open source. If it saves you time, you can support the work:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-ffdd00?logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/BHaNOMl)
 or PayPal — ttechitsolutions@gmail.com

Questions and bugs: [open an issue](https://github.com/CoullWorks/magento2-catalog-infinite-scroll/issues).

## License

[MIT](LICENSE) © CoullWorks

---

<p align="center">
  <a href="https://coullworks.com"><b>⚓ Powered by CoullWorks</b></a><br>
  <sub>Built in the open by <a href="https://coullworks.com">CoullWorks</a> — web &amp; software engineering. <a href="https://coullworks.com">coullworks.com</a></sub>
</p>
