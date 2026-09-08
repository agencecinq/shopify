# @agencecinq/slider

## 6.0.0

### Changed

- **Breaking:** unified `slider:change` detail on both hosts: `{ min, max, $thumb }`.
  Single thumb: `min === max` (current value), `$thumb` is the handle. Range:
  current endpoints plus `$thumb` for the focused or dragged handle. Replaces
  `{ value }` on `<cinq-slider>` and `{ min, max, active }` on range.
- `SliderChangeDetail` type.

## 5.0.0

### Added

- **Vertical orientation** (`aria-orientation="vertical"`) for `<cinq-slider>` and `<cinq-slider-range>`.
- Pointer mapping on `clientY`, vertical keyboard (Up/Down; RTL ignored on axis).
- Docs playground: **Potion potency** and **HP comfort band** vertical demos.

## 4.0.1

### Added

- `snapToStep()` — pointer and programmatic updates respect `data-step` (single + range).
- Docs playground: **Budget (stepped range)** demo (`data-step="50"`).

## 4.0.0

### Changed

- **Breaking:** no inline thumb positioning — removed `data-position`, `PositionMode`, and all JS `transform` / `z-index` on thumbs.
- The component only syncs ARIA and host CSS variables (`--ratio`, `--min-ratio`, etc.). Layout is consumer CSS.
- Document CSS variable positioning (README, docs, SPEC §8).

### Removed

- `data-position` attribute and `position` property.
- Unused geometry helpers (`thumbOffset`, `multiThumbTranslate`) and dead `getThumbs()` API.

## 3.0.1

### Changed

- Drop runtime ARIA / orientation validation — markup is the source of truth; use an a11y linter (aligned with `@agencecinq/spinbutton`).
- Only structural errors remain: wrong thumb count for the tag.

## 3.0.0

### Added

- **`cinq-slider-range`** — dedicated two-thumb range component (`SliderRange` class).
- **`slider-base.ts`** — shared rail lifecycle, pointer capture, resize, options.

### Changed

- **Breaking:** `<cinq-slider>` accepts **exactly one** thumb again. Use `<cinq-slider-range>` for two thumbs.
- Range API (`setValues`, `$min` / `$max`, `boundsMin` / `boundsMax`, range CSS vars) lives on `SliderRange` only.
- `slider:change` on `<cinq-slider>` always `{ value }`; on `<cinq-slider-range>` always `{ min, max, active }`.

### Removed

- Mode auto-detection (`isRange`, dual API on one tag).

## 2.0.0

### Added

- **Range mode:** two horizontal thumbs (APG DOM order: max, then min).
- Anti-crossing, dynamic `aria-valuemin` / `aria-valuemax` between thumbs.
- `setValues(min, max, options?)`, `$min` / `$max`, `isRange`, `boundsMin` / `boundsMax`.
- Host `[data-active="min"|"max"]`, CSS vars `--min`, `--max`, `--min-ratio`, `--max-ratio`.
- Multi-thumb APG Home / End semantics and z-index stacking when thumbs overlap.
- `slider:change` detail `{ min, max, active }` in range mode (`isRangeDetail()` helper).

### Changed

- Package version 2.0.0. Single-thumb API unchanged (`value`, `setValue`, `{ value }` event).

## 1.0.0

### Added

- Initial release: single-thumb horizontal slider with RTL support.
- APG keyboard and pointer interaction on `[role="slider"]` thumb.
- `slider:change` event (`EVENTS.SLIDER_CHANGE`) with `{ value }`.
- Host CSS custom properties `--value` and `--ratio`.
- `setValue()`, `sync()`, `rect()`, `init()` / `destroy()` lifecycle.
