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

/** When REACT_APP_* is missing, dev builds default to local services (never silent prod). */
const isDevelopment = process.env.NODE_ENV === "development";
const DEV_DEFAULT_API = "http://localhost:4000";
const DEV_DEFAULT_REPORTS = "http://localhost:4001";

export const BASE_URL = trimTrailingSlashes(
  process.env.REACT_APP_API_BASE_URL ||
    (isDevelopment ? DEV_DEFAULT_API : DEFAULT_API)
);

export const REPORTS_BASE_URL = trimTrailingSlashes(
  process.env.REACT_APP_REPORTS_BASE_URL ||
    (isDevelopment ? DEV_DEFAULT_REPORTS : DEFAULT_REPORTS)
);

if (isDevelopment && !process.env.REACT_APP_REPORTS_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "[URLs] REACT_APP_REPORTS_BASE_URL unset — using localhost:4001. Set REACT_APP_REPORTS_BASE_URL in .env.development(.local) to override."
  );
}

/** @deprecated Use REPORTS_BASE_URL */
export const LOCAL_REPORT_URL = REPORTS_BASE_URL;

/** Legacy name — same host as main API in current deployment */
export const BASE_URL_AWS = BASE_URL;

/** Direct reports host (legacy / alternate routing); override if needed */
export const REPORT_URL_AWS = trimTrailingSlashes(
  process.env.REACT_APP_REPORT_URL_AWS ||
    "https://www.datareconreports.com:4001"
);
