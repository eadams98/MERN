//import axios from "axios";
import { BASE_URL, LOCAL_REPORT_URL, REPORT_URL_AWS } from "../Utilities/URLs";
import axiosRetry from 'axios-retry'
import { useSelector } from "react-redux";
import { userSelector } from "../State/Slices/userSlice";
//import TokenService from "./TokenService";
import useAxiosPersonal from '../Hooks/useAxiosPersonal'


class ReportService {
  /*
  // CONTRACTOR
  contractorGetReportYearsOfMyUser = async (userEmail, userId) => {
    let axios = useAxiosPersonal()
    return axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/years?by=${userEmail}&for=${userId}`, method: "get"})
    //return setTimeout(() => { console.log("OKKKKKKKK"); return null},5000)
  }
  contractorGetReportMonthsOfMyUser = async (userEmail, userId, reportYear) => {
    let axios = useAxiosPersonal()
    return axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/months?by=${userEmail}&for=${userId}&year=${reportYear}`, method: "get"})
  }
  contractorGetReportDaysOfMyUser = async (userEmail, userId, reportYear, reportMonth) => {
    let axios = useAxiosPersonal()
    return axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/weeks?by=${userEmail}&for=${userId}&year=${reportYear}&month=${reportMonth}`, method: "get"})
  }
  contractorGetReportForUser = async (userEmail, userId, reportWeek) => {
    let axios = useAxiosPersonal()
    return axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/get-report?by=${userEmail}&for=${userId}&weekStart=${reportWeek.split(" - ")[0]}&weekEnd=${reportWeek.split(" - ")[1]}`, method: "get"})
  }

  // TRAINEE
  traineeGetReportYearsOfMyUser = async (userEmail, userId) => {
    let axios = useAxiosPersonal()
    return axios({ baseURL: LOCAL_REPORT_URL, url: `trainee/report/years?by=${userEmail}&for=${userId}`, method: "get"})
  }
  traineeGetReportYearsOfMyUser = async (userEmail, userId, reportYear) => {
    return null //??
  }
  traineeGetReportDaysOfMyUser = async (userEmail, userId, reportYear, reportMonth) => {
    return null //??
  }
  traineeGetReportForUser = async (reportWeek) => {
    return null//axios.post(`get-jr-contractor-report`, { week: reportWeek })
  }*/
}


export default ReportService;