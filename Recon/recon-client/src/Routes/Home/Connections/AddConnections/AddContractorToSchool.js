import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";
import { userSelector } from "../../../../State/Slices/userSlice";

const AddContractorToSchool = () => {
  // Hooks
  const axios = useAxiosPersonal()
  const user = useSelector(userSelector);

  // variables
  const [form, setForm] = useState({contractorID: ""})
  const [error, setError] = useState(false)
  const [availableContractors, setAvailableContractors] = useState([])

  // methods
  const updateForm = (e) => {
    const {name, value} = e.target
    setForm(oldForm => {return {...oldForm, [name]: value}})
  }

  const getAvailableContractor = async () => {
    //setLoading(true)
    try {
      const resp = await axios(`/contractor/unregistered-to-school?se=${user.user.email}`)
      console.log(resp.data)
      setAvailableContractors(resp.data)
    } catch (error) {
      console.log(error)
      //setError(true)
    }
  }

  const attemptToAddConection = async () => {
    let status
    let msg
    try {
      const resp = await axios.post(`/school/${user.user.id}/add-contractor?cid=${form.contractorID}`)
      console.log(resp)
      msg = "Successfully added"
      status = 'success'
      getAvailableContractor()
      setForm({contractorID: ""})
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
    if (form.contractorID == "")
      return true
    return false
  }

  // hooks
  useEffect(() => {
    getAvailableContractor()
  }, [])

  if (error) {
    return <div style={{width: "100%"}}>ERROR</div> 
  } else {
    if (user.isLoading) return <div style={{display: "flex", alignItems: "center", justifyContent: "center", opacity: "50%"}}><div style={{width: "100%"}}><Spinner /></div></div>
    else { return (
      <Container style={{border: "solid red"}}>
          <Row style={{border: "solid black"}}>
            <Col>Contractor</Col>
            <Col>
              <Form.Select name="contractorID" value={form.contractorID} onChange={updateForm}>
                <option key="">--Select One--</option>
                {
                  availableContractors.map((contractor, idx) => <option key={idx} value={contractor.email}>{`${contractor.firstName} ${contractor.lastName} - ${contractor.email}`}</option> )
                }
              </Form.Select>
            </Col>
          </Row>
          <Row style={{border: "solid green"}}><Col><Button disabled={disablebutton()} onClick={attemptToAddConection}>Submit</Button></Col></Row>
        </Container>
    )}
  }
}

export default AddContractorToSchool