[![](https://img.shields.io/npm/v/@agencecinq/modal)](https://www.npmjs.com/package/@agencecinq/modal)
[![](https://img.shields.io/npm/dm/@agencecinq/modal)](https://www.npmjs.com/package/@agencecinq/modal)

# @agencecinq/modal

> Accessible modal Web Component built on the native `<dialog>` element.

A modal presents content above the page. `<cinq-modal>` wraps a native
`<dialog>`, handles open/close via `showModal()` / `close()`, and coordinates
with `cinq-modal-button` through document-level events.

## Installation

Requires **Node.js 18+** (build tooling).

```bash
pnpm add @agencecinq/modal
```

## Usage

```js
import "@agencecinq/modal";
```

```html
<cinq-modal-button>
  <button aria-controls="newsletter-modal" aria-pressed="false">
    Open modal
  </button>
</cinq-modal-button>

<cinq-modal id="newsletter-modal">
  <dialog>
    ...
  </dialog>
</cinq-modal>
```

Importing `@agencecinq/modal` registers the Web Components automatically.
No manual `init()` call required.

> **HTML is the source of truth.** Provide dialog content, labelling, and focus
> targets yourself. Use an a11y linter (axe-core, Lighthouse) to catch invalid
> markup.

### Required markup

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `<cinq-modal>` | **Yes** | Modal host. Requires an `id` for event-driven open/close. |
| `<dialog>` or `[data-dialog]` | **Yes** | Native dialog element inside the host. |
| `id` on `<cinq-modal>` | **Yes** | Must match button `aria-controls`. |
| `aria-controls` on trigger | **Yes** | Points to the modal `id`. |

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `id` | **Yes** | Modal identifier. Must match button `aria-controls`. |
| `open` | No | Reflected open state. Useful for styling. |

| Method | Description |
| ------ | ----------- |
| `show()` | Opens the modal. Returns `false` if already open, aborted, or deferred. |
| `close()` | Closes the modal. Returns `false` if already closed, aborted, or deferred. |

### Wiring with `cinq-modal-button`

`cinq-modal-button` dispatches `modal:toggle` on `document.documentElement` with:

- `detail.modal`: the modal id from the button `aria-controls`
- `detail.trigger`: the button element
- `detail.trap`: optional element from `data-trap`

`cinq-modal` listens to `modal:toggle` and toggles itself when `detail.modal`
matches its `id`.

### Background scroll

The package does **not** lock document scroll. Native `showModal()` makes the
page inert but the backdrop can still scroll underneath. Prefer CSS in the
theme:

```css
html:has(dialog[open]:modal) {
  overflow: hidden;
  scrollbar-gutter: stable;
}
```

Or refcount `modal:open` / `modal:close` with `disableScroll` / `enableScroll`
from `@agencecinq/utils` if the theme already uses those helpers.

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `modal:toggle` | `MODAL_TOGGLE` | No | `{ modal, trigger, trap }` | Request open/close from a button. |
| `modal:before-open` | `MODAL_BEFORE_OPEN` | Yes | `{ modal, instance, trigger, resolve }` | Fired before `open` is set. Cancel to defer, then call `resolve()`. |
| `modal:before-close` | `MODAL_BEFORE_CLOSE` | Yes | `{ modal, instance, resolve }` | Fired before `open` is removed. Cancel to defer, then call `resolve()`. |
| `modal:open` | `MODAL_OPEN` | No | `{ modal, trigger? }` | Fired after `open` is set. |
| `modal:close` | `MODAL_CLOSE` | No | `{ modal }` | Fired after `open` is removed. |

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.MODAL_OPEN, (event) => {
  console.log(event.detail.modal);
});
```

### Deferring open or close

```js
document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_OPEN, (event) => {
  if (event.detail.modal !== "newsletter-modal") return;

  event.preventDefault();

  void doAsyncWork().then(() => {
    event.detail.resolve();
  });
});
```

`resolve()` is idempotent. TypeScript: `BeforeOpenDetail` and
`BeforeCloseDetail` from `@agencecinq/modal`.

**UX:** defer open when the fetch is quick and the dialog would feel empty.
Otherwise open immediately and load on `modal:open`. Defer close for save,
archive, or exit animation.

## Build setup

```bash
pnpm -C packages/modal build
```

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/modal/) for live examples.
