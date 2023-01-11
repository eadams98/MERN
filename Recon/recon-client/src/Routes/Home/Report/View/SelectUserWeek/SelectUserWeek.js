import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button, FormLabel, Spinner } from "react-bootstrap"
import useAxiosPersonal from "../../../../../Hooks/useAxiosPersonal";
import _ from 'lodash'
import useSnapshots from "../../../../../Hooks/useSnapshots";
import Swal from "sweetalert2";

const SelectUserWeek = ({userID, role, resetParent}) => {
  //Hooks
  const axios = useAxiosPersonal()
  const snapshots = useSnapshots()

  //Variables
  const [reportWeek, setReportWeek] = useState("")
  const [reportWeeks, setReportWeeks] = useState([])
  const [reportForm, setReportForm] = useState({})
  const [inRevise, setInRevise] = useState(false)
  const [loading, setLoading] = useState(true)
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

  const submitRevision = async () => {
    setLoading(true)
    try {
      const response = await axios.put(`/update-report`, reportForm)
      const updatedSnapshot = {
        ...snapshots.GetSnapshot('reportForm'),
        "grade": reportForm.grade,
        "description": reportForm.description
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
    
    const getReportWeeksOfMyUser = async () => {
      console.log(role)
      let response;
      const defaultContractorReportForm = {
        reportID: "",
        grade: "",
        description: "",
      }
      const defaultJrContractorReportForm = {
        reportID: "",
        grade: "",
        description: "",
        revision: "",
      }
      switch(role) {
        case "CONTRACTOR": 
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await axios.get(`get-my-submitted-reports/${userID}`)
          break
        case "JR. CONTRACTOR":
          setReportForm(defaultJrContractorReportForm)
          snapshots.SetSnapshot('reportForm')
          response = await axios.get(`get-my-report-weeks`)
          break
        default:
          setReportForm(defaultContractorReportForm)
          snapshots.SetSnapshot('reportForm')
      }

      setLoading(true)
      
      console.log(response)
      setReportWeeks(response.data)
      setLoading(false)
    }
    getReportWeeksOfMyUser()
  }, [])

  useEffect(() => {
    const getReport = async () => {
      let response
      setLoading(true)

      switch(role) {
        case "CONTRACTOR": 
          response = await axios.post(`get-contractor-report`, { week: reportWeek, createdFor: userID })
          break
        case "JR. CONTRACTOR":
          response = await axios.post(`get-jr-contractor-report`, { week: reportWeek })
          break
        default:
          //setReportForm(defaultContractorReportForm)
      }
     
      console.log(response)
      const updatedReportForm = {
        ...reportForm,
        reportID: response.data._id,
        description: response.data.description,
        grade: response.data.grade,
      }
      setReportForm(updatedReportForm)
      snapshots.SetSnapshot('reportForm', updatedReportForm)

      setTimeout(()=> {
        setLoading(false)
      },10000)
    }
    getReport()
      .catch(error => (console.log(error)))
  }, [reportWeek])

  useEffect(()=>{
    console.log(reportForm)
  },[reportForm])

  if (loading) { return <Spinner/>}
  else return (
    <Container fluid style={{ backgroundColor: "grey", height: "75vh" }}>

      {/* Row 1 */}
      <Row style={{ height: "10%", border: "solid" }}>
          <Col md={1} style={{ display: "flex" }}>
            <FormLabel onClick={resetParent} style={{ margin: "auto", textAlign: "center", cursor: "pointer" }}>{`< USERS`}</FormLabel>
          </Col>
          <Col md={{span: 4, offset: 3}} style={{ display: "flex" }}>
            <Form.Select
              value={reportWeek}
              onChange={(e) => setReportWeek(e.target.value)}
              disabled={inRevise} 
              style={{ margin: "auto", textAlign: "center" }} 
            >
              <option value="" hidden>{reportWeeks.length > 0 ? '--select a week---' : 'No Weeks'}</option>
              {
                reportWeeks.map( week => <option value={week}> {week} </option>)
              }
            </Form.Select>
          </Col>
      </Row>

      {/* Row 2 */}
      <Row style={{ height: "90%", border: "solid", display: "flex"}}>
        <Container fluid style={{ backgroundColor: "white", height: "90%", margin: "auto" }}>
          <div style={{height: "20%", border: "solid"}}>
            <Row>
              <Col>Grade</Col>
            </Row>
            <Row>
              <Col>
                {
                  inRevise ?
                    <Form.Select value={reportForm.grade} name='grade' onChange={updateReportForm} style={{textAlign: "center"}}>
                      <option value={""}></option>
                      {GRADES.map((grade, idx) => <option value={grade}>{grade}</option>)}
                    </Form.Select>
                    :
                    <FormLabel>{reportForm.grade}</FormLabel>
                }
              </Col>
            </Row>
          </div>

          <div style={{height: "40%", border: "solid"}}>
            <Row >
              <Col>Description</Col>
            </Row>
            <Row>
              <Col>
                {
                  inRevise ?
                    <textarea 
                      name="description"
                      value={reportForm.description}
                      onChange={updateReportForm}
                      style={{ width: "100%", height: "100%", resize: "none"}}
                    /> 
                    :
                    <Form.Label style={{width: "100%"}}>{reportForm.description}</Form.Label>
                }
              </Col>
            </Row>
          </div>

          <div style={{height: "30%", border: "solid"}}>
            {
              role == "JR. CONTRACTOR" ?
                <>
                  <Row style={{height: "20%", border: "solid"}}><Col>Revisions</Col></Row>
                  <Row style={{height: "80%", border: "solid green"}}>
                    <Col>
                      {
                        inRevise ?
                          <textarea
                            name="revision"
                            value={reportForm.revision}
                            onChange={updateReportForm}
                            type="textarea"
                            style={{ width: "100%", height: "100%", resize: "none"}}
                                               
                          />
                          :
                          null
                      }
                    </Col>
                  </Row>
                </>
                :
                null
            }
          </div>

          <Row style={{height: "10%", border: "solid"}}>
            <Col md={{span: 4, offset: 1}} style={{position: "relative"}}>
              {
                inRevise ?
                  <Button style={{position: "absolute", left: "38.5%", bottom: "5%"}} onClick={()=> {setInRevise(false); checkSnapshotValidation()}} variant="danger">Cancel</Button>
                  :
                  <Button style={{position: "absolute", left: "38.5%", bottom: "5%"}} onClick={()=> setInRevise(true)}>Revise</Button> 
              }
            </Col>
            <Col md={{span: 4, offset: 2}} style={{position: "relative"}}>
              {
                inRevise ? <Button style={{position: "absolute", left: "38.5%", bottom: "5%"}} variant="success" onClick={submitRevision} disabled={_.isEqual(reportForm, snapshots.GetSnapshot('reportForm'))}>submit</Button> : null
              }
            </Col>
          </Row>
          
        </Container>
      </Row>

    </Container>
  )
}

export default SelectUserWeek;