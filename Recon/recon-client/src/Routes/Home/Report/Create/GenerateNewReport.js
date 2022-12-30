import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button } from "react-bootstrap"
import ReportService from "../../../../Services/Report";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../State/Slices/userSlice";
import Swal from "sweetalert2";

const GenerateReport = () => {
  /*onst reportSchema = new mongoose.Schema({
    grade: {
      type: String,
      required: [true, 'grade is mandatory']
    },
    submissionDate: {
      type: Date,
      required: [true, 'submission date is mandatory']
    },
    forWeek: {
      start: {
        type: Date,
        required: [true, 'start date is mandatory']
      },
      end: {
        type: Date,
        required: [true, 'end date is mandatory']
      }
    },
    description: {
      type: String,
    },
    user: {
      type: String,
      required: [true, 'submission must be linked to a user']
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  })*/

  //variables
  const user = useSelector(userSelector)
  const [reportForm, setReportForm] = useState({
    grade: "",
    week: {
      start: "",
      end: ""
    },
    description: ""
  })
  const [validForm, setValidForm] = useState(false);

  // Effects
  useEffect(()=> {
    if (reportForm.description && reportForm.grade && reportForm.week.start && reportForm.week.end)
      setValidForm(true)
    else
      setValidForm(false)
  }, [reportForm])

  // methods
  let updateReportForm = (e) => {
    const { name, value } = e.target;
    if (name == "week") {
      parseDates(value)
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
      user: user.user.ID,
    }
    let data, status;

    try {
      const response = await ReportService.createReport(sendForm);
      data = response.data.data
      status = 'success'
    } catch (error) {
      data = error.response.data.message
      status = 'fail'
    }

    Swal.fire({
      position: 'top',
      icon: status == 'success' ? 'success' : 'error',
      timer: 2000,
      text: data,
    })
  }

  return(
    <Container fluid style={{ backgroundColor: "yellow", height: "100%" }}>
      <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}> 
        <Col className='h-75'>
            <Form as={Container} fluid style={{ backgroundColor: "blue", height: "75vh", overflow: "auto", position: "relative" }}>
              <Form.Group className="mb-3" controlId="reportFormDate">
                <Row>
                  <Col md={4} style={{textAlign:"right"}}><Form.Label>{`Week:`}</Form.Label></Col>
                  <Col style={{textAlign:"left"}}><Form.Label>{`${reportForm.week.start}${reportForm.week?.start ? ' - ' : ''}${reportForm.week.end}`}</Form.Label></Col>
                </Row>
                <Form.Control name="week" type="week" onChange={updateReportForm}/>
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
                <Row><Col><textarea
                  name="description"
                  type="textarea"
                  style={{ width: "100%", height: "200px", resize: "none"}}
                  value={reportForm.description} 
                  onChange={updateReportForm}
                  
                /></Col></Row>
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
                    reset
                  </Form.Control>
                </Col>
                </Row>
              </Form.Group>
            </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default GenerateReport