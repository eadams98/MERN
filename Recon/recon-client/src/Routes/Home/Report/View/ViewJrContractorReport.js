import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button } from "react-bootstrap"
import { useSelector } from "react-redux";
import { userSelector } from "../../../../State/Slices/userSlice";
import Swal from "sweetalert2";
import useRefreshToken from "../../../../Hooks/useRefreshToken";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";
import SelectUserWeek from "./SelectUserWeek/SelectUserWeek";

const ViewJrContractorReport = () => {
  
  //variables
  const user = useSelector(userSelector)
  const refresh = useRefreshToken()
  const axios = useAxiosPersonal()
 

  // Effects
  useEffect(()=> {
    
  }, [])

  // methods

  return(
    <Container fluid style={{ backgroundColor: "yellow", height: "100%" }}>
      <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}> 
        <Col> {/* <Col className='h-75'> */}
          <SelectUserWeek userID={user.user.userID} role={user.user.role}/>
        </Col>
      </Row>
    </Container>
  )
}

export default ViewJrContractorReport