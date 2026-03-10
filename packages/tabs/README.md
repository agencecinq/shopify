[![](https://img.shields.io/npm/v/@agencecinq/tabs)](https://www.npmjs.com/package/@agencecinq/tabs)
[![](https://img.shields.io/npm/dm/@agencecinq/tabs)](https://www.npmjs.com/package/@agencecinq/tabs)

# @agencecinq/tabs

> Tabulation partout, tabulation nulle part

## Installation

```bash
pnpm add @agencecinq/tabs
```

## Usage

### Web Component (`<cinq-tabs>`)

```html
<cinq-tabs class="js-tabs" data-tabs-hash="true">
  <div role="tablist" aria-label="navigation">
    <button
      type="button"
      class="is-active"
      role="tab"
      aria-selected="true"
      aria-controls="home-tab"
      id="home"
    >
      Home
    </button>
    <button
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="project-tab"
      id="project"
      tabindex="-1"
    >
      Project
    </button>
    <button
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="contact-tab"
      id="contact"
      tabindex="-1"
      data-deletable
    >
      Contact
    </button>
  </div>

  <section tabindex="0" role="tabpanel" aria-labelledby="home" id="home-tab">
    …
  </section>
  <section tabindex="0" role="tabpanel" aria-labelledby="project" id="project-tab">
    …
  </section>
  <section tabindex="0" role="tabpanel" aria-labelledby="contact" id="contact-tab">
    …
  </section>
</cinq-tabs>
```

```js
import "@agencecinq/tabs";
```

#### Why nothing needs to be initialized

When you import `@agencecinq/tabs`, the module registers the Web Component in the
**Custom Elements Registry**:

```js
customElements.define('cinq-tabs', Tabs);
```

The browser then automatically “upgrades” every existing `<cinq-tabs>` in the DOM:
it instantiates the `Tabs` class, calls its `connectedCallback`, which in turn
calls `init()`.  
You don’t need to do `new Tabs(...)` or call `init()` manually – writing the
markup and importing the module is enough.

### Tablist

The element that serves as a container for the set of tabs. The `role="tablist"` attribute is required.  
The `aria-label=""` attribute provides a label that describes the purpose of the set of tabs.

The `role="tablist"`needs to be on a container element such as a `<div>`, `<nav>`, or `<section>`. It should not be placed on a `<ul>` element. Direct children of the tablist must be the tab elements with `role="tab"`.

```html
<div role="tablist" aria-label="navigation">
	<button
		type="button"
		class="is-active"
		role="tab"
		aria-selected="true"
		aria-controls="home-tab"
		id="home"
	>
		Home
	</button>
	<button
		type="button"
		role="tab"
		aria-selected="false"
		aria-controls="project-tab"
		id="project"
		tabindex="-1"
	>
		Project
	</button>
	<button
		type="button"
		role="tab"
		aria-selected="false"
		aria-controls="contact-tab"
		id="contact"
		tabindex="-1"
		data-deletable=""
	>
		Contact
	</button>
</div>
```

### Tab

An element in the tab list that serves as a label for one of the tab panels and can be activated to display that panel.

```html
<button
	type="button"
	role="tab"
	aria-selected="false"
	aria-controls="foo-tab"
	id="foo"
	tabindex="-1"
>
	Project
</button>
```

The `role="tab"` attribute is required.

The `aria-controls="foo-tab"` refers to the id of the tabpanel element associated with the tab.

Since an HTML button element is used for the tab, it is not necessary to set `tabindex="0"` on the selected (active) tab element.

Is the tabulation deletable? You can set up this option by adding the `data-deletable` attribute on button.

To active the button on first load, add a `is-active` class to the button, remove the `tabindex` attribute and switch to `true` the `aria-selected` attribute.

### Tabpanel

The element that contains the content associated with a tab.

```html
<section tabindex="0" role="tabpanel" aria-labelledby="foo" id="foo-tab">
	<p>
		The galeb duhr is a curious boulder-like creature with appendages that act as hands and feet.
		These intelligent beings are very large and slow-moving. They live in rocky or mountainous
		areas where they can feel the earth power and control the rocks around them.
	</p>
</section>
```

To active panel on first load, add a `is-active` class to it.

## Keyboard support

| Key                       | Function                                                                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tab                       | <ul><li>When focus moves into the tab list, places focus on the active tab element</li><li>When the tab list contains the focus, moves focus to the next element in the tab sequence, which is the <code>tabpanel</code> element.</li></ul> |
| Enter<br>Space            | When a tab has focus, activates the tab, causing its associated panel to be displayed.                                                                                                                                         |
| Right Arrow               | When a tab has focus (LTR): moves focus to the next tab (wraps to first on last). In RTL, Right Arrow moves to the previous tab.                                                                                               |
| Left Arrow                | When a tab has focus (LTR): moves focus to the previous tab (wraps to last on first). In RTL, Left Arrow moves to the next tab.                                                                                               |
| Home<br>`fn + left arrow` | When a tab has focus, moves focus to the first tab.                                                                                                                                                                            |
| End<br>`fn + right arrow` | When a tab has focus, moves focus to the last tab.                                                                                                                                                                             |
| Delete                    | When focus is on the **Contact** tab, removes the tab from the tab list and places focus on the previous tab.                                                                                                                  |

### RTL (right-to-left)

Navigation with Left/Right arrow keys follows the **reading direction**. If the tablist (or a parent) has `dir="rtl"` or inherits a right-to-left `direction` from CSS, "next" tab is triggered by **Left Arrow** and "previous" by **Right Arrow**, so keyboard behavior matches the visual order (e.g. Arabic, Hebrew).

## Options

Options are configured via **data attributes** on the Web Component:

| Attribute          | Type    | Default | Description                                                                                                      |
| ------------------ | ------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `data-tabs-hash`   | boolean | `true`  | Enables or disables synchronization of the active tab with `location.hash`.                                      |
| `data-tabs-delay`  | number  | `0`     | Delay in ms before automatic activation when the user navigates with arrow keys (0 = no delay, i.e. manual mode). |

## Events

Events are dispatched on the **tab** element (the button with `role="tab"`). Listen on the tab, or use event delegation from `<cinq-tabs>`.

| Event                | Cancelable | Detail                                      | Description                                                                 |
| -------------------- | ---------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| `tab-before-activate`| Yes        | `{ index, controls, element }`              | Fired before activation. Call `preventDefault()` to cancel. For async work, cancel then call `tabs.activateTab(index)` when ready. |
| `tab-activate`       | No         | `{ controls, element }`                     | Fired when the tab is activated.                                           |
| `tab-delete`         | No         | `{ controls, element }`                      | Fired when the tab is removed.                                             |

### Method: `activateTab(index)`

On the `<cinq-tabs>` element (or the `Tabs` instance). Call after preventing `tab-before-activate` to complete activation (e.g. after loading data).

```javascript
const tabsEl = document.querySelector('cinq-tabs');

tabsEl.addEventListener('tab-before-activate', (e) => {
  const { index, controls, element } = e.detail;

  // Optional: cancel and activate later (e.g. after async work)
  e.preventDefault();
  fetchData(controls).then(() => {
    tabsEl.activateTab(index);
  });
});

// Or: just listen to tab-activate (no cancel)
tabsEl.querySelectorAll('[role="tab"]').forEach((tab) => {
  tab.addEventListener('tab-activate', ({ detail }) => {
    console.log('activated', detail.controls, detail.element);
  });
});
```

## Build Setup

```bash
# depuis la racine du monorepo CINQ
pnpm -C packages/tabs build
```

## Acknowledgments

-   [Deciding When to Make Selection Automatically Follow Focus](https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus)
-   [Example of Tabs with Manual Activation](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/)
-   [Example of Tabs with Automatic Activation](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/)
-   [Keycode](https://keycode.info/) by [Wes Bos](https://wesbos.com/)
