import { useEffect, useState, useRef, useCallback } from "react";
import {
    useNavigate
  } from "react-router-dom";
//import LoginService from "../Services/LoginService";
//import UserLogin from "../Utility/Modals/UserLogin";
import swal from "sweetalert2";

import 'bootstrap/dist/css/bootstrap.min.css';
import styleTest from '../../CSS/Modules/Button.module.css';
import { Container, Row, Col, Form, Alert, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { attemptLogin, attemptLoginAsync, resetAuth, userSelector } from "../../State/Slices/userSlice";


function Login(props) {

    // Variables
    const [userForm, setUserForm] = useState({ name: "eric", password: ""});
    const username = useRef("");
    const password = useRef("");
    const [userErrorForm, setUserErrorForm] = useState({ name: "", password: ""});
    const [userType, setUserType] = useState("contractor")
    const userTypeRef = useRef('contractor')
    const navigate = useNavigate();
    //const [user, setUser] = useState(props.user);

    // Hooks
    const user = useSelector(userSelector)
    const dispatch = useDispatch()

    // Methods
    const handleLogin = useCallback(async () => {
        userTypeRef.current = userType;
        dispatch(await attemptLogin(username.current, password.current, userTypeRef.current));
    }, [dispatch, userType]);

    const handleLogout = () => null;
    const handleKeypress = useCallback((event) => {
        console.log(userForm)
        console.log("key press")
        if (event.key === 'Enter') {
            console.log("Enter key presssed")
            console.log(`user: ${username.current}, pass: ${password.current}`)
            handleLogin()
        }
    }, [handleLogin])

    function updateForm(e) {
        let name = e.target.name;
        let value = e.target.value;
        setUserForm({...userForm, [name]: value})

        if (name === "name")
            username.current = value;
        else
            password.current = value;

        if (name === "name" && value == "")
        {
            setUserErrorForm({name: "REQUIRED"})
        } else if (name === "name" && value != "") {
            setUserErrorForm({name: ""})
        }
    }

    // Effects 
    useEffect(()=>{
        window.addEventListener("keydown", handleKeypress);
        if (user.user) {
            navigate("/home")
        } else {
            dispatch(resetAuth())
        }
        return () => window.removeEventListener("keydown", handleKeypress)
    }, [handleKeypress]);

    useEffect(()=> {
        userTypeRef.current = userType;
        console.log(userTypeRef.current)
    }, [userType])

    useEffect(()=>{
        console.log("user updated")
        console.log(user)
        if(user.user) {
            navigate("/home")
        }
        else if (!user.isLoading && user.error) {
            swal.fire({
                position: 'top',
                icon: 'error',
                title: user.error,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }, [user]);

    return (
        
        <Container fluid className='border vh-100'>
            <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "10%", textAlign: "center"}}> 
                <Col className='h-100'>
                    <Container className='h-100'>
                        <Row><Col>RECON {userType} {userTypeRef.current} {user.error ? user.error : null} {user.isLoading ? "Loading" : null}</Col></Row>
                    </Container>
                </Col>
            </Row>

            <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "80%"}}>
                <Col>
                    <Container as={Form} className='border' style={{width: "50%",  backgroundColor: "grey"}}>
                        <Row>
                            <Col onClick={() => setUserType("contractor")} className={ userType == "contractor" ? styleTest.loginActive : styleTest.loginInactive}>Contractor</Col>
                            <Col onClick={() => setUserType("trainee")} className={ userType == "trainee" ? styleTest.loginActive : styleTest.loginInactive} >Trainee</Col>
                            <Col onClick={() => setUserType("school")} className={ userType == "school" ? styleTest.loginActive : styleTest.loginInactive} >School</Col>
                        </Row>

                        <Row><Col><br/></Col></Row>

                        <Row as={Form.Group} controlId="formUserName">
                            <Col md="3">
                                <Form.Label>User:</Form.Label>
                            </Col>
                            <Col md={{span: 7, offset: 1}}>
                                <Form.Control 
                                    name = "name" 
                                    onChange = {updateForm}
                                    type="input" 
                                    value={userForm.name} 
                                />
                            </Col>
                        </Row>

                        { userErrorForm.name ? <Row><Col md={{span: 7, offset: 4}}><Alert variant="danger" >{userErrorForm.name}</Alert></Col></Row> : null}

                        <Row><Col><br/></Col></Row>

                        <Row as={Form.Group} controlId="formUserPassword">
                            <Col as={Form.Label} md="3">
                                <Form.Label> Password: </Form.Label>
                            </Col>
                            <Col md={{span: 7, offset: 1}} >
                                <Form.Control 
                                    name = "password" 
                                    onChange = {updateForm} 
                                    type="password" 
                                    value={userForm.password} 
                                />
                            </Col>
                        </Row>

                        <Row><Col><br/></Col></Row>

                        <Row as={Form.Group} controlId="formSubmission">
                            <Col as={Button} md={{span: 2, offset: 3}} onClick={handleLogin} onKeyDown={() => console.log("KEY PRESS")}> Login </Col>
                            <Col as={Button} md={{span: 2, offset: 2}}> Reset </Col>
                        </Row>

                        <Row><Col><br/></Col></Row>

                    </Container>
                </Col>
            </Row>
            
        </Container>
    )
} 

export default Login;