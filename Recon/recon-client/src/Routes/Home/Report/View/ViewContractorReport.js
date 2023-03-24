import { Suspense, lazy, useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button, FormLabel, Spinner } from "react-bootstrap"
import { useSelector } from "react-redux";
import { userSelector } from "../../../../State/Slices/userSlice";
import Swal from "sweetalert2";
import useRefreshToken from "../../../../Hooks/useRefreshToken";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";
import SelectUser from "./SelectUser/SelectUser";
import SelectUserWeek from "./SelectUserWeek/SelectUserWeek";
//const SelectUser = lazy(() => import("./SelectUser/SelectUser"))

// Styles
import pageStyles from '../../../../CSS/Modules/Page.module.css'

const ViewContractorReport = () => {
  
  //variables
  const user = useSelector(userSelector)
  const refresh = useRefreshToken()
  const axios = useAxiosPersonal()


  //derived state?
  const [userID, setUserID] = useState("")
  const [reportWeek, setReportWeek] = useState("")
  const [loading, setLoading] = useState(false)

  // props to children
  const setUserIDInParent = (userID) => { setUserID(userID) }
  const setReportWeekInParent = (userID) => { setReportWeek(userID) }
  const setIsLoadingInParent = (bool) => { setLoading(bool) }

  // Effects

  // methods

  return(
    <Container fluid className="fullScreen">
      <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}> 
        <Col> {/* <Col className='h-75'> */}
        
          { 
            !userID ? <SelectUser setUserIDInParent={setUserIDInParent} setIsLoadingInParent={setIsLoadingInParent} axiosURL="get-my-users-with-reports"/> : null
          }

          { 
            userID ? <SelectUserWeek userID={userID} setReportWeekInParent={setReportWeekInParent} resetParent={() => {setUserID(""); setReportWeek("");}} role={user.user.role}/> : null
          }

        </Col>
      </Row>
    </Container>
  )
}

export default ViewContractorReport