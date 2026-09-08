# Contributing

Thanks for helping improve CoullWorks Catalog Infinite Scroll.

## Reporting bugs & ideas

Open an [issue](https://github.com/CoullWorks/magento2-catalog-infinite-scroll/issues)
with your Magento version, the theme, and the selectors you configured. A screenshot
of the browser console (with **Debug Logging** turned on in the module config) helps a lot.

## Pull requests

1. Fork and branch from `main`.
2. Keep changes focused and follow the existing style.
3. Run the checks locally before pushing:

   ```sh
   composer install
   vendor/bin/phpcs --standard=phpcs.xml        # Magento 2 coding standard
   php -l $(find . -name '*.php' -not -path './vendor/*')   # syntax
   vendor/bin/phpunit                            # unit tests (needs magento/framework)
   ```

4. Add or update a unit test when you change PHP behaviour.
5. Update `CHANGELOG.md` under **Unreleased**.

## Coding standards

- PHP: `declare(strict_types=1)`, typed signatures, Magento 2 coding standard (`phpcs.xml`).
- JavaScript: keep the component dependency-light; layout libraries must stay lazy-loaded.
- Don't add third-party CDN calls — libraries are self-hosted under `view/frontend/web/js/vendor/`.

By contributing you agree your work is licensed under the [MIT License](LICENSE).
