# CINQ UI package — reference

## Published packages (monorepo)

| Package | Element | APG / role |
| ------- | ------- | ---------- |
| accordion | `cinq-accordion` | Accordion |
| calendar | `cinq-calendar` | Date picker (grid + dialog derived) |
| combobox | `cinq-combobox` | Combobox |
| disclosure-button | `cinq-disclosure-button` | Disclosure |
| drawer | `cinq-drawer` | (overlay, app-level) |
| modal | `cinq-modal` | Dialog (Modal) |
| spinbutton | `cinq-spinbutton` | Spinbutton |
| switch | `cinq-switch` | Switch |
| tabs | `cinq-tabs` | Tabs |
| windowsplitter | `cinq-windowsplitter` | Window Splitter |
| utils | `@agencecinq/utils` | EVENTS, DOM helpers |

Sandbox (not npm): `pixelate`, `dual-scroll`.

Draft spec: `packages/slider/SPEC.md` (validated).

### Slider roadmap

| Version | APG | Notes |
| ------- | --- | ----- |
| 1.0.0 | [Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) | Single thumb, horizontal + RTL |
| 2.0.0 | [Multi-Thumb](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) | Port 19h47; max thumb first, min second; RTL |
| 2.x | Vertical examples | After multi-thumb; RTL N/A on vertical axis |

## APG gaps (candidates)

| APG pattern | Notes |
| ----------- | ----- |
| Slider / Multi-Thumb | `@agencecinq/slider` — spec validated, see roadmap above |
| Menu / Menu Button | No nav dropdown primitive |
| Carousel | Slide show |
| Popover / Tooltip | Contextual overlays |
| Listbox (standalone) | Non-editable select; combobox covers popup case |
| Radio Group / Checkbox | Form primitives |
| Alert / Alert Dialog | Live regions / confirm |
| Breadcrumb | Navigation |
| Meter / Progressbar | Status display |

## Event registry (`packages/utils/src/events.ts`)

Pattern: `{package}:{action}`. Document-level: drawer, modal on `document.documentElement`.  
Most others: bubble from host or child (tabs, accordion).

When adding an event:

1. Add to `events.ts` + rebuild utils
2. Dispatch with `dispatchEvent` from utils where cancelable
3. Document in package README + `reference/utils.mdx`
4. Major bump if renaming existing public event

## Data attributes (host)

No redundant package prefix on `<cinq-*>`:

- tabs: `data-hash`, `data-delay`
- accordion: `data-hash`, `data-multiselectable`, `data-panel`, `data-header`, …
- windowsplitter: `data-mode`, `data-step`, `data-page`, `data-fixed`
- spinbutton: `data-step`, `data-delay`
- combobox: `data-mode`, `data-debounce`, …

Panel/child hooks may use short `data-*` on descendants (`data-panel`, `data-header`).

## Focus and styling

- Components call `.focus()` where APG requires moving focus to a control
- Components **must not** toggle `.focus` / `.is-focused` classes for styling hooks
- Docs and playgrounds use `:focus-visible` (or `:focus`) in CSS, not `.focus` selectors
- Legacy: `accordion` Panel still toggles `.focus` on headers — do not extend this pattern; prefer `:focus-visible` in new code and when touching accordion styling

## Keyboard modules

Non-trivial APG keyboard maps live in `src/keyboard.ts` as **`export default class Keyboard`** (same as `combobox`, `calendar`, `windowsplitter`).

- Host-bound: `new Keyboard(host)` with a `handle(event)` method wired in `init()`
- Stateless map (slider): `new Keyboard(step, page, rtl, vertical).delta(key)` plus static helpers (`Keyboard.isHome`, `Keyboard.isEnd`)
- Do not export freestanding `keyboardDelta()` helpers

## Docs site

- Base URL: https://agencecinq.github.io/ui/
- Config: `apps/docs/astro.config.mjs`
- Public assets: `apps/docs/public/` → `/ui/...`

## Reference READMEs

Gold standard for tone and structure:

- `packages/windowsplitter/README.md`
- `packages/spinbutton/README.md`
- `packages/disclosure-button/README.md`

## Port from @19h47

1. Read legacy repo README + APG example
2. Map class API → `<cinq-*>` + `init`/`destroy`
3. Map legacy events → `package:action` + EVENTS
4. Map JS options → host `data-*` or HTML ARIA
5. Note migration table in SPEC + README
