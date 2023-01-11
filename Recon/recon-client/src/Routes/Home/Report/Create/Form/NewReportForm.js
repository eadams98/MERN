import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button, Spinner, FormLabel } from "react-bootstrap"
import Swal from "sweetalert2";
import useAxiosPersonal from "../../../../../Hooks/useAxiosPersonal";

const NewReportForm = ({ userID, resetUserID }) => {

  //hooks
  const axios = useAxiosPersonal()

  // variables
  const [loading, setLoading] = useState(false)
  const [reportForm, setReportForm] = useState({
    grade: "",
    week: {
      start: "",
      end: ""
    },
    description: ""
  })
  const [weekly, setWeekly] = useState("")
  const [validForm, setValidForm] = useState(false);

  // methods
  let updateReportForm = (e) => {
    const { name, value } = e.target;
    if (name == "week") {
      parseDates(value)
      setWeekly(value)
    } else {
      
      setReportForm({
        ...reportForm,
        [name]: value
      })
    }
    console.log(reportForm)
  }

  let resetReportForm = (e) => {
    setReportForm({
      grade: "",
      week: {
        start: "",
        end: ""
      },
      description: ""
    })
    setWeekly("")
  }

  let parseDates = (inp) => {
    console.log(inp)
    if (!inp) {
      setReportForm({
        ...reportForm,
        week: {
          start: "",
          end: ""
        }
      })
      //setWeekRange("")
      return
    }
    let year = parseInt(inp.slice(0,4), 10);
    let week = parseInt(inp.slice(6), 10);
  
    let day = (1 + (week - 1) * 7); // 1st of January + 7 days for each week
  
    let dayOffset = new Date(year, 0, 1).getDay(); // we need to know at what day of the week the year start
  
    dayOffset--;  // depending on what day you want the week to start increment or decrement this value. This should make the week start on a monday
  
    let days = [];
    for (let i = 0; i < 7; i++) // do this 7 times, once for every day
      days.push(new Date(year, 0, day - dayOffset + i)); // add a new Date object to the array with an offset of i days relative to the first day of the week
    console.log(`${days[0].toDateString()} - ${days[days.length-1].toDateString()}`)
    //setWeekRange(`${days[0].toDateString()} - ${days[days.length-1].toDateString()}`)
    setReportForm({
      ...reportForm,
      week: {
        start: days[0].toDateString(),
        end: days[days.length-1].toDateString()
      }
    })
    return days;
  }

  let submitForm = async () => {
    const sendForm = {
      ...reportForm,
      user: userID
    }
    let data, status;
    

    try {
      const response = await axios.post('/create-report', sendForm); //await ReportService.createReport(sendForm, refresh);
      data = response.data.data
      status = 'success'
    } catch (error) {
      console.log(error)
      ///data = error.response.data.message
      status = 'fail'
    }
    //const response = axios.post('http://localhost:4001/create-report', sendForm); //await ReportService.createReport(sendForm, refresh);


    Swal.fire({
      position: 'top',
      icon: status == 'success' ? 'success' : 'error',
      timer: 2000,
      text: data,
    })
  }

  // Effects
  useEffect(()=> {
    if (reportForm.description && reportForm.grade && reportForm.week.start && reportForm.week.end)
      setValidForm(true)
    else
      setValidForm(false)
  }, [reportForm])

  if (loading) return <Spinner /> 
  else { return (
    <Form as={Container} fluid style={{ backgroundColor: "blue", height: "75vh", overflow: "auto", position: "relative" }}>
      <Form.Group className="mb-3" controlId="reportFormDate">
        <Row>
          <Col md={1} style={{ display: "flex" }}>
            <FormLabel onClick={resetUserID} style={{ margin: "auto", textAlign: "center", cursor: "pointer" }}>{`< USERS`}</FormLabel>
          </Col>
          <Col md={3} style={{textAlign:"right"}}><Form.Label>{`Week:`}</Form.Label></Col>
          <Col style={{textAlign:"left"}}><Form.Label>{`${reportForm.week.start}${reportForm.week?.start ? ' - ' : ''}${reportForm.week.end}`}</Form.Label></Col>
        </Row>
        <Form.Control name="week" type="week" onChange={updateReportForm} value={weekly}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="reportGrade">
        <Form.Label>Grade</Form.Label>
        <Form.Select
          name="grade"
          value={reportForm.grade} 
          onChange={updateReportForm}
        >
          <option value="" hidden>--Select a grade--</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="B-">B-</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="C-">C-</option>
          <option value="D+">D+</option>
          <option value="D">D</option>
          <option value="D-">D-</option>
          <option value="F+">F+</option>
          <option value="F">F</option>
          <option value="F-">F-</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="reportDescription">
        <Row><Col><Form.Label as={Col}>Description</Form.Label></Col></Row>
        <Row>
          <Col>
            <textarea
              name="description"
              type="textarea"
              style={{ width: "100%", height: "200px", resize: "none"}}
              value={reportForm.description} 
              onChange={updateReportForm}
            />
          </Col>
        </Row>
        <Form.Label as={Col} style={{textAlign: "right"}}> {`${reportForm.description.length} / 250`} </Form.Label>
        {/*<Form.Control
          name="description"
          type="textarea"
          
          value={reportForm.description} 
          onChange={updateReportForm}
        />*/}
      </Form.Group>

      <Form.Group style={{position: "absolute", bottom: "0"}}>
        <Row>
          <Col>
            <Form.Control as={Button} onClick={submitForm} disabled={!validForm} >
              Submit
            </Form.Control>
          </Col>
          <Col>
            <Form.Control as={Button} onClick={resetReportForm} disabled={!reportForm.description && !reportForm.grade && !reportForm.week.start && !reportForm.week.end} >
              Reset
            </Form.Control>
          </Col>
        </Row>
      </Form.Group>
    </Form>)
  }
}

export default NewReportForm