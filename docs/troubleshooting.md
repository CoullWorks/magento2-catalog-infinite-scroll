# Troubleshooting Catalog Infinite Scroll

Turn on **Debug Logging** and open the browser console first. Messages start with `[CoullWorks Infinite Scroll]`.

## Nothing happens when I scroll

1. Check **Enable Infinite Scroll** is Yes for the store view you are testing, and the Configuration and Page Cache are refreshed.
2. The console says "No next-page link found for selector": your theme's next link differs. Inspect the pager's "next" link and set **Next Button Selector**.
3. Check **List Container Selector** and **Item Selector** match your theme's markup.
4. The category has only one page of products, so there is nothing to load.
5. Your theme replaces the product list with its own JavaScript. Set the selectors by hand and test.

## The old pager still shows

Hide Pagination must be Yes, and **Pagination Selector** must match your pager. The widget uses its own preset (`.pages`).

## The View More button is missing

On a screen 768 px or wider with Load On Scroll set to Yes the module scrolls on its own, so there is no button by design. Set Load On Scroll to No to show it at every width. The button also hides once the last page has loaded.

## The same product appears twice or items overlap

Check the Item Selector matches exactly one tile per product, not an inner element. If items overlap in Masonry, Isotope or Packery, update to 2.1.1 or later, which fixed the layout of those modes on Luma. See [Layout modes](layout-modes.md).

## There is no loading animation or end message

Show End Status must be Yes. See the note under [End Status](configure.md#show-end-status).

## Back from a product page does not restore the list

It needs Update Browser URL set to Yes, the same tab and a working `sessionStorage`. If a fetch of an earlier page fails, only the page in the URL shows. See [How it behaves](behaviour.md#back-and-forward).

## Analytics counts each page twice

Another script may also send a page view on `contentUpdated` or history changes. Set Track Virtual Pageviews to No, or remove the other.

## A filter extension stops infinite scroll working

Make sure the List Container Selector matches the list after the filter has replaced it. The module re-attaches on its own when it finds the next link again.
