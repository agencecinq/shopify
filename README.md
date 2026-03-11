# CINQ UI Monorepo

Welcome to the **CINQ UI** monorepo. This repository is managed as a monorepo using **pnpm**, **Turborepo**, and **Changesets**.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v22 or higher)
- **pnpm** (v10 or higher)

---

## Setup & Installation

1. **Clone the repository**:

```bash
git clone https://github.com/agencecinq/ui.git
cd ui

```

2. **Install dependencies**:

```bash
pnpm install

```

_Note: Do not use `npm install` or `yarn install`. This project relies on pnpm workspaces._

---

## Daily Workflow

### Development

To start the development server for all packages and apps:

```bash
pnpm dev

```

Turbo will intelligently run all dev scripts. Thanks to our configuration, local changes in `@agencecinq/utils` will be reflected in `@agencecinq/drawer` and `@agencecinq/modal` automatically.

### Building

To compile all packages:

```bash
pnpm build

```

Turbo caches successful builds. If no code has changed, the build will finish in milliseconds.

### Type Checking & Linting

```bash
pnpm typecheck
pnpm lint
```

---

## Publishing New Versions

We use **Changesets** to manage versioning and NPM releases. Never manually update `package.json` version numbers.

### 1. Create a Change File

When your feature or fix is ready, run:

```bash
pnpm change
```

- Select the packages that were modified (e.g., `drawer`).
- Choose the version bump (Patch for fixes, Minor for features).
- Write a brief description of the change.

### 2. Versioning

Before releasing, generate the changelogs and update versions:

```bash
pnpm version-packages
```

### 3. Release to NPM

To build and publish the packages to the `@agencecinq` scope:

```bash
pnpm release
```

---

## Project Structure

- `packages/utils`: Shared logic, event bus, and helpers.
- `packages/drawer`: The Drawer Web Component and its Vite Plugin.
- `packages/modal`: The Modal Web Components (Modal + ModalButton).
- `packages/tabs`: The Tabs Web Component (`<cinq-tabs>`) and related utilities.
- `apps/`: Apps / themes consuming the packages (e.g. `apps/docs`).

---

## Best Practices

1. **Strict ESM**: Always use `import.meta.url` instead of `__dirname` in Node.js scripts (Vite plugins).
2. **Shared Utils**: If you write a utility function that could be used elsewhere, place it in `@agencecinq/utils`.
3. **Peer Dependencies**: When adding a dependency to a package, consider if it should be a `peerDependency` to avoid version conflicts in the final consumer project.

---

**Happy coding with CINQ!**
