[![](https://img.shields.io/npm/v/@agencecinq/slider)](https://www.npmjs.com/package/@agencecinq/slider)
[![](https://img.shields.io/npm/dm/@agencecinq/slider)](https://www.npmjs.com/package/@agencecinq/slider)

# @agencecinq/slider

> Accessible, WAI-ARIA slider as a lightweight Web Component.

A slider lets users pick a value within a range by moving a thumb along a rail.
`<cinq-slider>` is the **rail** (geometry + CSS variables). A nested
`[role="slider"]` thumb is the focusable control: ARIA bounds, labels, and
keyboard focus live there.

Implementation follows the
[WAI-ARIA Authoring Practices slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/).
Inspired by [`@19h47/slider`](https://github.com/19h47/19h47-slider).

Two custom elements in one package:

| Tag | Pattern | Class |
| --- | ------- | ----- |
| `<cinq-slider>` | [Single-thumb slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) | `Slider` |
| `<cinq-slider-range>` | [Multi-thumb range](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) | `SliderRange` |

Both support **horizontal** and **vertical** layout (`aria-orientation` on the thumb). Horizontal sliders mirror under RTL; vertical axis is unchanged by `dir`.

## Installation

```bash
pnpm add @agencecinq/slider
```

## Usage

```html
<label id="volume-label" for="volume-slider">Volume</label>
<cinq-slider class="volume-rail">
  <button
    type="button"
    id="volume-slider"
    role="slider"
    tabindex="0"
    aria-labelledby="volume-label"
    aria-orientation="horizontal"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="50"
    aria-valuetext="50%"
  ></button>
</cinq-slider>
```

```js
import "@agencecinq/slider";
```

Importing `@agencecinq/slider` registers **both** custom elements automatically.
No manual `init()` call required.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

The package implements APG behaviour (keyboard, pointer, ARIA sync, events).
**Layout, hit area, contrast, and focus rings are your CSS.** See
[Consumer styling](#consumer-styling) below.

### Required markup, single (`<cinq-slider>`)

Author contract (not enforced in JS, use an a11y linter). The component **does** throw if thumb count ≠ 1.

| Attribute / element | Expected | Role |
| ------------------- | -------- | ---- |
| `<cinq-slider>` | **Yes** | Rail / bounds container. |
| One `[role="slider"]` | **Yes** | Focusable thumb (`$thumb`). |
| `tabindex="0"` | **Yes** | On the thumb. |
| `aria-orientation="horizontal"` or `"vertical"` | **Yes** | On the thumb. Geometry follows the declared axis. |
| `aria-valuemin` / `aria-valuemax` / `aria-valuenow` | **Yes** | Read with fallbacks (`0` / `100`) if omitted. |
| `aria-label` or `aria-labelledby` | **Yes** | On the thumb, per APG. |
| `aria-valuetext` | Recommended | Updated by the component when `formatValue` is set. |

Prefer `<button type="button">` for a clear focus target.

### Range (`<cinq-slider-range>`)

APG order: **first thumb in DOM = max handle**, **second = min handle**.

```html
<label id="price-label">Price range</label>
<cinq-slider-range class="price-rail" aria-labelledby="price-label">
  <button
    type="button"
    role="slider"
    tabindex="0"
    aria-label="Maximum price"
    aria-orientation="horizontal"
    aria-valuemin="100"
    aria-valuemax="1000"
    aria-valuenow="800"
  ></button>
  <button
    type="button"
    role="slider"
    tabindex="0"
    aria-label="Minimum price"
    aria-orientation="horizontal"
    aria-valuemin="100"
    aria-valuemax="1000"
    aria-valuenow="200"
  ></button>
</cinq-slider-range>
```

Range track fill between thumbs:

```css
cinq-slider-range::after {
  inset-inline-start: calc(
    var(--thumb-size) / 2 + var(--min-ratio) * (100% - var(--thumb-size))
  );
  width: calc(
    (var(--max-ratio) - var(--min-ratio)) * (100% - var(--thumb-size))
  );
  border-radius: 0; /* square ends between two handles */
}
```

See [Positioning with CSS variables](#positioning-with-css-variables) for the full pattern (rail, fill, thumbs).

### Options

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-step` | number | `1` | Arrow key increment; values snap to this step (pointer + keyboard). |
| `data-page` | number | `10` | Page Up / Page Down increment. |

Thumb and track layout are **consumer CSS**. The component only updates CSS custom properties on the host (see [Styling hooks](#styling-hooks)).

### API, `<cinq-slider>` (`Slider`)

| Method | Description |
| ------ | ----------- |
| `setValue(value, options?)` | Clamp, sync, dispatch unless `emit: false`. |
| `sync()` | Re-read ARIA and re-apply geometry. |
| `rect()` | Host `DOMRect` (rail). |
| `init()` / `destroy()` | Bind / unbind for DOM mutation. |

| Property | Description |
| -------- | ----------- |
| `$thumb` | The `[role="slider"]` element. |
| `value` / `min` / `max` / `ratio` | From thumb ARIA. |
| `step` / `page` | From host `data-step` / `data-page`. |
| `formatValue` | `(value) => string` for `aria-valuetext`. |

### API, `<cinq-slider-range>` (`SliderRange`)

| Method | Description |
| ------ | ----------- |
| `setValues(min, max, options?)` | Anti-cross clamp, sync, dispatch unless `emit: false`. |
| `sync()` | Re-read ARIA and re-apply geometry. |
| `rect()` | Host `DOMRect` (rail). |
| `init()` / `destroy()` | Bind / unbind for DOM mutation. |

| Property | Description |
| -------- | ----------- |
| `$max` / `$min` | Thumbs (first / second in DOM). |
| `min` / `max` | Current selected values. |
| `boundsMin` / `boundsMax` | Global bounds from initial markup. |
| `step` / `page` | From host `data-step` / `data-page`. |
| `formatValue` | `(value) => string` for both thumbs. |

### Keyboard

Matches [APG slider keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/slider/#keyboard-interaction).
Focus must be on the thumb.

**Range (`<cinq-slider-range>`):** both thumbs are in the tab sequence (APG
multi-thumb). Use **Tab** / **Shift+Tab** to move focus between the max handle
(first in DOM) and the min handle (second). Arrow keys adjust the **focused**
thumb only. Tab order follows DOM order, not visual position when handles
cross. Style `:focus-visible` and raise `z-index` on the focused thumb so the
ring stays visible (see playground `[data-active]` pattern).

**Vertical:** Up Arrow increases, Down Arrow decreases. **RTL does not apply**
to the vertical axis (same as `@19h47/slider`).

| Key | Horizontal LTR | Horizontal RTL | Vertical |
| --- | -------------- | -------------- | -------- |
| Right Arrow | + `data-step` | − `data-step` | + `data-step` |
| Left Arrow | − `data-step` | + `data-step` | − `data-step` |
| Up Arrow | + `data-step` | + `data-step` | + `data-step` |
| Down Arrow | − `data-step` | − `data-step` | − `data-step` |
| Home / End | min / max (single); APG multi-thumb rules (range) | same | same |
| Page Up / Down | + / − `data-page` | same | same |

### RTL

Set `dir="rtl"` on the host or an ancestor for **horizontal** sliders. Thumb
position, pointer mapping, and horizontal arrow keys mirror (same as
`@agencecinq/tabs`). Vertical sliders ignore `direction` on the value axis.

### Events

Both hosts fire `slider:change` (constant `EVENTS.SLIDER_CHANGE`) after ARIA sync.

Detail: `{ min, max, $thumb }`. Single thumb: `min === max`. Range: current
endpoints. `$thumb` is always the handle that moved or has focus.

```js
import { EVENTS } from "@agencecinq/utils";

document.querySelector("cinq-slider")?.addEventListener(
  EVENTS.SLIDER_CHANGE,
  (event) => {
    const { min, max, $thumb } = event.detail;
    console.log(min, max, $thumb);
  },
);

document.querySelector("cinq-slider-range")?.addEventListener(
  EVENTS.SLIDER_CHANGE,
  (event) => {
    const { min, max, $thumb } = event.detail;
    const range = event.currentTarget;
    const which =
      $thumb === range.$min ? "min" : $thumb === range.$max ? "max" : null;
    console.log(min, max, which);
  },
);
```

### Styling hooks

| Hook | Host | Description |
| ---- | ---- | ----------- |
| `[dragging]` | Both | Pointer drag in progress |
| `--value` / `--ratio` | `<cinq-slider>` | Current value and semantic ratio `0` to `1` |
| `--min` / `--max` | `<cinq-slider-range>` | Current range values |
| `--min-ratio` / `--max-ratio` | `<cinq-slider-range>` | Semantic ratios `0` to `1` within global bounds |
| `[data-active="min"\|"max"]` | `<cinq-slider-range>` | Last focused / dragged thumb |
| `[data-collapsed]` | `<cinq-slider-range>` | Set when `min === max` (side-by-side thumb CSS) |

Ratios are **semantic**: `0` = global minimum, `1` = global maximum, unchanged in RTL. Use **logical properties** (`inset-inline-start`, etc.) so layout mirrors with `dir="rtl"`.

### Positioning with CSS variables

The package never positions thumbs or track in JS. It updates ARIA and sets the variables above on the **host**. You style the rail, fill, and thumbs in your stylesheet.

Define a thumb size on the host (name is yours, the lib does not set it):

```css
cinq-slider,
cinq-slider-range {
  position: relative;
  --thumb-size: 2.75rem; /* hit area width/height of [role="slider"] */
}
```

The usable track is shorter than the host by one thumb (single) or two thumbs (range). Inset the rail and map ratios over `(100% - var(--thumb-size))` (or `2 * var(--thumb-size)` for range).

#### Single thumb (`<cinq-slider>`)

**Variables:** `--value` (number), `--ratio` (`0` to `1`).

**Track rail** (full width, gray):

```css
cinq-slider::before {
  content: "";
  position: absolute;
  inset-inline: calc(var(--thumb-size) / 2);
  top: 50%;
  block-size: 0.375rem;
  border-radius: 9999px;
  background: #e5e7eb;
  transform: translateY(-50%);
  pointer-events: none;
}
```

**Track fill** (from start to current value):

```css
cinq-slider::after {
  content: "";
  position: absolute;
  inset-inline-start: calc(var(--thumb-size) / 2);
  top: 50%;
  width: calc(var(--ratio) * (100% - var(--thumb-size)));
  block-size: 0.375rem;
  border-radius: 9999px;
  background: #111827;
  transform: translateY(-50%);
  pointer-events: none;
}
```

**Thumb** (centered on ratio):

```css
cinq-slider [role="slider"] {
  position: absolute;
  top: calc(50% - var(--thumb-size) / 2);
  width: var(--thumb-size);
  height: var(--thumb-size);
  inset-inline-start: calc(var(--ratio) * (100% - var(--thumb-size)));
}
```

Alternative: keep `inset-inline-start: 0` and use `translate: calc(var(--ratio) * (100% - var(--thumb-size))) 0`.

#### Range (`<cinq-slider-range>`)

**Variables:** `--min`, `--max`, `--min-ratio`, `--max-ratio`.

APG DOM order: **`:first-child` = max handle**, **`:last-child` = min handle**.

**Track fill** (segment between the two values):

```css
cinq-slider-range::after {
  content: "";
  position: absolute;
  inset-inline-start: calc(
    var(--thumb-size) / 2 + var(--min-ratio) * (100% - var(--thumb-size))
  );
  top: 50%;
  width: calc(
    (var(--max-ratio) - var(--min-ratio)) * (100% - var(--thumb-size))
  );
  block-size: 0.375rem;
  border-radius: 0;
  background: #111827;
  transform: translateY(-50%);
  pointer-events: none;
}
```

**Thumbs:**

```css
cinq-slider-range [role="slider"]:first-child {
  inset-inline-start: calc(var(--max-ratio) * (100% - var(--thumb-size)));
  z-index: 2;
}

cinq-slider-range [role="slider"]:last-child {
  inset-inline-start: calc(var(--min-ratio) * (100% - var(--thumb-size)));
}
```

**Collapsed range** (`min === max`): the host gets `[data-collapsed]`. Offset the min
handle by one thumb width on the low side so both handles stay visible and
selectable (consumer CSS):

```css
cinq-slider-range[data-collapsed] [role="slider"]:last-child {
  inset-inline-start: calc(
    var(--min-ratio) * (100% - var(--thumb-size)) - var(--thumb-size)
  );
}

[dir="rtl"] cinq-slider-range[data-collapsed] [role="slider"]:last-child {
  inset-inline-start: calc(
    var(--min-ratio) * (100% - var(--thumb-size)) + var(--thumb-size)
  );
}

cinq-slider-range:has([aria-orientation="vertical"])[data-collapsed] [role="slider"]:last-child {
  inset-block-end: calc(
    var(--min-ratio) * (100% - var(--thumb-size)) - var(--thumb-size)
  );
}
```

When handles differ, raise the active thumb with `[data-active]`:

```css
cinq-slider-range[data-active="min"] [role="slider"]:last-child,
cinq-slider-range[data-active="max"] [role="slider"]:first-child {
  z-index: 3;
}
```

#### Vertical, `<cinq-slider>`

Semantic `--ratio` is unchanged (`0` = min, `1` = max). Map along the block
axis with min at the bottom and max at the top (see **Potion potency** in the playground):

```css
cinq-slider:has([aria-orientation="vertical"]) {
  width: var(--thumb-size);
  height: 12rem;
}

cinq-slider:has([aria-orientation="vertical"])::before {
  inset-block: calc(var(--thumb-size) / 2);
  inset-inline-start: 50%;
  inline-size: 0.375rem;
  transform: translateX(-50%);
}

cinq-slider:has([aria-orientation="vertical"])::after {
  inset-inline-start: 50%;
  inset-block-end: calc(var(--thumb-size) / 2);
  block-size: calc(var(--ratio) * (100% - var(--thumb-size)));
  inline-size: 0.375rem;
  transform: translateX(-50%);
}

cinq-slider [aria-orientation="vertical"] {
  inset-inline-start: calc(50% - var(--thumb-size) / 2);
  inset-block-end: calc(var(--ratio) * (100% - var(--thumb-size)));
}
```

Range vertical thumbs and fill use `--min-ratio` / `--max-ratio` on
`inset-block-end` the same way. See the docs playground **HP comfort band** demo.

#### Interaction hooks

```css
cinq-slider[dragging] [role="slider"],
cinq-slider-range[dragging] [role="slider"] {
  cursor: grabbing;
}

cinq-slider [role="slider"]:focus-visible,
cinq-slider-range [role="slider"]:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

Lead offsets for multi-thumb pointer mapping follow `@19h47/slider` (horizontal:
max thumb; vertical: min thumb). The [interactive docs](https://agencecinq.github.io/ui/components/slider/) playground is the reference implementation.

### Consumer styling

The component does **not** enforce thumb size, contrast, or touch targets.

- **Touch targets:** WCAG recommends at least **44×44 CSS px** for pointer
  targets. You can use a large hit area with a smaller visual knob (`::before`).
- **Focus:** use `:focus-visible` on the thumb.
- **Touch AT:** the APG [warns](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
  that some touch-based assistive technologies may not yet synthesize the key
  events custom sliders need. Test with VoiceOver / TalkBack on real devices.

### `formatValue`

```js
const host = document.querySelector("cinq-slider");
host.formatValue = (value) => `${value}%`;
```

### Runtime DOM mutation

```js
host.destroy();
// mutate light DOM...
host.init();
```

## Build setup

```bash
pnpm -C packages/slider build
```

## Acknowledgments

- [WAI-ARIA Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
- [`@19h47/slider`](https://github.com/19h47/19h47-slider)
- [Interactive docs](https://agencecinq.github.io/ui/components/slider/)
