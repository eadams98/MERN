import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal"
import { userSelector } from "../../../../State/Slices/userSlice"
import ExcelLikeTable from "../../../../Utilities/ExcelLikeTable"

const CurrentConnections = () => {
  // Hooks
  const axios = useAxiosPersonal()
  const user = useSelector(userSelector);

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
        const resp = await axios(`/school/${user.user.id}/students`)
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
        <Container style={{border: "solid red", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Row style={{height: "90%", width: "100%", border: "solid yellow"}}>
            <ExcelLikeTable tableName="current connections" />
          </Row>
        </Container>
      </>
    )}

  }
  
}

export default CurrentConnections;