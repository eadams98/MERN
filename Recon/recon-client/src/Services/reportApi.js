/**
 * Report microservice calls (rating finalization + trainee retort).
 * Pass an axios instance from useAxiosPersonal() and REPORTS_BASE_URL as baseURL.
 */

/**
 * @param {import('axios').AxiosInstance} axios
 * @param {string} baseURL - e.g. REPORTS_BASE_URL from Utilities/URLs.js
 * @param {{ byEmail: string, forEmail: string, weekStart: string, weekEnd: string }} params - dates ISO yyyy-MM-dd
 */
export function finalizeReport(axios, baseURL, { byEmail, forEmail, weekStart, weekEnd }) {
  const q = new URLSearchParams({
    by: byEmail,
    for: forEmail,
    weekStart,
    weekEnd,
  });
  return axios({
    baseURL,
    url: `contractor/finalize-report?${q.toString()}`,
    method: "put",
  });
}

/**
 * Junior / trainee authors the single retort for a finalized report.
 * @param {import('axios').AxiosInstance} axios
 * @param {string} baseURL
 * @param {{ content: string, sentByEmail: string, sentForEmail: string, weekStartDate: string, weekEndDate: string }} body
 */
export function createTraineeRetort(axios, baseURL, body) {
  return axios({
    baseURL,
    url: "trainee/create-retort",
    method: "post",
    data: body,
  });
}

/** School JWT — finalized ratings only (roster check in user-service). */

export function getSchoolReportYears(axios, baseURL, contractorEmail, traineeEmail) {
  const q = new URLSearchParams({ by: contractorEmail, for: traineeEmail });
  return axios({ baseURL, url: `school/report/years?${q}`, method: "get" });
}

export function getSchoolReportMonths(axios, baseURL, contractorEmail, traineeEmail, year) {
  const q = new URLSearchParams({ by: contractorEmail, for: traineeEmail, year: String(year) });
  return axios({ baseURL, url: `school/report/months?${q}`, method: "get" });
}

export function getSchoolReportWeeks(axios, baseURL, contractorEmail, traineeEmail, year, month) {
  const q = new URLSearchParams({
    by: contractorEmail,
    for: traineeEmail,
    year: String(year),
    month: String(month),
  });
  return axios({ baseURL, url: `school/report/weeks?${q}`, method: "get" });
}

export function getSchoolReport(axios, baseURL, contractorEmail, traineeEmail, weekStart, weekEnd) {
  const q = new URLSearchParams({
    by: contractorEmail,
    for: traineeEmail,
    weekStart,
    weekEnd,
  });
  return axios({ baseURL, url: `school/get-report?${q}`, method: "get" });
}
