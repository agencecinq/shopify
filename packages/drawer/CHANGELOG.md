# @agencecinq/drawer

## 7.0.1

### Patch Changes

- Drop `fs-extra`. The Vite plugin uses `node:fs/promises` (`fs.cp`, Node 18+).
- Add `engines.node` >= 18. Document Node requirement for the Shopify plugin.

## 7.0.0

### Major Changes

- Align drawer events with `@agencecinq/utils` 7.x: `drawer:open`, `drawer:close`, `drawer:toggle`, `drawer:before-open`, `drawer:before-close` (replaces `drawer-open`, etc.).
- Stop inlining `EVENTS` in the bundle. Import `@agencecinq/utils` at runtime (`peerDependencies` >= 7.0.0).

## 6.1.0

### Minor Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 6.0.1

### Patch Changes

- c65b293: Shared return-focus helpers in utils; drawer exclusive restore fix; modal APG stack alignment.

  **@agencecinq/utils**

  - Add `rememberReturnFocus` / `restoreReturnFocus` (first-wins overlay session)
  - Rename internal `focus-trap` module to `focus` (public named exports unchanged)

  **@agencecinq/drawer**

  - Use shared return-focus helpers instead of restoring via `removeTrapFocus(trigger)`
  - Defer restore on close so exclusive multi-toggle keeps the original page opener

  **@agencecinq/modal** (breaking)

  - Require `id`; expose public `init` / `destroy`
  - Stacked native `showModal()` (no exclusive auto-close); scroll lock is consumer-owned
  - `modal-open` / `modal-close` payloads include `modal` id; buttons sync `aria-pressed` by id

## 6.0.0

### Major Changes

- dadcbc8: Drop legacy `cid` (`id` only). Harden drawer lifecycle: trap/scroll on open/close, restore focus to opener, exclusive drawers, `aria-expanded` from events, `ariaControlsElements` only. Docs demos for exclusive and multi-button.

## 5.0.3

### Patch Changes

- 264c92a: Resolve `aria-controls` targets via `Element.ariaControlsElements` instead of `parseList` + `getElementById`.

## 5.0.2

### Patch Changes

- 2e12ffb: Simplify disclosure-button around HTML source of truth and shared utils.

  **@agencecinq/utils**

  - Add `dispatchEvent` helper for cancelable `CustomEvent`s
  - Add `parseList` for space-separated ARIA ID reference lists

  **@agencecinq/disclosure-button** (breaking)

  - Resolve targets via `Element.ariaControlsElements`
  - `aria-expanded` is `true` while any controlled region is visible; click closes all if any remain open
  - Add `update()` for external dismiss; drop automatic linked-trigger sync (app responsibility)
  - Require a native inner `<button>` (no `[data-button]` escape hatch)
  - Remove the `button` getter (`$button` remains)

  **Consumers**

  - Migrate to shared `dispatchEvent` / `parseList` from `@agencecinq/utils`

## 5.0.0

### Minor Changes

- 3594668: Spinbutton package

### Patch Changes

- Updated dependencies [3594668]
  - @agencecinq/utils@5.0.0

## 4.1.3

### Patch Changes

- 5000b68: Fix package.json
- Updated dependencies
  - @agencecinq/utils@4.0.1

## 4.1.1

### Patch Changes

- y

## 4.1.0

### Minor Changes

- Refacto

## 4.0.0

### Major Changes

- Create a new package in @agencecinq/shopify

### Patch Changes

- d8e4559: Fix enableScroll missing false parameter
- Updated dependencies
  - @agencecinq/utils@4.0.0

## 3.0.0

### Major Changes

- Bump

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@3.0.0
