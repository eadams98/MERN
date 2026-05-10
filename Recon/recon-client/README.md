# recon-client

Create React App (react-scripts 3) front end for Recon.

## Node.js

- **Supported:** Node.js 18 LTS or newer (see `package.json` `engines`).
- **Recommended:** match `.nvmrc` (Node 20 LTS) via [nvm](https://github.com/nvm-sh/nvm): `nvm use`.

The `build` script sets `NODE_OPTIONS=--openssl-legacy-provider` for webpack 4 on modern Node (OpenSSL 3). If you run `react-scripts build` directly, set the same env var or expect the digest / crypto error on Node 17+.

**Styles:** global order is Bootstrap → `src/styles/tokens.css` → `src/styles/scaffold.css` → `index.css` → `CSS/general.css` (see `src/index.jsx`).

**Dependencies:** `@reduxjs/toolkit` and `axios` are pinned to versions that work with **Create React App 3** and its Jest setup (CommonJS-friendly). Upgrading `react-scripts` (or adding CRACO / eject + ESM transforms) would allow moving back to current `@reduxjs/toolkit` 2.x and `axios` 1.x line without test workarounds.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Dev server |
| `npm run build` | Production bundle |
| `npm test` | Jest in watch mode (interactive) |
| `npm run test:ci` | Jest once, non-interactive (CI / agents) |
| `npm run lint` | ESLint on `src/**/*.js` and `src/**/*.jsx` |

For automation and CI, treat **`test:ci`** and **`lint`** as the contract for “green” checks.
