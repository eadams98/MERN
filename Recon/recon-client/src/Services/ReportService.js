/**
 * Legacy placeholder — report HTTP lives in SelectUserWeek / reportApi / ReportService callers.
 * Prefer `REPORTS_BASE_URL` from `Utilities/URLs.js` for report requests.
 */
class ReportService {
  /*
  Example (use REPORTS_BASE_URL from ../Utilities/URLs):
  contractorGetReportYearsOfMyUser = async (userEmail, userId, axios) => {
    return axios({ baseURL: REPORTS_BASE_URL, url: `contractor/report/years?by=${userEmail}&for=${userId}`, method: "get"})
  }
  */
}

export default ReportService;
