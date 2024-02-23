import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button } from "react-bootstrap"
import { useSelector } from "react-redux";
import { userSelector } from "../../../../State/Slices/userSlice";
import Swal from "sweetalert2";
import useRefreshToken from "../../../../Hooks/useRefreshToken";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";
import SelectUserWeek from "./SelectUserWeek/SelectUserWeek";
import SelectUser from "./SelectUser/SelectUser";

const ViewJrContractorReport = () => {
  //derived state?
  const [contractorEmail, setContractorEmail] = useState("")
  const [reportWeek, setReportWeek] = useState("")
  const [loading, setLoading] = useState(false)
  
  //variables
  const user = useSelector(userSelector)
  const refresh = useRefreshToken()
  const axios = useAxiosPersonal()

  // Effects
  useEffect(()=> {
    console.log(user.user.roles[0].authority)
    const getContractor = async () => {
      try {
        const resp = await axios(`trainee/${user.user.id}/contractor`)
        console.log(resp)
        setContractorEmail(resp.data.email)
      } catch (err) {
        console.log("error")
        console.log(err)
      }
    }
    getContractor()
  }, [])

  // methods

  return(
    <Container fluid className="fullScreen">
      <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}> 
        <Col> {/* <Col className='h-75'> */}
          {
            contractorEmail ? <SelectUserWeek contractorEmail={contractorEmail} role={user.user.roles[0].authority}/> : null
          }
        </Col>
      </Row>
    </Container>
  )
}

export default ViewJrContractorReport