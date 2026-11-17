# Install Catalog Infinite Scroll for Magento 2

## Requirements

| Item | Supported |
|---|---|
| Package | `coullworks/module-catalog-infinite-scroll`, module name `CoullWorks_CatalogInfiniteScroll`, MIT licence |
| Magento | Open Source and Adobe Commerce 2.4.7, 2.4.8 and 2.4.9 |
| PHP | 8.2, 8.3, 8.4 and 8.5 |
| Themes | Luma and custom themes with a jQuery and RequireJS frontend. Set the selectors to match your markup |
| Not supported | Hyvä, headless and PWA front ends |

## Install with Composer

Run these from the Magento root:

```bash
composer require coullworks/module-catalog-infinite-scroll
bin/magento module:enable CoullWorks_CatalogInfiniteScroll
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
bin/magento cache:flush
```

`setup:di:compile` and `setup:static-content:deploy` are for production mode only. In developer mode skip them.

## Install by copying the files

If you cannot use Composer, download the release from GitHub and copy it to `app/code/CoullWorks/CatalogInfiniteScroll` so that `registration.php` sits directly inside that folder. Then run the same `module:enable`, `setup:upgrade`, compile, deploy and `cache:flush` commands as above.

## Check it worked

1. `bin/magento module:status CoullWorks_CatalogInfiniteScroll` lists the module as enabled.
2. In the admin, **Stores, Configuration** shows a **CoullWorks** tab with **Catalog Infinite Scroll** under it.
3. Open a category with more than one page of products on the storefront and scroll. The next page should load in. If it does not, see [Troubleshooting](troubleshooting.md).

The module adds no database tables, cron jobs or CLI commands. Removing it later is `composer remove` and `setup:upgrade`.

## Upgrading from the old BoxLeaf module

Version 2.0.0 was a rebrand of the original `boxleaf/module-infinatescroll`. The package name, module name, PHP namespace and configuration paths all changed, so it installs as a new module rather than an upgrade. See the [upgrade guide](upgrade.md) and the [changelog](changelog.md).

Next, [get started in five minutes](get-started.md).
