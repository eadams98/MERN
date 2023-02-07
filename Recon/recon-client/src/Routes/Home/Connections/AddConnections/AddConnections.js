import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal"

const AddConnections = () => {
  // Hooks
  const axios = useAxiosPersonal()

  // variables
  const [form, setForm] = useState({
    userIDToAdd: "",
    contractorID: ""
  })

  const [loading, setLoading] = useState(false)
  const [dataOne, setDataOne] = useState(true) // has to be better way
  const [dataTwo, setDataTwo] = useState(true)
  const [submitLoading, setSubmitLoading] = useState((false))

  const [error, setError] = useState(false)
  const [myStudents, setMyStudents] = useState([])
  const [availableContractors, setAvailableContractors] = useState([])

  // useEffects
  useEffect(() => {

    const getMyStudents = async () => {
      setLoading(true)
      try {
        const resp = await axios('/get-my-jr-contractors')
        console.log(resp.data)
        setMyStudents(resp.data)
        setDataOne(true)
        //snapshots.SetSnapshot('profileForm', profileForm)
      } catch (error) {
        console.log(error)
        setError(true)
      }
    }

    const getAvailableContractor = async () => {
      //setLoading(true)
      try {
        /*const resp = await setTimeout(() => {
          setAvailableContractors([
            {
              "userID": "CONTRACTOR-001",
              "name": "Contractor 1",
              "email": "contractor.1@yahoo.com"
            }
          ])
          setDataTwo(true)
        }, 10000)*/
        const resp = await axios('/get-all-contractors')
        console.log(resp.data)
        setAvailableContractors(resp.data)
        setDataTwo(true)
        //snapshots.SetSnapshot('profileForm', profileForm)
      } catch (error) {
        console.log(error)
        setError(true)
      }
    }

    getMyStudents()
    getAvailableContractor()
  }, [])

  useEffect(() => {
    if (dataOne && dataTwo)
      setLoading(false)
  }, [dataOne, dataTwo])
  //http://localhost:4001/get-my-jr-contractors

  // methods
  const updateForm = (e) => {
    const {name, value} = e.target
    setForm(oldForm => {return {...oldForm, [name]: value}})
  }

  const attemptToAddConnection = async () => {
    setSubmitLoading(true)
    
    let status
    let msg
    try {
      const resp = await axios.post('/add-connection-to-self', form)
      console.log(resp)
      msg = "Successfully added"
      status = 'success'
    } catch (error) {
      console.log(error)
      msg = error.response.data.message
      status = "error"
    }

    Swal.fire({
      position: 'top',
      icon: status == 'success' ? 'success' : 'error',
      timer: 2000,
      text: msg,
      showConfirmButton: false
    })
    /*setTimeout(() => {
      setSubmitLoading(false)
    }, 5000)*/
    setSubmitLoading(false)
    
  }

  if (error) {
    return <div style={{width: "100%"}}>ERROR</div> 
  } else {
    if (loading) return <div style={{width: "100%"}}><Spinner /></div>
    else { return (
      <> 
        { 
          submitLoading ?
            <Container style={{position: "absolute", opacity: "40%", height: "79%"}}>
              <Row style={{width: "97%", height: "100%", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center"}}><Spinner/></Row>
            </Container>
            : 
            null
        }
        <Container style={{border: "solid red"}}>
          
          {/*<Row style={{border: "solid green"}}><Col>{tab}</Col><Col><select/></Col></Row>*/}
          <Row style={{border: "solid green"}}>
            <Col>Student</Col>
            <Col>
              <Form.Select name="userIDToAdd" value={form.userIDToAdd} onChange={updateForm}>
                <option key="">--Select One--</option>
                {
                  myStudents.map((student, idx) => <option key={idx} value={student.userID}>{`${student.name} - ${student.email}`}</option> )
                }
              </Form.Select>
            </Col>
          </Row>
          <Row style={{border: "solid black"}}>
            <Col>Contractor</Col>
            <Col>
              <Form.Select name="contractorID" value={form.contractorID} onChange={updateForm}>
                <option key="">--Select One--</option>
                {
                  availableContractors.map((contractor, idx) => <option key={idx} value={contractor.userID}>{`${contractor.name} - ${contractor.email}`}</option> )
                }
              </Form.Select>
            </Col>
          </Row>
          <Row style={{border: "solid green"}}><Col><Button onClick={attemptToAddConnection}>Submit</Button></Col></Row>
        </Container>
      </>
    )}
  }

}

export default AddConnections