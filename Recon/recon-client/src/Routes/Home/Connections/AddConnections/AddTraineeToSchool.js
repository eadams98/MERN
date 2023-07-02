import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";
import { userSelector } from "../../../../State/Slices/userSlice";

const AddTraineeToSchool = () => {
  // Hooks
  const axios = useAxiosPersonal()
  const user = useSelector(userSelector);

  // variables
  const [form, setForm] = useState({traineeEmail: ""})
  const [error, setError] = useState(false)
  const [myStudents, setMyStudents] = useState([])

  // methods
  const updateForm = (e) => {
    const {name, value} = e.target
    setForm(oldForm => {return {...oldForm, [name]: value}})
  }

  const getAvailableStudents = async () => {
    //setLoading(true)
    try {
      const resp = await axios('/trainee/unregistered')
      console.log(resp.data)
      setMyStudents(resp.data)
    } catch (error) {
      console.log(error)
      //setError(true)
    }
  }

  const attemptToAddConnection = async () => {
    let status
    let msg
    try {
      const resp = await axios.post(`/school/${user.user.id}/add-student?sid=${form.traineeEmail}`)
      console.log(resp)
      msg = "Successfully added"
      status = 'success'
      getAvailableStudents()
      setForm({traineeEmail: ""})
    } catch (ex) {
      console.log(error)
      msg = error.response.data.errorMessage
      status = "error"
    }

    Swal.fire({
      position: 'top',
      icon: status == 'success' ? 'success' : 'error',
      timer: 2000,
      text: msg,
      showConfirmButton: false
    })
  }

  const disablebutton = () => {
    console.log("HERE")
    if (form.traineeEmail == "")
      return true
    return false
  }

  // hooks
  useEffect(() => {
    getAvailableStudents()
  }, [])

  if (error) {
    return <div style={{width: "100%"}}>ERROR</div> 
  } else {
    if (user.isLoading) return <div style={{display: "flex", alignItems: "center", justifyContent: "center", opacity: "50%"}}><div style={{width: "100%"}}><Spinner /></div></div>
    else { return (
      <Container style={{border: "solid red"}}>        
        <Row style={{border: "solid green"}}>
          <Col>Student</Col>
          <Col>
            <Form.Select name="traineeEmail" value={form.traineeEmail} onChange={updateForm}>
              <option key="">--Select One--</option>
              {
                myStudents.map((student, idx) => <option key={idx} value={student.email}>{`${student.firstName} ${student.lastName} - ${student.email}`}</option> )
              }
            </Form.Select>
          </Col>
        </Row>
        <Row style={{border: "solid green"}}><Col><Button disabled={disablebutton()} onClick={attemptToAddConnection}>Submit</Button></Col></Row>
      </Container>
    )}
  }
}

export default AddTraineeToSchool