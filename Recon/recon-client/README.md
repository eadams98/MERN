# recon-client

Create React App (react-scripts 3) front end for Recon.

## Node.js

- **Supported:** Node.js 18 LTS or newer (see `package.json` `engines`).
- **Recommended:** match `.nvmrc` (Node 20 LTS) via [nvm](https://github.com/nvm-sh/nvm): `nvm use`.

The **`build`** and **`start`** scripts set `NODE_OPTIONS=--openssl-legacy-provider` for webpack 4 on modern Node (OpenSSL 3). Without it, Node 17+ often throws `ERR_OSSL_EVP_UNSUPPORTED` for **both** `npm start` and `npm run build`. If you invoke `react-scripts` directly, set that env var yourself.

**Styles:** global order is Bootstrap → `src/styles/tokens.css` → `src/styles/scaffold.css` → `index.css` → `CSS/general.css` (see `src/index.jsx`).

**Dependencies:** `@reduxjs/toolkit` and `axios` are pinned to versions that work with **Create React App 3** and its Jest setup (CommonJS-friendly). Upgrading `react-scripts` (or adding CRACO / eject + ESM transforms) would allow moving back to current `@reduxjs/toolkit` 2.x and `axios` 1.x line without test workarounds.

**Login (production vs development):** Production builds ship with **empty** username/password fields. For local convenience only, add to `.env.development.local` (never commit secrets):

```bash
REACT_APP_LOGIN_DEV_USER=your.dev.login
REACT_APP_LOGIN_DEV_PASS=your.dev.password
```

These are read **only when `NODE_ENV === "development"`**.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Dev server (sets OpenSSL legacy flag for webpack 4 on Node 17+, same as build) |
| `npm run build` | Production bundle |
| `npm test` | Jest in watch mode (interactive) |
| `npm run test:ci` | Jest once, non-interactive (CI / agents) |
| `npm run lint` | ESLint on `src/**/*.js` and `src/**/*.jsx` |
| `npm run test:e2e` | Playwright visual regression (production build + `serve`) |
| `npm run test:e2e:ui` | Playwright UI mode (debugging) |
| `npm run test:e2e:update` | Regenerate screenshot baselines after intentional UI changes |

For automation and CI, treat **`test:ci`** and **`lint`** as the contract for “green” checks. Add **`test:e2e`** when you want visual coverage (see below).

## Playwright — visual regression

Automated screenshots live in `e2e/visual.spec.js-snapshots/` (PNG). PRs show pixel diffs when the login page (and optional `/home` dashboard) changes.

**Setup (once per clone):**

```bash
npx playwright install chromium
```

**Run:** `npm run test:e2e` — starts a local static server from `npm run build`, then compares to committed baselines.

**Update baselines** after you deliberately change the UI:

```bash
npm run test:e2e:update
```

**Faster local iteration** (point at an already-running server — match its port):

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

(Do not set `PLAYWRIGHT_SKIP_WEB_SERVER` in CI unless you start the server yourself.)

**Authenticated `/home` screenshot** (optional — needs real API credentials hitting the same backend as the app):

```bash
E2E_USERNAME=you E2E_PASSWORD=secret E2E_ROLE=contractor npm run test:e2e:update
```

`E2E_ROLE` is `contractor` | `trainee` | `school` (matches the login tabs).

**HTML report** after a run: `npx playwright show-report`

Baseline filenames omit the host OS so Linux CI and macOS can share the same PNG; minor font differences may require bumping `maxDiffPixels` in `playwright.config.js` if CI flakes.
