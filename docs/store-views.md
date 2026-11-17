# Catalog Infinite Scroll settings per store view

Every setting can be set at **Default Config**, **website** and **store view** scope. A store view inherits from its website, and a website from the default, until you untick **Use Website** (or **Use Default**) and set its own value. This walkthrough turns infinite scroll off for one store view, called Second View.

## 1. Switch to the store view

Open **Stores, Configuration, CoullWorks, Catalog Infinite Scroll**. Use the **Scope** switcher at the top left and pick **Second View**.

![The Scope switcher showing Second View, with every field greyed out and Use Website ticked](screenshots/infinite-scroll-scope-switcher-second-view-1280.webp)

*Every field shows the inherited value and has a **Use Website** tick box. Nothing can be edited until you untick it.*

## 2. Override the one field

Untick **Use Website** next to **Enable Infinite Scroll** and choose **No**.

![Enable Infinite Scroll set to No for the store view, with Use Website unticked](screenshots/infinite-scroll-cfg-enable-store-view-1280.webp)

*Only this field is overridden. The others stay greyed out and keep inheriting.*

## 3. Save

Press **Save Config**.

![The store view after saving, with the message You saved the configuration](screenshots/infinite-scroll-scope-saved-second-view-1280.webp)

*Saved. The field now reads No at this store view, and the rest still follow the website.*

## 4. Check the storefront

Refresh the Configuration and Page Cache types, then open a category in that store view. The normal pager is back and nothing loads on scroll. Other store views are unchanged.

![A category page in the store view where the module is off, showing the numbered pager](screenshots/infinite-scroll-store-view-scope-off-1280.webp)

*The numbered pager, 1 2 3 4 and a next arrow, is back because Enable Infinite Scroll is No for this store view.*

## Good to know

- A widget on a CMS page still works in a store view where Enable is No, because the widget does not read that setting.
- The widget reads every other setting from the store view the page is shown in, unless the widget's own parameter is filled in.
