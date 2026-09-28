# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.3] - 2026-09-28

### Changed
- **PHP 8.5 support, so the module installs on Magento 2.4.9.** Adobe Commerce and
  Magento Open Source 2.4.9 run production on PHP 8.5, which the Composer constraint did
  not allow, so the package would not install there. The constraint now includes
  `~8.5.0`, and CI lints every PHP file on 8.5 as well as 8.2, 8.3 and 8.4. No code
  changes were needed: every file lints clean on PHP 8.5.11, and none uses the casts,
  backtick operator or `__sleep`/`__wakeup` that 8.5 deprecates.

## [2.0.2] - 2026-09-09

### Fixed
- **Admin config-tab logo now loads.** The admin stylesheet was declared in a layout file
  under `etc/adminhtml/layout/`, which Magento does not read — layout files must live in
  `view/adminhtml/layout/`. Moved it there so the CoullWorks logo actually shows on the
  Stores → Configuration tab.

## [2.0.1] - 2026-09-08

### Fixed
- **Infinite scroll now survives AJAX layered navigation.** When a filter replaces the
  product list without a full page reload, the module detects the swap and
  re-initialises on the new list automatically — previously it silently stopped working
  until the page was reloaded. Resolves #2.
- **No more overlapping items after append** in the masonry/isotope/packery modes: the
  appended items are re-laid-out through Infinite Scroll's `outlayer` integration, and
  the layout libraries stay lazy-loaded per mode. Resolves #4.

## [2.0.0] - 2026-09-08

The first CoullWorks release — a full rebrand and modernization of the original
`boxleaf/module-infinatescroll`. **This is a breaking change**: the package name,
module name, PHP namespace and configuration paths have all changed, so it installs
as a new module rather than an upgrade (see _Migration_ below).

### Changed
- **Rebranded to CoullWorks.** Package `boxleaf/module-infinatescroll` →
  `coullworks/module-catalog-infinite-scroll`; module `BoxLeaf_InfinateScroll` →
  `CoullWorks_CatalogInfiniteScroll`; namespace `BoxLeaf\InfinateScroll` →
  `CoullWorks\CatalogInfiniteScroll` (fixing the "Infinate" typo throughout).
- **Modernized for Magento 2.4.7–2.4.9 / PHP 8.2–8.4.** `declare(strict_types=1)`,
  typed signatures, constructor property promotion, `readonly` dependencies, and a
  valid `magento/framework` requirement (removed the invalid `minimum-stability: dev`).
- **Licensed MIT** (was OSL-3.0/AFL-3.0), with an added `LICENSE` file.
- Config section moved to a branded **CoullWorks** tab at
  `catalog_infinite_scroll/general/*` with its own ACL resource, clearer labels,
  inline help and field validation.
- Analytics upgraded from the retired Universal Analytics `ga()` to **GA4 `gtag`**,
  falling back to legacy `analytics.js` when present.

### Added
- **Works on any list.** A **widget** ("Infinite Scroll (CoullWorks)") to attach
  infinite scroll to **Page Builder** lists, **CMS pages**, **static blocks** and
  layout — no code required.
- **Multi-list support**: the container field accepts comma-separated selectors, and
  each matching list is initialised independently.
- Configurable **item selector**, **scroll threshold** and **update-URL** toggle.
- **Self-hosted libraries.** Infinite Scroll, Masonry, Isotope, Packery, imagesLoaded
  and jQuery Bridget are bundled locally — **no third-party CDN calls at runtime**
  (better privacy, CSP-friendliness and reliability). See `THIRD-PARTY-LICENSES.md`.
- The **CoullWorks logo** on the configuration tab in Stores → Configuration.
- Unit tests, a Magento 2 `phpcs` ruleset, `phpstan` config and a **GitHub Actions CI**
  workflow.
- `CONTRIBUTING.md`, `SECURITY.md`, `THIRD-PARTY-LICENSES.md` and a comprehensive README.

### Fixed
- **LCP/CLS regression:** the grid is no longer hidden (`opacity: 0`) on the default
  layout — the reveal now applies **only** to the masonry/isotope/packery modes, so
  Largest Contentful Paint is not delayed for the common case.
- Removed a call to an **undefined `mediaCheck()`** global (which threw on themes that
  didn't ship it); the responsive "View More" behaviour now uses `window.matchMedia`.
- **Performance:** masonry/isotope/packery (and their weight) load **only** when that
  layout mode is selected, instead of on every page.
- Stray `console.log` calls are now gated behind the **Debug Logging** setting.

### Removed
- The intrusive "End Page N" row markers that were injected into the product grid.

### Migration from `boxleaf/module-infinatescroll`
1. `composer remove boxleaf/module-infinatescroll` and
   `bin/magento module:disable BoxLeaf_InfinateScroll`.
2. `composer require coullworks/module-catalog-infinite-scroll`.
3. `bin/magento module:enable CoullWorks_CatalogInfiniteScroll && bin/magento setup:upgrade`.
4. Re-enter your settings under **Stores → Configuration → CoullWorks → Catalog Infinite
   Scroll** (config now lives at `catalog_infinite_scroll/general/*`).

## Roadmap
- **CoullWorks Infinite Scroll SDK** — a dependency-free (MIT) infinite-scroll library
  (raw TS/JS + React) to replace the Metafizzy stack and make the module MIT end to end.
- **CoullWorks Core** — a shared base module (branding, helpers) across CoullWorks plugins.

## 1.2.0 - 2021-01-20
- Final release under the original `boxleaf/module-infinatescroll` name.

[2.0.3]: https://github.com/CoullWorks/magento2-catalog-infinite-scroll/releases/tag/v2.0.3
[2.0.2]: https://github.com/CoullWorks/magento2-catalog-infinite-scroll/releases/tag/v2.0.2
[2.0.1]: https://github.com/CoullWorks/magento2-catalog-infinite-scroll/releases/tag/v2.0.1
[2.0.0]: https://github.com/CoullWorks/magento2-catalog-infinite-scroll/releases/tag/v2.0.0
