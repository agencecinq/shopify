[![](https://img.shields.io/npm/v/@agencecinq/drawer)](https://www.npmjs.com/package/@agencecinq/drawer)
[![](https://img.shields.io/npm/dm/@agencecinq/drawer)](https://www.npmjs.com/package/@agencecinq/drawer)

# @agencecinq/drawer

> Accessible off-canvas drawer Web Component for Shopify themes.

A drawer slides content in from the edge of the viewport. `<cinq-drawer>`
handles open/close state, focus management, and document-level events.
Includes a Vite plugin to sync Liquid snippets in Shopify projects.

## Installation

Requires **Node.js 18+** (build tooling and `@agencecinq/drawer/plugin`).

```bash
pnpm add @agencecinq/drawer
```

## Usage

```js
import "@agencecinq/drawer";
```

```html
<cinq-drawer id="cart-drawer">
  <div data-dom="overlay"></div>
  <div role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <h2 id="cart-title">Your cart</h2>
    ...
  </div>
</cinq-drawer>

<cinq-drawer-button>
  <button aria-controls="cart-drawer" aria-expanded="false">
    View cart
  </button>
</cinq-drawer-button>
```

Importing `@agencecinq/drawer` registers the Web Components automatically.
No manual `init()` call required.

> **HTML is the source of truth.** Provide dialog semantics, labelling, and
> overlay markup yourself. Use an a11y linter (axe-core, Lighthouse) to catch
> invalid markup.

### Shopify integration

Requires **Node.js 18+** (the plugin uses `fs.cp` from `node:fs/promises`).

Register the Vite plugin in your Shopify project. It copies the
`cinq-drawer.html.liquid` snippet to your theme during development and build:

```typescript
import { defineConfig } from "vite";
import { cinqDrawerPlugin } from "@agencecinq/drawer/plugin";

export default defineConfig({
  plugins: [cinqDrawerPlugin()],
});
```

Render the snippet in Liquid:

```liquid
{% render 'cinq-drawer.html',
   id: 'cart-drawer',
   content: '<p>Your cart is empty.</p>'
%}

<cinq-drawer-button>
  <button aria-controls="cart-drawer" aria-expanded="false">
    View cart
  </button>
</cinq-drawer-button>
```

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `id` | **Yes** | Unique drawer identifier. Must match button `aria-controls`. |
| `open` | No | Reflected open state. Useful for styling. |

| Method | Description |
| ------ | ----------- |
| `open()` | Opens the drawer. Returns `false` if already open, aborted, or deferred. |
| `close()` | Closes the drawer. Returns `false` if already closed, aborted, or deferred. |
| `toggle({ trigger?, trap? })` | Toggles open/close. |
| `destroy()` | Removes listeners. |
| `init()` | Re-binds after DOM mutation. Call `destroy()` first. |

When you mutate drawer DOM at runtime, re-bind with `destroy()`, mutate,
`init()`.

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `drawer:toggle` | `DRAWER_TOGGLE` | No | `{ drawer, trigger, trap }` | Request open/close from a button. |
| `drawer:before-open` | `DRAWER_BEFORE_OPEN` | Yes | `{ drawer, instance, trigger, resolve }` | Fired before `open` is set. Cancel to defer, then call `resolve()`. |
| `drawer:before-close` | `DRAWER_BEFORE_CLOSE` | Yes | `{ drawer, instance, resolve }` | Fired before `open` is removed. Cancel to defer, then call `resolve()`. |
| `drawer:open` | `DRAWER_OPEN` | No | `{ drawer, trigger? }` | Fired after `open` is set. |
| `drawer:close` | `DRAWER_CLOSE` | No | `{ drawer }` | Fired after `open` is removed. |

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.DRAWER_OPEN, (event) => {
  console.log(event.detail.drawer);
});
```

### Deferring open or close

Open and close paths dispatch cancelable `drawer:before-open` /
`drawer:before-close` first. Call `preventDefault()` and commit with
`detail.resolve()` when async work finishes:

```js
document.documentElement.addEventListener(EVENTS.DRAWER_BEFORE_OPEN, (event) => {
  if (event.detail.drawer !== "cart-drawer") return;

  event.preventDefault();

  void doAsyncWork().then(() => {
    event.detail.resolve();
  });
});
```

`resolve()` is idempotent. TypeScript: `BeforeOpenDetail` and
`BeforeCloseDetail` from `@agencecinq/drawer`.

**UX:** defer open when the fetch is quick and the panel would feel empty.
Otherwise open immediately and load on `drawer:open`. Defer close for save,
archive, or exit animation.

## Build setup

```bash
pnpm -C packages/drawer build
```

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/drawer/) for live examples.
