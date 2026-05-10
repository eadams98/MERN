/**
 * Single source of truth for API origins.
 *
 * Values come from CRA **build-time** env (`REACT_APP_*`). Different deployments
 * (local, AWS, staging) = different builds with different env vars—not a runtime toggle.
 *
 * See README: "Switching endpoints (local vs AWS vs staging)".
 *
 * - **BASE_URL** — Main API: auth (`/user/...`), profile, connections, buckets,
 *   contractor/trainee/school lists, etc. Used by `useAxiosPersonal` and `src/API/axios.js`.
 * - **REPORTS_BASE_URL** — Reports service: `/contractor/report/...`, `/trainee/...`,
 *   `/school/...` report reads, create/update report, finalize, retort (see `reportApi.js`).
 *
 * Copy `.env.development.example` to `.env.development.local` for local backends.
 */
const trimTrailingSlashes = (u) =>
  typeof u === "string" ? u.replace(/\/+$/, "") : u;

const DEFAULT_API = "https://www.datareconreports.com";
const DEFAULT_REPORTS = "https://www.datareconreports.com/reports";

export const BASE_URL = trimTrailingSlashes(
  process.env.REACT_APP_API_BASE_URL || DEFAULT_API
);

export const REPORTS_BASE_URL = trimTrailingSlashes(
  process.env.REACT_APP_REPORTS_BASE_URL || DEFAULT_REPORTS
);

/** @deprecated Use REPORTS_BASE_URL */
export const LOCAL_REPORT_URL = REPORTS_BASE_URL;

/** Legacy name — same host as main API in current deployment */
export const BASE_URL_AWS = BASE_URL;

/** Direct reports host (legacy / alternate routing); override if needed */
export const REPORT_URL_AWS = trimTrailingSlashes(
  process.env.REACT_APP_REPORT_URL_AWS ||
    "https://www.datareconreports.com:4001"
);
