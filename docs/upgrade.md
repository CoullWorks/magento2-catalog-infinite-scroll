# Upgrade Catalog Infinite Scroll for Magento 2

## Update

```bash
composer update coullworks/module-catalog-infinite-scroll
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
bin/magento cache:flush
```

The last three lines are production mode. Your saved settings are kept.

## From 2.1.0 to 2.1.1

A bug-fix release with no settings to change. It fixes Back from the last page, the loading dots and the end message, the scroll position after Back from page 3, and the layout of Masonry, Isotope and Packery. See the [changelog](changelog.md).

## From 2.0.x to 2.1

- Enable Infinite Scroll can now be set per website and store view.
- View More now shows at every width when Load On Scroll is No.
- The URL is replaced with the real `?p=N` page and adds no history entries. Back from a product page restores the list.
- The widget has new parameters for Scroll Threshold, Track Virtual Pageviews, Update Browser URL and Debug Logging. Empty means "use the store setting", so existing widgets behave as before.

## From the BoxLeaf module (before 2.0.0)

The package name, module name, namespace and configuration paths changed, so 2.0.0 installs as a new module. Remove the old `boxleaf/module-infinatescroll`, install `coullworks/module-catalog-infinite-scroll`, then set your options again under **Stores, Configuration, CoullWorks**. See the [changelog](changelog.md).
