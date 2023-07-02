import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  Route,
  Router,
    Routes,
    useLocation,
    useNavigate
  } from "react-router-dom";
//import LoginService from "../Services/LoginService";
//import UserLogin from "../Utility/Modals/UserLogin";
import swal from "sweetalert2";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Alert, Card, Button, Navbar, NavDropdown, Nav, Modal, ModalBody, Spinner } from "react-bootstrap";
import PrimaryNav from "./Navbar/PrimaryNav";
import { useSelector } from "react-redux";
import { userSelector } from "../../State/Slices/userSlice";

function Home(props) {

    const [userForm, setUserForm] = useState({ name: "eric", password: ""});
    const [userErrorForm, setUserErrorForm] = useState({ name: "", password: ""});
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(userSelector);

    useEffect(() => {
      console.log("refresh Page")
      console.log(user)
    }, [user])

    return (
        
        <Container fluid className='border vh-100'>
            <PrimaryNav navHeight="10"/>

            <Row style={{height: "90%", backgroundColor: "white"}}>
              {/*<Col>HOME APP</Col>
              <Col> <Button onClick={() => navigate("ok")}> </Button> </Col>*/}
              <Col style={{ height: "100%"}}>
                {
                  location.pathname === "/home" ?
                    <div className="fullScreen" style={{width: "100%", height: "100%", border: "solid red", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <label>RECON</label>
                    </div>
                    :
                    <Outlet/>
                }
                
              </Col>
            </Row> 

            {/* Hit or miss. Either have this here or have it in each page individually (BAD IDEA, REPETITVE) */}
            {/* ISSUE: if i switch the pages too quickly, the loader will get stuck */}
            {/*<Modal fullscreen show={user.isLoading} style={{opacity: ".3"}}>
              <ModalBody style={{display: "flex", alignItems: "center", justifyContent: "center", opacity: "90%"}}><Spinner/></ModalBody>
            </Modal>*/}
        </Container>
    )
} 

export default Home;