import { useState } from "react";
import {
    useNavigate
  } from "react-router-dom";
//import LoginService from "../Services/LoginService";
//import UserLogin from "../Utility/Modals/UserLogin";
import swal from "sweetalert2";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Alert, Card, Button } from "react-bootstrap";

function Home(props) {

    const [userForm, setUserForm] = useState({ name: "eric", password: ""});
    const [userErrorForm, setUserErrorForm] = useState({ name: "", password: ""});
    const navigate = useNavigate();

    return (
        
        <Container fluid className='border vh-100'>
            <Row>
              <Col>HOME APP</Col>
              <Col> <Button onClick={() => navigate("/")}> </Button> </Col>
            </Row> 
        </Container>
    )
} 

export default Home;