# Magento 2 - infinate Scroll

From  [boxleaf Digital](https://www.boxleafdigital.com)

Allows the page to load automatically more products on the search results and category lists pages as customers scroll down towards the bottom of the page. Giving the customer a seamless shopping experience. 

The key features is this magento 2.*.* module is its fully supported widget capability to intergrate other types of lists into your theme. Whist allowing full customerisation of how it works directly from magento 2 backend, for the novice magento user to configure it to work as they wish. 

This could be Masonry display, isotope or Packery style displays. As this module is built with magento 2 best practices customization of the javascript itself can easily be made using mixins to do other things using the infinite scroll events. 

Fully customizable to any theme, just change the css clases for your list.

Best part of it This Magento 2 infinite scroll module is FREE

Compatible with any version of magento 2. 

### Can i use this on other lists?

The answer is simple yes of course you can using the template under view/frontend/templates

You can see two segmants

1. the x-magento-template simply load this on to the list you wish to use the autoloader on.
```html
<script id="scroll-status" type="text/x-magento-template">
    <div class="page-load-status">
        <div class="infinite-scroll-request">
            <div class="loader-ellips">
                <span class="loader-ellips__dot"></span>
                <span class="loader-ellips__dot"></span>
                <span class="loader-ellips__dot"></span>
                <span class="loader-ellips__dot"></span>
            </div>
        </div>
        <p class="infinite-scroll-last"><%- data.text %></p>
        <p class="infinite-scroll-error"><%- data.text %></p>
    </div>
</script>
````
2. The actual script initialization 

```html
<script type="text/x-magento-init">
    {
        "<?= $block->getContainer(); ?>": {
            "scroll": <?= $block->getJsonBlock(); ?>
        }
    }
</script>
```


Replace the above as so

```html
<script type="text/x-magento-init">
    {
        ".list-item-container-class": {
            "scroll": " {
                "config": { 
                    path: '.pagination-next-class',
                    append: '.list-item-class',
                    checkLastPage: '.pagination-next-class',
                    scrollThreshold: 100,
                    loadOnScroll: true, // true or false, true by defualt
                    history: 'push', //if you wish to alow back browser button else "false"
                    hideNav: '.pagination-container-class',
                    status: '.page-load-status',
                    debug: false // "false" dont show console logs, "true" do
                },
                "settings": {
                    "enabled": true,
                    "analytics": true,
                    "status": true,
                    "text": "No more products",
                    "display_type": "1" // or 2 - masonry ,3 - isotope,4 - packery
                }
            }"
        }
    }
</script>
```

The above will work on any list whether it nested 

```html
<div class="list-items">
    <div class="list-item">Item1</div>
    <div class="list-item">Item2</div>
    ...etc
</div>
```
Or
 ```html
 <ul class="list-items">
     <li class="list-item">Item1</div>
     <li class="list-item">Item2</div>
     ...etc
 </div>
 ```
Ideas: 

Any ideas feel free to post them in issues where to go next with this. 

Other Modules:

[Magento 2 - Custom Customer Quote Lists](https://github.com/danrcoull/Magento2-Product-Price-List)

Coming Soon:

Company Hirachy 

Installation:

```bash
composer config repositories.productpricelist vcs https://github.com/danrcoull/Magento2-InfiniteScroll.git
composer require boxleaf/module-infinatescroll:dev-master
php bin/magento module:enable BoxLeaf_InfinateScroll
php bin/magento setup:upgrade
php bin/magento setup:di:compile #yes do this we use extension attributes so you can see the original price and the custom price.
php bin/magento setup:static-content:deploy en_GB en_US -f 
php bin/magento cache:flush
 
```

Yes i work hard, plenty more modules to come feel free to by me a coffee below. 



[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/lato-black.png)](https://www.buymeacoffee.com/BHaNOMl)


Infinate Scroll library credit to https://github.com/metafizzy/infinite-scroll
Infinate Scroll License at [infinite-scroll.com](https://infinite-scroll.com/#commercial-license)




