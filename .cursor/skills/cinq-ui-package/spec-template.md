# `@agencecinq/<name>` — Specification (draft)

> Accessible, WAI-ARIA <pattern> as a lightweight Web Component.
> Inspired by [`@19h47/<name>`](https://github.com/19h47/19h47-<name>) (if applicable).

**Status:** draft  
**Target APG:** [Pattern name](https://www.w3.org/WAI/ARIA/apg/patterns/<slug>/)

---

## 1. Goals

### In scope

- …

### Out of scope (v1)

- …

### Non-goals (relation to existing packages)

| Package | Pattern | Why not this package |
| ------- | ------- | -------------------- |
| … | … | … |

---

## 2. Custom element

| Item | Value |
| ---- | ----- |
| Tag | `cinq-<name>` |
| Package | `@agencecinq/<name>` |
| Import | `import "@agencecinq/<name>"` |

---

## 3. Markup contract

### 3.1 Structure

```html
<cinq-<name>>
  <!-- required markup -->
</cinq-<name>>
```

### 3.2 Required attributes / elements

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| … | … | … |

### 3.3 What the component writes at runtime

| Target | Attributes / properties |
| ------ | ----------------------- |
| … | … |

### 3.4 HTML is the source of truth

The component will **not** invent roles, migrate markup, or lint a11y.

---

## 4. Host options (`data-*`)

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| … | … | … | … |

---

## 5. Interaction

### Keyboard

| Key | Function |
| --- | -------- |
| … | … |

### Pointer / focus

- Pointer behavior per APG
- Focus on the APG control via `.focus()` — **no** JS `.focus` class for styling
- Document consumer `:focus-visible` in README

---

## 6. Consumer styling and accessibility (documentation only)

Not enforced by the package. Repeat in README and mdx.

- Touch targets, contrast, track/thumb appearance — consumer CSS
- Document WCAG target size guidance where pointer controls are small
- `:focus-visible` on interactive elements — never `.focus` class from JS
- APG pattern-specific warnings (e.g. slider touch AT)

---

## 7. Styling hooks (component state)

| Hook | When |
| ---- | ---- |
| … | … |

---

## 8. Events

| Event | Constant | Cancelable | Detail |
| ----- | -------- | ---------- | ------ |
| `<name>:<action>` | `<NAME>_<ACTION>` | … | … |

```ts
type <Name>ChangeDetail = {
  // ...
};
```

---

## 9. Public API

### Lifecycle

- `init()` / `destroy()` / `sync()` (if needed)

### Properties / methods

| Name | Description |
| ---- | ----------- |
| … | … |

---

## 10. Utils dependency

Add to `packages/utils/src/events.ts`:

```ts
<NAME>_<ACTION>: '<name>:<action>',
```

---

## 11. Package layout

```
packages/<name>/
  SPEC.md
  src/
    index.ts
    <name>.ts
    types.ts
```

---

## 12. Docs plan

- `components/<name>.mdx`
- `<Name>Playground.astro`
- Sidebar + RegisterComponents

---

## 13. Version plan

| Version | Content |
| ------- | ------- |
| 1.0.0 | … |

---

## 14. Open questions

1. …

---

## 15. Acceptance criteria

- [ ] APG keyboard/pointer on demo page
- [ ] axe clean on documented markup
- [ ] Events + EVENTS constant
- [ ] README + mdx aligned with SPEC
- [ ] Consumer a11y section (touch targets, `:focus-visible`, no JS `.focus` class)
- [ ] Playground CSS uses `:focus-visible`, not `.focus`
