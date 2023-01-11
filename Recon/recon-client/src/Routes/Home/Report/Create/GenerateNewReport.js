import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button } from "react-bootstrap"
import ReportService from "../../../../Services/Report";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../State/Slices/userSlice";
import Swal from "sweetalert2";
import useRefreshToken from "../../../../Hooks/useRefreshToken";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";
import SelectUser from "../View/SelectUser/SelectUser";
import NewReportForm from "./Form/NewReportForm";

const GenerateReport = () => {
  
  //variables
  const user = useSelector(userSelector)
  const refresh = useRefreshToken()
  const axios = useAxiosPersonal()

  
  const [userID, setUserID] = useState("")

  // methods
  const setUserIDInParent = (userID) => { setUserID(userID); console.log(userID) }

  return(
    <Container fluid style={{ backgroundColor: "yellow", height: "100%" }}>
      <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}> 
        <Col>{/*<Col className='h-75'>*/}
          { 
            !userID ? <SelectUser setUserIDInParent={setUserIDInParent} axiosURL="get-my-jr-contractors"/> : null
          }
          {
            userID ? <NewReportForm userID={userID} resetUserID={() => setUserID("")}/> : null
          }
            
        </Col>
      </Row>
    </Container>
  )
}

export default GenerateReport