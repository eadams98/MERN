import { useState } from "react";
import {
  Link,
  Outlet,
  Route,
  Router,
    Routes,
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


    return (
        
        <Container fluid className='border vh-100'>
            <PrimaryNav navHeight="10"/>

            <Row style={{height: "90%", backgroundColor: "grey"}}>
              {/*<Col>HOME APP</Col>
              <Col> <Button onClick={() => navigate("ok")}> </Button> </Col>*/}
              <Col>
                <Outlet/>
              </Col>
            </Row> 
        </Container>
    )
} 

export default Home;