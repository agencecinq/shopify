# @agencecinq/modal

A lightweight, accessible Web Component wrapper around the native HTML `<dialog>` element, designed for Shopify themes. Part of the **CINQ** internal tools ecosystem.

## Features

- **Native `<dialog>`**: Uses `showModal()` / `close()` for a solid baseline behavior.
- **Backdrop click to close**: Click outside the dialog content to close (on the dialog backdrop).
- **Event-driven**: Works with the shared `@agencecinq/utils` event names.

---

## Installation

```bash
pnpm add @agencecinq/modal
```

---

## Usage (Shopify integration)

### 1. Import the components

In your theme entry (e.g. `theme.ts`, `main.js`):

```js
import "@agencecinq/modal";
```

### 2. Implementation in Liquid / HTML

Render the markup and wire buttons with `aria-controls`.
`cinq-modal` must have an `id`, because it toggles itself when `detail.modal` matches its `id`.

```liquid
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

---

## API reference

### Markup

`<cinq-modal>` must contain a `<dialog>` (or an element marked with `[data-dialog]`).
An `id` is required if you want it to react to `modal-toggle` events from `cinq-modal-button`.

```html
<cinq-modal id="my-modal">
  <dialog>...</dialog>
</cinq-modal>
```

### Methods

Interact with the element instance directly:

```js
const $modal = document.querySelector("cinq-modal#my-modal");

$modal.show();
$modal.close();
```

### Events

Event names come from `@agencecinq/utils`:

| Event          | Emitted by          | Payload (`event.detail`)                                                   | Description                                                                                                                              |
| -------------- | ------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `modal-toggle` | `cinq-modal-button` | `{ modal: string; trigger: HTMLButtonElement; trap: HTMLElement \| null }` | Requests toggling a modal identified by the button `aria-controls`. One event is dispatched **per id** (space-separated list supported). |
| `modal-open`   | `cinq-modal`        | `{ modal: string }`                                                       | Dispatched after calling `show()`. Contains the modal `id` so buttons can sync their `aria-pressed` state.                              |
| `modal-close`  | `cinq-modal`        | `undefined`                                                                | Dispatched after calling `close()`.                                                                                                      |

### Wiring: handle `modal-toggle`

`cinq-modal-button` dispatches `modal-toggle` on `document.documentElement` with:

- `detail.modal`: the modal id from the button `aria-controls`
- `detail.trigger`: the button element
- `detail.trap`: optional element id from `data-trap` (if you use it)

`cinq-modal` listens to `modal-toggle` by default and toggles itself when `detail.modal` matches its `id` (so `id` is required for event-driven open/close).

> Note: `cinq-modal-button` sets `aria-pressed="true"` on click and resets it to `false` on **any** `EVENTS.MODAL_CLOSE` event (it does not filter by modal id).

---

## Development (monorepo)

```bash
pnpm -C packages/modal build
pnpm -C packages/modal dev
```

## License

Internal tool developed by **CINQ**. All rights reserved.
