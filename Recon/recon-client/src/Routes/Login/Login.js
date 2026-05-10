import React from 'react';
import { useEffect, useState, useRef, useCallback } from "react";
import {
    useNavigate
  } from "react-router-dom";
import swal from "sweetalert2";

import styleTest from '../../CSS/Modules/Button.module.css';
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { attemptLogin, resetAuth, userSelector } from "../../State/Slices/userSlice";

const devLog = (...args) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

function buildInitialForm() {
  const isDev = process.env.NODE_ENV === "development";
  const devUser = process.env.REACT_APP_LOGIN_DEV_USER || "";
  const devPass = process.env.REACT_APP_LOGIN_DEV_PASS || "";
  return {
    name: isDev && devUser ? devUser : "",
    password: isDev && devPass ? devPass : "",
  };
}

function Login() {

    const initial = buildInitialForm();
    const [userForm, setUserForm] = useState(initial);
    const username = useRef(initial.name);
    const password = useRef(initial.password);
    const [userErrorForm, setUserErrorForm] = useState({ name: "", password: ""});
    const [userType, setUserType] = useState("contractor")
    const userTypeRef = useRef('contractor')
    const navigate = useNavigate();

    const user = useSelector(userSelector)
    const dispatch = useDispatch()

    const handleLogin = useCallback(async () => {
        userTypeRef.current = userType;
        dispatch(await attemptLogin(username.current, password.current, userTypeRef.current));
    }, [dispatch, userType]);

    const handleKeypress = useCallback((event) => {
        if (event.key === 'Enter') {
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

        if (name === "name" && value === "")
        {
            setUserErrorForm({name: "REQUIRED"})
        } else if (name === "name" && value !== "") {
            setUserErrorForm({name: ""})
        }
    }

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
        devLog("login role tab:", userTypeRef.current)
    }, [userType])

    useEffect(()=>{
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
        <Container fluid className='border vh-100' as="main">
            <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "10%", textAlign: "center"}}> 
                <Col className='h-100'>
                    <Container className='h-100'>
                        <Row><Col><span aria-live="polite">RECON {user.isLoading ? "Loading" : null}</span></Col></Row>
                    </Container>
                </Col>
            </Row>

            <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "80%"}}>
                <Col>
                    <Container as={Form} className='border' style={{width: "50%",  backgroundColor: "grey"}} noValidate>
                        <Row className="text-center" role="tablist" aria-label="Sign in as">
                            <Col xs={4} className="p-0">
                                <button
                                  type="button"
                                  role="tab"
                                  aria-selected={userType === "contractor"}
                                  className={ userType === "contractor" ? styleTest.loginActive : styleTest.loginInactive}
                                  style={{ width: "100%", border: "none", background: "transparent" }}
                                  onClick={() => setUserType("contractor")}
                                >
                                  Contractor
                                </button>
                            </Col>
                            <Col xs={4} className="p-0">
                                <button
                                  type="button"
                                  role="tab"
                                  aria-selected={userType === "trainee"}
                                  className={ userType === "trainee" ? styleTest.loginActive : styleTest.loginInactive}
                                  style={{ width: "100%", border: "none", background: "transparent" }}
                                  onClick={() => setUserType("trainee")}
                                >
                                  Trainee
                                </button>
                            </Col>
                            <Col xs={4} className="p-0">
                                <button
                                  type="button"
                                  role="tab"
                                  aria-selected={userType === "school"}
                                  className={ userType === "school" ? styleTest.loginActive : styleTest.loginInactive}
                                  style={{ width: "100%", border: "none", background: "transparent" }}
                                  onClick={() => setUserType("school")}
                                >
                                  School
                                </button>
                            </Col>
                        </Row>

                        <Row><Col><br/></Col></Row>

                        <Row as={Form.Group} controlId="formUserName">
                            <Col md="3">
                                <Form.Label column={false}>User:</Form.Label>
                            </Col>
                            <Col md={{span: 7, offset: 1}}>
                                <Form.Control 
                                    name = "name" 
                                    onChange = {updateForm}
                                    type="text"
                                    inputMode="text"
                                    autoComplete="username"
                                    aria-required="true"
                                    value={userForm.name} 
                                />
                            </Col>
                        </Row>

                        { userErrorForm.name ? <Row><Col md={{span: 7, offset: 4}}><Alert variant="danger" >{userErrorForm.name}</Alert></Col></Row> : null}

                        <Row><Col><br/></Col></Row>

                        <Row as={Form.Group} controlId="formUserPassword">
                            <Col as={Form.Label} md="3" column={false}>
                                Password:
                            </Col>
                            <Col md={{span: 7, offset: 1}} >
                                <Form.Control 
                                    name = "password" 
                                    onChange = {updateForm} 
                                    type="password" 
                                    autoComplete="current-password"
                                    value={userForm.password} 
                                />
                            </Col>
                        </Row>

                        <Row><Col><br/></Col></Row>

                        <Row as={Form.Group} controlId="formSubmission">
                            <Col md={{span: 2, offset: 3}}>
                                <Button type="button" variant="primary" onClick={handleLogin} disabled={user.isLoading}>
                                    Login
                                </Button>
                            </Col>
                            <Col md={{span: 2, offset: 2}}>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => {
                                    const blank = buildInitialForm();
                                    setUserForm(blank);
                                    username.current = blank.name;
                                    password.current = blank.password;
                                    setUserErrorForm({ name: "", password: "" });
                                  }}
                                >
                                    Reset
                                </Button>
                            </Col>
                        </Row>

                        <Row><Col><br/></Col></Row>

                    </Container>
                </Col>
            </Row>
            
        </Container>
    )
} 

export default Login;
