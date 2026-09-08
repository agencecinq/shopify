---
name: cinq-ui-package
description: >-
  Design and implement a new @agencecinq/* Web Component package in the CINQ UI
  monorepo (spec, APG markup, events, docs, release). Use when adding a component
  package, writing SPEC.md, porting from @19h47/*, harmonizing data attributes or
  events, or asking how to structure cinq-* packages.
---

# CINQ UI package

Design and ship a behavior-only accessible Web Component in `packages/<name>/`.

## When to use

- New component from an [APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/)
- Port from [`@19h47/*`](https://github.com/19h47) to `@agencecinq/*`
- Spec before implementation (user asks for a spec)
- Extend `@agencecinq/utils` `EVENTS`

## Workflow

```
1. Spec (packages/<name>/SPEC.md)
2. Check overlap with existing packages (see reference.md)
3. Implement packages/<name>/src/
4. Add EVENTS.* in packages/utils if needed
5. Build: pnpm -C packages/<name> build
6. Docs: apps/docs/.../components/<name>.mdx + playground Astro
7. README + CHANGELOG + version bump
8. changeset + pnpm release (npm) — separate from git push / Pages deploy
```

**Do not** skip the spec when the API or APG mapping is non-trivial.

## Philosophy (non-negotiable)

- **HTML is the source of truth** for roles, ARIA, labels, initial state
- **Behavior only** — no imposed layout, theme, or Twig/templates
- **Progressive enhancement** — meaningful markup before JS
- Component does not invent missing ARIA or run a11y linting
- **Focus styling is CSS-only** — never toggle a `.focus` class (or equivalent) in JS. Use native `:focus-visible` / `:focus` in **consumer** stylesheets. The component may call `.focus()` on the control, not `.classList.add('focus')`

Copy blockquote for README/docs:

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

## Naming

| Item | Convention | Example |
| ---- | ---------- | ------- |
| Package | `@agencecinq/<name>` | `@agencecinq/slider` |
| Custom element | `cinq-<name>` | `<cinq-slider>` |
| Host data attrs | `data-<option>` — **no package prefix** | `data-step`, `data-hash` |
| Events | `<package>:<action>` on host (or documented target) | `slider:change` |
| Utils constant | `SCREAMING_SNAKE` | `SLIDER_CHANGE: 'slider:change'` |
| Public DOM refs | `$property` | `$input`, `$separator` |
| Private state | `#field` / `#method()` | ES private, not TS `private` |

## Host lifecycle

Every host `extends HTMLElement`:

- `connectedCallback` → `init()`
- `disconnectedCallback` → `destroy()`
- `init()` does **not** call `destroy()`
- `init` / `destroy` stay **public** for DOM mutation

```js
host.destroy();
// mutate light DOM...
host.init();
```

See `.cursor/rules/package-lifecycle.mdc` and `.cursor/rules/typescript-private-fields.mdc`.

## SPEC.md outline

Write `packages/<name>/SPEC.md` before coding. Template: [spec-template.md](spec-template.md).  
Worked example: [packages/slider/SPEC.md](../../../packages/slider/SPEC.md).

Required sections:

1. Goals / non-goals / relation to existing packages
2. Custom element tag + import
3. Markup contract (required selectors + ARIA)
4. Host `data-*` options
5. Events + `Detail` type
6. Public API (`init`, `destroy`, methods, getters)
7. Styling hooks (CSS vars, reflected attrs — optional)
8. Utils changes
9. Package layout + docs plan
10. Version plan + acceptance criteria

## Package scaffold

Copy from `packages/spinbutton/`:

```
packages/<name>/
  SPEC.md
  package.json      # peerDependencies: @agencecinq/utils
  tsconfig.json
  vite.config.ts    # vite + vite-plugin-dts, ESM entry dist/index.js
  CHANGELOG.md
  README.md
  src/
    index.ts        # customElements.define + exports
    <name>.ts       # host class
    types.ts
```

`package.json` scripts: `build`, `dev` (watch).  
`publishConfig.access`: `public`.

## Implementation checklist

- [ ] APG keyboard + pointer match pattern (link in README)
- [ ] `EVENTS` + `dispatchEvent` from `@agencecinq/utils` where applicable
- [ ] `#` private fields for internal listeners/state; `$` for public DOM refs
- [ ] **No `.focus` class** — focus appearance via consumer `:focus-visible` only
- [ ] `observedAttributes` only for host `data-*` that must react live
- [ ] `throw` clear errors in `init()` for invalid markup (missing required nodes)
- [ ] Credit `@19h47/<name>` in README when porting
- [ ] Build dist; no hand-editing dist except via build

## README checklist

Match `packages/windowsplitter/README.md` / `packages/spinbutton/README.md`:

- npm badges
- Tagline: `Accessible, WAI-ARIA <pattern> as a lightweight Web Component.`
- APG link + inspired-by line
- `## Installation` / `## Usage` / `### Web Component (\`<cinq-*>\`)`
- Required markup table
- Options / API / Keyboard / Events (with `EVENTS` import example)
- `## Build setup` → `pnpm -C packages/<name> build`
- `## Acknowledgments` + link to https://agencecinq.github.io/ui/components/<name>/

**Prose:** no semicolons in copy, no quadratins (`—`, `–`, `→`, `←`, `↑`, `↓`, `·`, `…`). Use `.`, `,`, ` to `, `...`.

## Consumer styling and accessibility (document, do not enforce)

The package owns **behavior** (APG keyboard, pointer, ARIA sync, events). The consumer owns **CSS**:

- Thumb/track layout, colors, contrast
- **Touch target size** — document WCAG guidance (44×44px recommended, 24×24px AA minimum). Example: 44px hit area with a smaller visual knob via `::before`
- **Focus rings** — `:focus-visible` on the interactive element, never a JS-managed `.focus` class
- Optional `formatValue` / `aria-valuetext` when numbers are not human-friendly (APG Rating, Media Seek examples)

For sliders, link the APG [touch AT warning](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) and official [Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/).

Playground demos must use `:focus-visible`, not `[data-header].focus` / `.focus` selectors tied to component JS.

**Playground copy:** AD&D themed examples (tabard colors, encounter difficulty, loot, potions, HP bands). Keep demo intros short. Do not list APG example names or link every demo to the APG gallery.

## `@agencecinq/slider` (validated spec)

Full spec: [packages/slider/SPEC.md](../../../packages/slider/SPEC.md).

| Version | Scope |
| ------- | ----- |
| **1.0.0** | Single thumb, horizontal + **RTL** — [APG Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) |
| **2.0.0** | Multi-thumb range + RTL — port [@19h47/slider](https://github.com/19h47/19h47-slider), [APG Multi-Thumb](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) |
| **2.x** | Vertical orientation (single + multi). RTL does not apply to vertical axis |

RTL: `getComputedStyle(host).direction === 'rtl'` (same as tabs). Mirror horizontal thumb position and pointer; swap Left/Right keys only. `aria-valuenow` / `--ratio` stay semantic.

- Event v1: `{ value }` + `--value` / `--ratio`
- Event v2 multi: `{ min, max, active }` + `--min` / `--max` / ratios
- Not the same as `spinbutton` (discrete), `windowsplitter` (layout), or `combobox` (editable + listbox)
- Standalone **listbox** package is optional later — overlaps combobox popup; only if multi-select or always-visible list is needed

## Docs checklist

- `apps/docs/src/content/docs/components/<name>.mdx`
- `apps/docs/src/content/docs/_components/<Name>Playground.astro`
- Entry in `apps/docs/astro.config.mjs` sidebar
- `RegisterComponents.astro`: `import '@agencecinq/<name>'` + `display: block` if needed
- Update `reference/utils.mdx` if new events

## Release

Versions live in `package.json` + `CHANGELOG.md`. Use changesets:

```bash
pnpm change
pnpm version-packages   # if changesets pending
pnpm build
pnpm release            # npm publish — requires OTP if 2FA
```

Git push to `main` deploys docs only (`.github/workflows/pages.yml`), not npm.

Breaking API → major bump. Event renames / data attr renames → major + migration note.

## Overlap guard

Before a new package, confirm it is not already covered:

| Need | Existing package |
| ---- | ---------------- |
| Discrete numeric input | `spinbutton` |
| Layout pane split | `windowsplitter` |
| Editable autocomplete | `combobox` (embeds listbox popup) |
| On/off binary | `switch` |
| Show/hide section | `disclosure-button`, `accordion` |
| Overlay / off-canvas | `modal`, `drawer` |

See [reference.md](reference.md) for APG → package map.

## Additional resources

- [spec-template.md](spec-template.md) — blank SPEC skeleton
- [reference.md](reference.md) — conventions + APG map + event registry
