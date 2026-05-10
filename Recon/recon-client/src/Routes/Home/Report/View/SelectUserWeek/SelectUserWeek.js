import React from 'react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../../State/Slices/userSlice";
import { Col, Container, Form, Row, Button, FormLabel, Spinner } from "react-bootstrap"
import ContentCard from "../../../../../components/page/ContentCard";
import ReportWeekToolbar from "./ReportWeekToolbar";
import styles from "./SelectUserWeek.module.css";
import useAxiosPersonal from "../../../../../Hooks/useAxiosPersonal";
import _ from 'lodash'
import useSnapshots from "../../../../../Hooks/useSnapshots";
import Swal from "sweetalert2";
import { LOCAL_REPORT_URL } from "../../../../../Utilities/URLs";
import {
  finalizeReport,
  createTraineeRetort,
  getSchoolReport,
  getSchoolReportYears,
  getSchoolReportMonths,
  getSchoolReportWeeks,
} from "../../../../../Services/reportApi";

const SelectUserWeek = ({userID, contractorEmail, role, resetParent}) => {
  //Hooks
  const axios = useAxiosPersonal()
  const snapshots = useSnapshots()
  const user = useSelector(userSelector)

  // Services
  //const reportService = ReportService()

  //Variables
  const [reportYear, setReportYear] = useState("")
  const [reportMonth, setReportMonth] = useState("")
  const [reportWeek, setReportWeek] = useState("")
  const [isError, setIsError] = useState(false)

  const [reportYears, setReportYears] = useState([])
  const [reportMonths, setReportMonths] = useState([])
  const [reportDays, setReportDays] = useState([])

  const [reportForm, setReportForm] = useState({})
  const [inRevise, setInRevise] = useState(false)
  const [loading, setLoading] = useState(true)
  /** Draft text for POST /trainee/create-retort (one retort per report) */
  const [retortDraft, setRetortDraft] = useState("")
  const GRADES = [
    "A+", "A", "A-",
    "B+", "B", "B-",
    "C+", "C", "C-",
    "D+", "D", "D-",
    "F+", "F", "F-",
  ]

  // Methods 
  const checkSnapshotValidation = () => {
    const snapshot = snapshots.GetSnapshot('reportForm')
    console.log(reportForm, snapshot)
    console.log(_.isEqual(reportForm, snapshot))
    if(!_.isEqual(reportForm, snapshot)) {
      setReportForm({...snapshot})
    }
  }

  const updateReportForm = (e) => {
    const { name, value } = e.target
    setReportForm((prevState) => {return { ...prevState, [name]: value }})
  }

  const parseWeekRange = () => {
    const parts = (reportWeek || "").split(" - ")
    if (parts.length < 2) return null
    return { weekStart: parts[0].trim(), weekEnd: parts[1].trim() }
  }

  const handleFinalizeRating = async () => {
    const wr = parseWeekRange()
    if (!wr || role?.toLowerCase() !== "contractor") return
    setLoading(true)
    try {
      const res = await finalizeReport(axios, LOCAL_REPORT_URL, {
        byEmail: user.user.email,
        forEmail: userID,
        weekStart: wr.weekStart,
        weekEnd: wr.weekEnd,
      })
      setReportForm((prev) => ({
        ...prev,
        isFinalized: res.data.isFinalized,
        finalizedAt: res.data.finalizedAt,
      }))
      Swal.fire({ position: "top", icon: "success", timer: 2000, text: "Rating finalized." })
    } catch (e) {
      const msg = e.response?.data?.errorMessage ?? e.message ?? "Could not finalize."
      Swal.fire({ position: "top", icon: "error", timer: 2500, text: msg })
    }
    setLoading(false)
  }

  const handleSubmitTraineeRetort = async () => {
    const wr = parseWeekRange()
    if (!wr || role?.toLowerCase() !== "trainee" || !retortDraft.trim()) return
    setLoading(true)
    try {
      const res = await createTraineeRetort(axios, LOCAL_REPORT_URL, {
        content: retortDraft.trim(),
        sentByEmail: contractorEmail,
        sentForEmail: user.user.email,
        weekStartDate: wr.weekStart,
        weekEndDate: wr.weekEnd,
      })
      setReportForm((prev) => ({
        ...prev,
        retortContent: res.data.retortContent ?? retortDraft.trim(),
      }))
      setRetortDraft("")
      Swal.fire({ position: "top", icon: "success", timer: 2000, text: "Retort saved." })
    } catch (e) {
      const msg = e.response?.data?.errorMessage ?? e.message ?? "Could not save retort."
      Swal.fire({ position: "top", icon: "error", timer: 2500, text: msg })
    }
    setLoading(false)
  }

  const submitRevision = async () => {
    setLoading(true)
    try {
      console.log(reportForm)
      const isRevisionByTrainee = role === "trainee" ? true : false
      const response = await axios({ baseURL: LOCAL_REPORT_URL, url:`contractor/update-report?revision=${isRevisionByTrainee}`, method: "put", data: reportForm})
      const updatedSnapshot = {
        ...snapshots.GetSnapshot('reportForm'),
        "grade": reportForm.grade,
        "description": reportForm.description,
        "title": reportForm.title,
        "rebuttal": reportForm.rebuttal
      }
      snapshots.SetSnapshot('reportForm', updatedSnapshot)
      setInRevise(false)

      Swal.fire({
        position: 'top',
        icon: 'success',
        timer: 2000,
        text: response.data.data,
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        position: 'top',
        icon: 'error',
        timer: 2000,
        text: "SOME ERROR OCCURED"
      })
    }
    setLoading(false)  
  }

  // Effects
  useEffect(() => {
    console.log(userID)
    setLoading(true)
    
    const getReportYearsOfMyUser = async () => {
      console.log(role)
      let response;
      const defaultContractorReportForm = {
        reportId: "",
        grade: "",
        description: "",
        rebuttal: "",
        title: "",
        isFinalized: null,
        retortContent: "",
      }
      const defaultJrContractorReportForm = {
        reportId: "",
        grade: "",
        description: "",
        rebuttal: "",
        title: "",
        isFinalized: null,
        retortContent: "",
      }

      try {
      switch(role.toLowerCase()) {
        case "contractor": 
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          //response = await reportService.contractorGetReportYearsOfMyUser(user.user.email, userID)
          response = await axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/years?by=${user.user.email}&for=${userID}`, method: "get"})
          break
        case "trainee":
          setReportForm(defaultJrContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/years?by=${contractorEmail}&for=${user.user.email}`, method: "get"})
          break
        case "school":
          setReportForm(defaultJrContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await getSchoolReportYears(axios, LOCAL_REPORT_URL, contractorEmail, userID)
          break
        default:
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
      }
      console.log(response)
      setReportYears(response.data)
    } catch (err) {
      setIsError(true)
      Swal.fire({
        position: 'top',
        icon: 'error',
        timer: 2000,
        text: "SOME ERROR OCCURED"
      })
    }
      
      
      setLoading(false)
    }
    getReportYearsOfMyUser()
  }, [])

  useEffect(() => {
    const getReport = async () => {
      const wr = parseWeekRange()
      if (!wr) return
      setLoading(true)

      let response
      try {
        switch (role.toLowerCase()) {
          case "contractor":
            response = await axios({
              baseURL: LOCAL_REPORT_URL,
              url: `contractor/get-report?by=${encodeURIComponent(user.user.email)}&for=${encodeURIComponent(userID)}&weekStart=${wr.weekStart}&weekEnd=${wr.weekEnd}`,
              method: "get",
            })
            break
          case "trainee":
            response = await axios({
              baseURL: LOCAL_REPORT_URL,
              url: `trainee/get-report?by=${encodeURIComponent(contractorEmail)}&for=${encodeURIComponent(user.user.email)}&weekStart=${wr.weekStart}&weekEnd=${wr.weekEnd}`,
              method: "get",
            })
            break
          case "school":
            response = await getSchoolReport(
              axios,
              LOCAL_REPORT_URL,
              contractorEmail,
              userID,
              wr.weekStart,
              wr.weekEnd
            )
            break
          default:
            setLoading(false)
            return
        }
      } catch (error) {
        console.log(error)
        const msg =
          error.response?.data?.errorMessage ??
          "This report is not visible yet (contractor may not have finalized it)."
        Swal.fire({ position: "top", icon: "info", timer: 3000, text: msg })
        setLoading(false)
        return
      }

      console.log(response)
      const d = response.data
      setReportForm((prev) => {
        const updatedReportForm = {
          ...prev,
          reportId: d.reportId,
          description: d.description,
          grade: d.grade,
          title: d.title,
          rebuttal: d.rebuttal,
          isFinalized: d.isFinalized,
          retortContent: d.retortContent ?? "",
        }
        snapshots.SetSnapshot("reportForm", updatedReportForm)
        return updatedReportForm
      })
      setRetortDraft("")
      setLoading(false)
    }
    if (reportWeek !== "") {
      getReport()
    }
  }, [reportWeek])

  useEffect(()=>{
    console.log(reportForm)
  },[reportForm])

  useEffect(()=>{
    const getReportMonthsOfMyUser = async () => {
      console.log(role)
      let response;
      const defaultContractorReportForm = {
        reportId: "",
        grade: "",
        description: "",
        rebuttal: "",
        title: "",
        isFinalized: null,
        retortContent: "",
      }
      const defaultJrContractorReportForm = {
        reportId: "",
        grade: "",
        description: "",
        rebuttal: "",
        title: "",
        isFinalized: null,
        retortContent: "",
      }
      switch(role.toLowerCase()) {
        case "contractor": 
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/months?by=${user.user.email}&for=${userID}&year=${reportYear}`, method: "get"})
          break
        case "trainee":
          setReportForm(defaultJrContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/months?by=${contractorEmail}&for=${user.user.email}&year=${reportYear}`, method: "get"})

          break
        case "school":
          setReportForm(defaultJrContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await getSchoolReportMonths(axios, LOCAL_REPORT_URL, contractorEmail, userID, reportYear)
          break
        default:
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
      }

      
      setLoading(true)
      console.log(response)
      setReportMonths(response.data)
      setLoading(false)
      
    }
    if (reportYear !== "") {
      getReportMonthsOfMyUser()
    }
  },[reportYear])

  useEffect(()=>{
    const getReportDaysOfMyUser = async () => {
      console.log(role)
      let response;
      const defaultContractorReportForm = {
        reportId: "",
        grade: "",
        description: "",
        rebuttal: "",
        title: "",
        isFinalized: null,
        retortContent: "",
      }
      const defaultJrContractorReportForm = {
        reportId: "",
        grade: "",
        description: "",
        rebuttal: "",
        title: "",
        isFinalized: null,
        retortContent: "",
      }
      switch(role.toLowerCase()) {
        case "contractor": 
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await axios({ baseURL: LOCAL_REPORT_URL, url: `contractor/report/weeks?by=${user.user.email}&for=${userID}&year=${reportYear}&month=${reportMonth}`, method: "get"})
          break
        case "trainee":
          setReportForm(defaultJrContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await axios({
            baseURL: LOCAL_REPORT_URL,
            url: `trainee/get-contractors?by=${encodeURIComponent(contractorEmail)}&for=${encodeURIComponent(user.user.email)}&year=${reportYear}&month=${encodeURIComponent(reportMonth)}`,
            method: "get",
          })
          break
        case "school":
          setReportForm(defaultJrContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await getSchoolReportWeeks(
            axios,
            LOCAL_REPORT_URL,
            contractorEmail,
            userID,
            reportYear,
            reportMonth
          )
          break
        default:
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
      }

      setLoading(true)
      console.log(response)
      setReportDays(response.data)
      setLoading(false)
    }

    if (reportMonth !== "") {
      getReportDaysOfMyUser()
    }
  },[reportMonth])

  if (loading) { return <Spinner/>}
  else if (!loading && isError) { return <h1>ERROR LOADING SOME DATA</h1> }
  else return (
    <Container fluid className={styles.page}>
      <ReportWeekToolbar
        onBack={resetParent}
        yearOptions={reportYears}
        monthOptions={reportMonths}
        weekOptions={reportDays}
        yearValue={reportYear}
        monthValue={reportMonth}
        weekValue={reportWeek}
        onYearChange={(e) => setReportYear(e.target.value)}
        onMonthChange={(e) => setReportMonth(e.target.value)}
        onWeekChange={(e) => setReportWeek(e.target.value)}
        disabled={inRevise}
      />

      <Row className={styles.mainRow}>
        <div className={styles.weekBanner}>
          {reportYear !== "" && reportMonth !== "" && reportWeek !== ""
            ? `${reportWeek}`
            : "NO DATE"}
        </div>
        <Container fluid className={styles.panel}>
          <ContentCard className={styles.section}>
            <div className={styles.sectionLabel}>Grade</div>
            <Row>
              <Col>
                {inRevise ? (
                  <Form.Select
                    value={reportForm.grade}
                    name="grade"
                    onChange={updateReportForm}
                    style={{ textAlign: "center" }}
                  >
                    <option value="" />
                    {GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <FormLabel>{reportForm.grade}</FormLabel>
                )}
              </Col>
            </Row>
          </ContentCard>

          <ContentCard className={styles.section}>
            <div className={styles.sectionLabel}>Description</div>
            <Row>
              <Col>
                {inRevise && role === "contractor" ? (
                  <textarea
                    name="description"
                    value={reportForm.description}
                    onChange={updateReportForm}
                    className={styles.textarea}
                    rows={6}
                  />
                ) : (
                  <Form.Label style={{ width: "100%" }}>{reportForm.description}</Form.Label>
                )}
              </Col>
            </Row>
          </ContentCard>

          {role === "contractor" && reportWeek && reportForm.reportId ? (
            <ContentCard className={styles.section}>
              <Row>
                <Col>
                  {reportForm.isFinalized ? (
                    <FormLabel>Status: finalized</FormLabel>
                  ) : (
                    <>
                      <FormLabel>
                        Draft — finalize to allow school visibility and junior retort.
                      </FormLabel>
                      <Button
                        size="sm"
                        className="ms-2"
                        type="button"
                        onClick={handleFinalizeRating}
                        disabled={inRevise}
                      >
                        Finalize rating
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </ContentCard>
          ) : null}

          {(role === "trainee" || role === "school") && (
            <ContentCard className={styles.section}>
              {role === "trainee" ? (
                <>
                  <div className={styles.sectionLabel}>Retort</div>
                  <Row className="mb-3">
                    <Col>
                      {reportForm.retortContent ? (
                        <Form.Label style={{ width: "100%" }}>
                          {reportForm.retortContent}
                        </Form.Label>
                      ) : reportForm.isFinalized === true ? (
                        <>
                          <textarea
                            value={retortDraft}
                            onChange={(e) => setRetortDraft(e.target.value)}
                            placeholder="Your retort (one per rating)"
                            className={styles.textarea}
                            rows={3}
                          />
                          <Button
                            size="sm"
                            className="mt-1"
                            type="button"
                            onClick={handleSubmitTraineeRetort}
                            disabled={!retortDraft.trim()}
                          >
                            Submit retort
                          </Button>
                        </>
                      ) : (
                        <Form.Label>
                          Not available until the contractor finalizes this rating.
                        </Form.Label>
                      )}
                    </Col>
                  </Row>
                  <div className={styles.sectionLabel}>Revisions (legacy)</div>
                  <Row>
                    <Col>
                      {inRevise ? (
                        <textarea
                          name="rebuttal"
                          value={reportForm.rebuttal}
                          onChange={updateReportForm}
                          className={styles.textarea}
                          rows={5}
                        />
                      ) : (
                        <Form.Label style={{ width: "100%" }}>
                          {reportForm.rebuttal}
                        </Form.Label>
                      )}
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <div className={styles.sectionLabel}>Retort</div>
                  <Row>
                    <Col>
                      <Form.Label style={{ width: "100%" }}>
                        {reportForm.retortContent || "—"}
                      </Form.Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small>
                        School view is read-only (finalized ratings only).
                      </small>
                    </Col>
                  </Row>
                </>
              )}
            </ContentCard>
          )}

          {role !== "school" ? (
            <Row className={styles.actionsRow}>
              <Col md={{ span: 4, offset: 1 }} className="text-center">
                {inRevise ? (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => {
                      setInRevise(false);
                      checkSnapshotValidation();
                    }}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    type="button"
                    hidden={
                      !_.isEqual(reportForm, snapshots.GetSnapshot("reportForm"))
                    }
                    onClick={() => setInRevise(true)}
                  >
                    Revise
                  </Button>
                )}
              </Col>
              <Col md={{ span: 4, offset: 2 }} className="text-center">
                {inRevise ? (
                  <Button
                    type="button"
                    variant="success"
                    onClick={submitRevision}
                    disabled={_.isEqual(
                      reportForm,
                      snapshots.GetSnapshot("reportForm")
                    )}
                  >
                    submit
                  </Button>
                ) : null}
              </Col>
            </Row>
          ) : null}
        </Container>
      </Row>
    </Container>
  )
}

export default SelectUserWeek;