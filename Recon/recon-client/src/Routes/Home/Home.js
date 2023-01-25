import { useState } from "react";
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
import { Container, Row, Col, Form, Alert, Card, Button, Navbar, NavDropdown, Nav } from "react-bootstrap";
import PrimaryNav from "./Navbar/PrimaryNav";

function Home(props) {

    const [userForm, setUserForm] = useState({ name: "eric", password: ""});
    const [userErrorForm, setUserErrorForm] = useState({ name: "", password: ""});
    const navigate = useNavigate();
    const location = useLocation();

    return (
        
        <Container fluid className='border vh-100'>
            <PrimaryNav navHeight="10"/>

            <Row style={{height: "90%", backgroundColor: "grey"}}>
              {/*<Col>HOME APP</Col>
              <Col> <Button onClick={() => navigate("ok")}> </Button> </Col>*/}
              <Col style={{ height: "100%"}}>
                {
                  location.pathname === "/home" ?
                    <div style={{width: "100%", height: "100%", border: "solid red", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <label>RECON</label>
                    </div>
                    :
                    <Outlet/>
                }
                
              </Col>
            </Row> 
        </Container>
    )
} 

export default Home;