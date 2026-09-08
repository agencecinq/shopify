# `@agencecinq/slider` — Specification

> Accessible, WAI-ARIA slider as a lightweight Web Component.
> Evolution of [`@19h47/slider`](https://github.com/19h47/19h47-slider).

**Status:** validated  
**Primary reference (1.0.0):** [Slider Pattern — WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)

**Later references:**

- [Slider (Multi-Thumb)](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) — **2.0.0**
- Vertical orientation (`aria-orientation="vertical"`) — **5.0.0** (single + multi). See APG [Vertical Temperature Slider Example](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/vertical-slider/).

---

## Roadmap (validated)

| Version | Scope |
| ------- | ----- |
| **1.0.0** | Single thumb, **horizontal** + **RTL** |
| **2.0.0** | *(superseded)* Unified tag with mode detection |
| **3.0.0** | **`cinq-slider`** (single) + **`cinq-slider-range`** (two thumbs), horizontal + RTL |
| **5.0.0** | **Vertical** orientation (single + multi). RTL does not apply to the vertical axis |

Implement v1 with an internal shape that extends cleanly: thumb count, orientation axis, RTL flag, and event detail are the main extension points.

---

## 1. Goals

### In scope (package lifetime)

- Behavior-only Web Component: keyboard, pointer, ARIA sync, events.
- HTML as the source of truth for roles, labels, bounds, orientation.
- Progressive enhancement: meaningful ARIA in markup before JS runs.
- Monorepo conventions (`init` / `destroy`, `data-*` host attrs, `EVENTS.*`).

### In scope (1.0.0 only)

- **Single-thumb** slider on a horizontal rail.
- **RTL** horizontal (`dir="rtl"` on host or ancestor): mirrored thumb position, pointer mapping, and horizontal arrow keys.

### Planned (not 1.0.0)

- **Multi-thumb** range (two thumbs, anti-crossing).
- **Vertical** orientation (`aria-orientation="vertical"`).

### Out of scope

- Imposed visual design (track, fill, tooltips, **thumb size**): consumer CSS.
- Enforcing minimum touch target size in JS or component styles.
- Form submission / hidden inputs (consumer markup).
- Native `<input type="range">` wrapper.

The package implements the [APG Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) behavior (keyboard, pointer, ARIA value sync). **Layout, hit area, and contrast are the consumer’s responsibility.** The README and docs page must say so explicitly (see §9).

### Non-goals (relation to other packages)

| Package | Pattern | Why not slider |
| ------- | ------- | -------------- |
| `spinbutton` | discrete numeric input | Step + text entry, not a rail |
| `windowsplitter` | layout split | Resizes panes, not a form value |
| `combobox` | editable + listbox | Selection from list, not continuous range |

---

## 2. Custom element

| Item | Value |
| ---- | ----- |
| Tags | `cinq-slider` (single), `cinq-slider-range` (two thumbs) |
| Classes | `Slider`, `SliderRange` (extend `SliderBase`) |
| Package | `@agencecinq/slider` |
| Import | `import "@agencecinq/slider"` |
| Registration | both tags on import |

---

## 3. APG alignment — 1.0.0

Implementation MUST follow the [Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) for v1.

### 3.0 Pattern summary (APG)

> A slider is an input where the user selects a value from within a given range. Sliders typically have a slider thumb that can be moved along a bar, rail, or track.

- **Focus** lives on the thumb (the focusable element with `role="slider"`), not on the host.
- **Keyboard** matches APG (§6.2).
- **WAI-ARIA** on the thumb (§3.4 checklist).

### 3.0.1 APG touch warning (document in README)

The APG [warns](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) that some touch-based assistive technologies may not yet synthesize the key events needed to operate custom sliders. Recommend testing with real AT on touch devices before production. This is not something the component can fix in code alone.

### 3.0.2 APG examples (doc inspiration)

Link to official examples in docs when helpful:

- [Color Viewer Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-color-viewer/)
- [Rating Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-rating/)
- [Media Seek Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-seek/)

---

## 4. Markup contract

### 4.1 Structure — 1.0.0 (single thumb)

`<cinq-slider>` is the **rail**: bounding box for geometry and pointer mapping.
It contains **exactly one** focusable thumb with `role="slider"`.

```html
<label id="volume-label" for="volume-slider">Volume</label>
<cinq-slider>
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

Per APG, the **accessible name** belongs on the thumb (`aria-label` or `aria-labelledby`). The host `<cinq-slider>` is the rail only and carries no required accessible name in 1.0.0 when the thumb is labelled.

Thumbs may be `<button type="button">` or any focusable element with `role="slider"`. Prefer `<button>` for a clear focus target.

Optional decorative track behind the thumb (sibling or pseudo-element). Not required.

### 4.2 Structure — 3.0.0 (multi-thumb)

Host tag **`cinq-slider-range`**. **Exactly two** thumbs. **APG order (required):**

1. **First** in document order = **max** thumb  
2. **Second** = **min** thumb  

```html
<cinq-slider-range aria-label="Price range">
  <button type="button" role="slider" tabindex="0"
    aria-label="Maximum price" aria-orientation="horizontal"
    aria-valuemin="0" aria-valuemax="500"
    aria-valuenow="500" aria-valuetext="$500"></button>
  <button type="button" role="slider" tabindex="0"
    aria-label="Minimum price" aria-orientation="horizontal"
    aria-valuemin="0" aria-valuemax="500"
    aria-valuenow="0" aria-valuetext="$0"></button>
</cinq-slider-range>
```

Port behavior from `@19h47/slider` (anti-cross, dynamic `aria-valuemin` / `aria-valuemax` between thumbs).

### 4.3 WAI-ARIA roles, states, and properties — 1.0.0 (APG checklist)

On the **thumb** (required in initial HTML unless noted):

| APG requirement | Attribute / role | Notes |
| --------------- | ---------------- | ----- |
| Focusable slider control | `role="slider"` | |
| Current value | `aria-valuenow` | Component keeps in sync |
| Minimum | `aria-valuemin` | Read at init, not mutated |
| Maximum | `aria-valuemax` | Read at init, not mutated |
| Human-readable value | `aria-valuetext` | Recommended when `valuenow` is opaque. Updated by component |
| Accessible name | `aria-label` or `aria-labelledby` | **On the thumb**, per APG |
| Orientation | `aria-orientation="horizontal"` | Required in 1.0.0. Default APG is horizontal if omitted, but we require explicit markup |

Optional: host `aria-label` for a group name when multiple sliders sit in a fieldset (consumer choice).

`tabindex="0"` on the thumb so keyboard focus reaches the control APG describes.

### 4.4 What the component writes — 1.0.0

| Target | Attributes |
| ------ | ---------- |
| Thumb | `aria-valuenow`, `aria-valuetext` (when `formatValue` set or fallback string) |

### 4.5 What the component writes — 2.0.0 (planned)

| Target | Attributes |
| ------ | ---------- |
| Min thumb | `aria-valuenow`, `aria-valuetext`, `aria-valuemax` → current max |
| Max thumb | `aria-valuenow`, `aria-valuetext`, `aria-valuemin` → current min |

Global bounds on thumbs are read at init, not mutated. Constraint: min ≤ max.

### 4.6 HTML is the source of truth

The component will **not** invent roles, labels, or orientation, auto-migrate markup, or lint ARIA at runtime.

---

## 5. Host options (`data-*`)

On `<cinq-slider>`:

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-step` | number | `1` | Arrow key increment |
| `data-page` | number | `10` | Page Up/Down increment |

No `data-slider-*` prefix.

`observedAttributes`: `data-step`, `data-page`.

**No thumb positioning in JS** — consumer CSS from host variables (§8, §10).

**Orientation:** read from thumb `aria-orientation` (`horizontal` or `vertical`).

**RTL:** detected from computed `direction` on the host (`getComputedStyle(host).direction === 'rtl'`), same pattern as `@agencecinq/tabs`. Set `dir="rtl"` on `<cinq-slider>` or any ancestor.

---

## 6. Geometry (layout math, not a11y sizing)

The component **measures** thumb dimensions from the DOM (`offsetWidth` / `offsetHeight`) to compute rail/track math and pointer mapping. It does **not** validate or enforce minimum size.

### 6.1 1.0.0 (single, horizontal)

- Thumb size measured from layout at `init()` + `ResizeObserver` on host.
- Track length: `railWidth - thumbWidth` (one thumb offset at max end).
- **LTR:** thumb offset grows from inline-start (left) as value increases.
- **RTL:** thumb at inline-start (right), `translateX(-ratio × trackLength)` (physical left as value increases). Matches native `<input type="range">` in RTL documents.

### 6.2 2.0.0 (multi, horizontal)

- Track: `railLength - 2 * thumbSize`
- Always-visible offsets from [19h47-slider](https://github.com/19h47/19h47-slider).

### 6.3 Vertical (5.0.0)

- Track: `railHeight - thumbSize` (single) or `- 2 * thumbSize` (multi)
- Vertical offsets per 19h47 (min thumb `+height`)
- Pointer: `clientY`; semantic `--ratio` unchanged (`0` = min at bottom, `1` = max at top)
- **RTL:** no effect on vertical pointer or keyboard (Up/Down unchanged). Only horizontal axis uses `direction`.

Document thumb CSS origin (`left: 0` / `top: 0`) in README. See §9 for consumer thumb sizing.

### 6.4 RTL (horizontal, 1.0.0+)

In Arabic, Hebrew, Persian, and other RTL locales, a horizontal slider must feel consistent with reading direction and with native range controls.

| Concern | LTR | RTL |
| ------- | --- | --- |
| Thumb position | min → inline-start (left) | min → inline-start (right) |
| Pointer drag | `clientX` → value along rail | mirrored `clientX` |
| `aria-valuemin` / `max` / `now` | unchanged | unchanged (semantic, not mirrored) |
| `--ratio` | `0` = min, `1` = max | same semantics |
| Horizontal arrows | Right/Left = increase/decrease | **reversed** (Left = increase, Right = decrease) |
| Up / Down / Home / End / Page Up / Down | per APG | unchanged |

Horizontal arrow reversal follows `@agencecinq/tabs` (spatial axis in reading direction). Up/Down stay value-centric per APG.

**Track fill in consumer CSS:** `--ratio` is semantic. Document logical properties for fills, e.g. `inset-inline-start: 0` + `width: calc(var(--ratio) * 100%)`, or `transform-origin: inline-start`.

---

## 7. Interaction

### 7.1 Pointer

- `pointerdown` on thumb → **focus thumb** (APG: focus on the slider thumb), start drag
- Document-level `pointermove` / `pointerup` while dragging
- `touch-action: none` on thumb while bound
- Map position → value → update

### 7.2 Keyboard — horizontal

Matches [APG Slider keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/slider/#keyboard-interaction) (horizontal). In **RTL**, only **Left/Right** are swapped (§6.4); other keys unchanged.

| Key | Effect (LTR) | Effect (RTL) |
| --- | ------------ | ------------ |
| Right Arrow | Increase by `data-step` | Decrease by `data-step` |
| Up Arrow | Increase by `data-step` | Increase by `data-step` |
| Left Arrow | Decrease by `data-step` | Increase by `data-step` |
| Down Arrow | Decrease by `data-step` | Decrease by `data-step` |
| Home | `aria-valuemin` | `aria-valuemin` |
| End | `aria-valuemax` | `aria-valuemax` |
| Page Up | Increase by `data-page` (optional per APG) | Increase by `data-page` |
| Page Down | Decrease by `data-page` (optional per APG) | Decrease by `data-page` |

### 7.3 Keyboard — multi-thumb

Each thumb is in the **page tab sequence** (`tabindex="0"` or native focusable
element such as `<button>`). **Tab** / **Shift+Tab** moves focus between thumbs
(DOM order: max handle first, min second — unchanged when handles cross
visually). Arrow keys apply to the **focused** thumb only. Home/End semantics
per APG multi-thumb. RTL uses the same horizontal arrow swap as §7.2.

On `init()`, if a thumb has no `tabindex` attribute and `tabIndex === -1`
(e.g. `<div role="slider">`), the component sets `tabIndex = 0`. Explicit
`tabindex="-1"` is respected.

### 7.4 Keyboard — vertical (5.0.0)

Up Arrow increases; Down Arrow decreases. Left/Right also step value (same as
`@19h47/slider`). Page Up/Down and Home/End unchanged. **RTL does not swap**
vertical keys.

### 7.5 Focus

Focus lives on the thumb (`thumb.focus()`). Document consumer CSS only:

```css
cinq-slider [role="slider"]:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

---

## 8. Thumb positioning (consumer CSS)

The package **does not** set `transform`, `inset-*`, or `z-index` on thumbs.

It exposes semantic CSS custom properties on the host (§10). The consumer positions rails, fills, and thumbs. Ratios are `0`–`1` within global bounds; thumb size, insets, and overlap rules are project-specific.

### 8.1 Setup

```css
cinq-slider,
cinq-slider-range {
  position: relative;
  --thumb-size: 2.75rem; /* consumer-defined; not set by the lib */
}
```

Map ratios over the usable track: host width minus one thumb (single) or two thumbs (range).

### 8.2 Single — `<cinq-slider>`

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `--value` | number | Current value |
| `--ratio` | `0`–`1` | `(value - min) / (max - min)` |

```css
cinq-slider::before {
  content: "";
  position: absolute;
  inset-inline: calc(var(--thumb-size) / 2);
}

cinq-slider::after {
  inset-inline-start: calc(var(--thumb-size) / 2);
  width: calc(var(--ratio) * (100% - var(--thumb-size)));
}

cinq-slider [role="slider"] {
  position: absolute;
  inset-inline-start: calc(var(--ratio) * (100% - var(--thumb-size)));
}
```

### 8.3 Range — `<cinq-slider-range>`

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `--min` / `--max` | number | Current range values |
| `--min-ratio` / `--max-ratio` | `0`–`1` | Within global bounds |

APG DOM: **first** thumb = max, **second** = min.

```css
cinq-slider-range::after {
  inset-inline-start: calc(
    var(--thumb-size) / 2 + var(--min-ratio) * (100% - var(--thumb-size))
  );
  width: calc(
    (var(--max-ratio) - var(--min-ratio)) * (100% - var(--thumb-size))
  );
  border-radius: 0;
}

cinq-slider-range [role="slider"]:first-child {
  inset-inline-start: calc(var(--max-ratio) * (100% - var(--thumb-size)));
}

cinq-slider-range [role="slider"]:last-child {
  inset-inline-start: calc(var(--min-ratio) * (100% - var(--thumb-size)));
}
```

Overlap: `[data-active="min"]` / `[data-active="max"]` on host → consumer `z-index`.
When `min === max`, host sets `[data-collapsed]` → offset min thumb one width on the low side (§8.3).

### 8.4 RTL

Semantic ratios unchanged. Use logical properties (`inset-inline-start`) so layout mirrors under `dir="rtl"`.

See interactive docs playground for reference CSS.

## 9. Consumer styling and accessibility (documentation only)

**Not enforced by the package.** Repeat in README and `slider.mdx`.

### 9.1 Touch target size

WCAG [2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) recommends at least **44×44 CSS px** for pointer targets. [WCAG 2.2 Level AA (2.5.8)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) requires **24×24 CSS px** minimum (with exceptions).

The consumer chooses thumb appearance. Common patterns:

```css
/* Visual knob smaller than hit area */
cinq-slider [role="slider"] {
  position: absolute;
  width: 2.75rem;   /* 44px — pointer-friendly */
  height: 2.75rem;
  padding: 0;
  border: 0;
  background: transparent;
}

cinq-slider [role="slider"]::before {
  content: "";
  display: block;
  width: 1rem;      /* visible knob — consumer choice */
  height: 1rem;
  margin: auto;
  border-radius: 50%;
  background: currentColor;
}
```

Or enlarge the button itself to 44px. The component reads **laid-out box size** for geometry. A larger hit area improves pointer use without changing APG behavior.

### 9.2 Rail height

The host rail can be taller than the thumb so the control is easier to tap (full-row hit zone). Only the thumb receives focus and `role="slider"`. Optional: increase rail `min-height` in consumer CSS.

### 9.3 Contrast and visible focus

Focus ring, track, and thumb colors are consumer CSS. Document `:focus-visible` outline (same as other CINQ packages).

### 9.4 Touch AT testing

Include the APG [touch assistive technology warning](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) in docs. Advise manual testing on touch devices with VoiceOver / TalkBack.

### 9.5 `formatValue` and `aria-valuetext`

When the numeric value is not meaningful alone (rating, time, currency), use `formatValue` or set `aria-valuetext` in markup, as in APG [Rating](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-rating/) and [Media Seek](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-seek/) examples.

---

## 10. Styling hooks

### Host attributes

| Hook | When |
| ---- | ---- |
| `[dragging]` | Pointer drag in progress |
| `[data-active="min"]` / `[data-active="max"]` | Multi-thumb 2.0.0: last active thumb |
| `[data-collapsed]` | Multi-thumb: set when `min === max` |

### CSS custom properties — `<cinq-slider>`

| Property | Description |
| -------- | ----------- |
| `--value` | Current value |
| `--ratio` | `0`–`1` within `[min, max]` |

### CSS custom properties — `<cinq-slider-range>`

| Property | Description |
| -------- | ----------- |
| `--min` / `--max` | Current values |
| `--min-ratio` / `--max-ratio` | `0`–`1` within global bounds |

Full positioning recipes: §8. Example range fill:

```css
cinq-slider-range::after {
  inset-inline-start: calc(
    var(--thumb-size) / 2 + var(--min-ratio) * (100% - var(--thumb-size))
  );
  width: calc(
    (var(--max-ratio) - var(--min-ratio)) * (100% - var(--thumb-size))
  );
}
```

Multi-thumb overlap: `[data-active="min"]` / `[data-active="max"]` → consumer `z-index` (§8.3).

---

## 11. Events

On **`<cinq-slider>`** (bubble). `@agencecinq/utils`:

| Event | Constant | Cancelable | Detail |
| ----- | -------- | ---------- | ------ |
| `slider:change` | `SLIDER_CHANGE` | No | `{ min, max, $thumb }` |

```ts
type SliderChangeDetail = {
  min: number;
  max: number;
  $thumb: HTMLElement;
};
```

Single thumb: `min === max` (current value). Range: current endpoints. `$thumb`
is always the handle that moved or has focus. Compare to `host.$min` /
`host.$max` on `<cinq-slider-range>` to tell min from max.

Fired after ARIA + geometry sync.

---

## 12. Public API

### 12.1 Lifecycle

```ts
class Slider extends HTMLElement {
  connectedCallback(): void;
  disconnectedCallback(): void;
  init(): void;
  destroy(): void;
  sync(): void;
}
```

### 12.2 Properties — 1.0.0

| Property | Type | Description |
| -------- | ---- | ----------- |
| `$thumb` | `HTMLElement` | The single `[role="slider"]` |
| `value` | `number` | Current value |
| `min` / `max` | `number` | From thumb ARIA bounds |
| `step` / `page` | `number` | From host `data-*` |
| `orientation` | `string \| null` | From thumb `aria-orientation` (read only) |
| `formatValue` | `(value: number) => string` | Optional `aria-valuetext` formatter |

### 12.3 Properties — 2.0.0 (additions)

| Property | Type | Description |
| -------- | ---- | ----------- |
| `$min` / `$max` | `HTMLElement` | Second / first thumb |
| `min` / `max` | `number` | Current range values |

### 12.4 Methods — 1.0.0

| Method | Description |
| ------ | ----------- |
| `setValue(value, options?)` | Clamp, sync ARIA + geometry, dispatch |
| `rect()` | Host `DOMRect` |

```ts
setValue(value: number, options?: { emit?: boolean }): void;
```

### 12.5 Methods — 2.0.0 (additions)

| Method | Description |
| ------ | ----------- |
| `setValues(min, max, options?)` | Range update, anti-cross |

```ts
setValues(
  min: number,
  max: number,
  options?: { active?: "min" | "max"; emit?: boolean },
): void;
```

---

## 13. Utils dependency

```ts
SLIDER_CHANGE: 'slider:change',
```

Reuse: `clamp`, `parseNumber`.

---

## 14. Error handling

| Condition | Behavior |
| --------- | -------- |
| Wrong thumb count for tag (`cinq-slider` ≠ 1, `cinq-slider-range` ≠ 2) | `throw` in `init()` |
| Missing or invalid ARIA on thumb | **No throw** — read markup with fallbacks; consumer lints with axe / Lighthouse |
| `aria-orientation="vertical"` | **5.0.0** — vertical pointer + keyboard |
| `destroy()` → mutate → `init()` | supported |

---

## 15. Package layout

```
packages/slider/
  SPEC.md
  package.json
  tsconfig.json
  vite.config.ts
  CHANGELOG.md
  README.md
  src/
    index.ts
    slider.ts
    types.ts
    geometry.ts      ← shared rail math (extend for multi + vertical)
    keyboard.ts
```

---

## 16. Docs

**Required prose (1.0.0):** §9 consumer styling and accessibility (touch targets, focus, APG touch warning).

**1.0.0 playground:**

1. Horizontal volume / level slider  
2. Same slider with `dir="rtl"` (mirrored rail + keyboard)  
3. `formatValue` (%, currency) — link APG Rating / Media Seek examples  
4. Track fill via `--ratio` + logical properties (§6.4)  
5. **Styling:** 44px hit area vs smaller visual knob (§9.1)  

**2.0.0 playground (add later):**

4. Price range (multi-thumb)  
5. Range bar via `--min-ratio` / `--max-ratio`  

**2.x playground (add later):**

6. Vertical single + multi  

---

## 17. Migration from `@19h47/slider`

Full parity from **2.0.0** (multi-thumb horizontal). 1.0.0 is a subset.

| 19h47 | CINQ |
| ----- | ---- |
| `new Slider(rail, opts)` | `<cinq-slider>` + import |
| `Slider.change` | `slider:change` / `EVENTS.SLIDER_CHANGE` |
| `update(min, max, active?)` | `setValues()` (2.0.0) |
| `orientation` in JS | `aria-orientation` on thumb(s) |
| `width` / `height` opts | measured from layout |

---

## 18. Decisions (closed)

| Question | Decision |
| -------- | -------- |
| First ship | Single-thumb horizontal + RTL (1.0.0) |
| Multi-thumb | 2.0.0, port 19h47 |
| Vertical | **5.0.0** (single + multi) |
| RTL | Horizontal only, 1.0.0+. Vertical axis ignores `direction` |
| RTL keyboard | Swap Left/Right (same as `@agencecinq/tabs`). Up/Down unchanged |
| Touch target size | Consumer CSS. Document 44×44px guidance (§9), not enforced |
| Focus styling | `:focus-visible` in consumer CSS only |
| `slider:before-change` | YAGNI until needed |
| Z-index overlap | 19h47 behavior in 2.0.0 multi |

---

## 19. Acceptance criteria

### 1.0.0

- [ ] One thumb, horizontal, [APG keyboard + pointer](https://www.w3.org/WAI/ARIA/apg/patterns/slider/#keyboard-interaction)
- [ ] RTL horizontal: mirrored thumb + pointer; Left/Right keys swapped (§6.4)
- [ ] WAI-ARIA checklist §4.3 on thumb; focus on thumb
- [ ] `slider:change` with `{ value }`
- [ ] `--value`, `--ratio` on host
- [ ] `setValue()`, `sync()`, `rect()`, `init()` / `destroy()`
- [ ] README + mdx include §9 (touch targets, APG touch warning, consumer CSS)
- [ ] Docs playground: `:focus-visible` on thumb
- [ ] Docs playground includes styled thumb with ≥44px hit area example
- [x] Vertical orientation (5.0.0) — single + multi, APG keyboard

### 2.0.0

- [ ] Two thumbs, APG order, no crossing, RTL (same rules as §6.4)
- [ ] Event detail `{ min, max, $thumb }`
- [ ] `--min`, `--max`, `--min-ratio`, `--max-ratio`
- [ ] `setValues()`, port 19h47 geometry

### 2.x

- [x] Vertical single + multi
- [x] Vertical keyboard mapping per APG
