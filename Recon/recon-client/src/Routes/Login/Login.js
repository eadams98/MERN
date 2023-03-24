import { useEffect, useState } from "react";
import {
    useNavigate
  } from "react-router-dom";
//import LoginService from "../Services/LoginService";
//import UserLogin from "../Utility/Modals/UserLogin";
import swal from "sweetalert2";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Alert, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { attemptLogin, attemptLoginAsync, resetAuth, userSelector } from "../../State/Slices/userSlice";

const fakeData = {
    Eric: "Adams"
}


function Login(props) {

    const [userForm, setUserForm] = useState({ name: "eric", password: ""});
    const [userErrorForm, setUserErrorForm] = useState({ name: "", password: ""});
    const navigate = useNavigate();

    //const [user, setUser] = useState(props.user);
    const user = useSelector(userSelector)

    const handleLogin = async () => {
        //console.log(user)
        dispatch(await attemptLogin(userForm.name, userForm.password))
        //console.log(user)
        /*if (user.user) {
            navigate("/home")
        } else { console.log("false") }
        console.log("KING")*/
    }
    const handleLogout = () => null;
    const dispatch = useDispatch()

    function updateForm(e) {
        let name = e.target.name;
        let value = e.target.value;
        setUserForm({...userForm, [name]: value})

        if (name === "name" && value == "")
        {
            setUserErrorForm({name: "REQUIRED"})
        } else if (name === "name" && value != "") {
            setUserErrorForm({name: ""})
        }
    }

    useEffect(()=>{
        if (user.user) {
            navigate("/home")
        } else {
            dispatch(resetAuth())
        }
    }, []);
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

    {/*style={{display:'flex', alignItems: "center", justifyContent: "center"}}*/}
    return (
        
        <Container fluid className='border vh-100'>
            <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "10%", textAlign: "center"}}> 
                <Col className='h-100'>
                    <Container className='h-100'>
                        <Row><Col>RECON {user.error ? user.error : null} {user.isLoading ? "Loading" : null}</Col></Row>
                        {user ? (
        <button onClick={handleLogout}>Sign Out</button>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
                    </Container>
                </Col>
            </Row>

            <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "80%"}}>
                <Col>
                    <Container as={Form} className='border' style={{width: "50%",  backgroundColor: "grey"}}>

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
                            <Col as={Button} md={{span: 2, offset: 3}} onClick={handleLogin}> Login </Col>
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