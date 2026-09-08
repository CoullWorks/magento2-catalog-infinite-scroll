# Third-party licenses

CoullWorks Catalog Infinite Scroll is released under the [MIT License](LICENSE).
It bundles the following browser libraries under `view/frontend/web/js/vendor/`.
Each file keeps its upstream license banner. The libraries are the property of
their respective authors and are redistributed here unmodified.

| Library | Version | License | Project |
|---|---|---|---|
| Infinite Scroll | 3.0.6 | **GPLv3** or [Commercial](https://infinite-scroll.com/license.html) | https://infinite-scroll.com |
| Isotope | 3.0.6 | **GPLv3** or [Commercial](https://isotope.metafizzy.co/license.html) | https://isotope.metafizzy.co |
| Packery | 2.1.2 | **GPLv3** or [Commercial](https://packery.metafizzy.co/license.html) | https://packery.metafizzy.co |
| Masonry | 4.2.2 | MIT | https://masonry.desandro.com |
| imagesLoaded | 4.1.4 | MIT | https://imagesloaded.desandro.com |
| jQuery Bridget | 2.0.1 | MIT | https://github.com/desandro/jquery-bridget |

## About the Metafizzy (GPLv3) libraries

Infinite Scroll, Isotope and Packery by Metafizzy are dual-licensed: **GPLv3 for
open-source use, or a commercial licence otherwise**. This module ships them so it
works out of the box, and it is itself open source (MIT), so open-source use is
covered by GPLv3.

- **Infinite Scroll** is the core dependency and always loads when the module is active.
- **Isotope** and **Packery** load **only** when you select those layout modes, so a
  store on the default or Masonry layout never ships GPLv3 code to the browser.

If your use requires it, buy the relevant commercial licence from Metafizzy — the
bundled files are the standard distributions, so no code change is needed.

## Roadmap

A future **CoullWorks Infinite Scroll SDK** (dependency-free, MIT) will replace the
Metafizzy stack so this module can be fully MIT end to end. See the
[roadmap](README.md#roadmap).
