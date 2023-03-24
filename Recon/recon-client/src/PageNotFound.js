
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
  
const PageNotFound= () =>{
    const navigate = useNavigate();
    return(
            <Container fluid className="fullScreen" style={{ height: "100vh", backgroundColor: "white", border: "solid 3px", display: 'flex', alignItems: "center", justifyContent: "center"}}>
                <Container style={{border: "solid", backgroundColor: "white"}}>
                    <Row>
                        <Col><h1>404 Error</h1></Col>
                    </Row>
                    <Row>
                        <Col><h1>Page Not Found</h1></Col>
                    </Row>
                    <Row>
                        <Col><Button onClick={() => {navigate('/home') }}>back</Button></Col>
                    </Row>
                </Container>
            </Container>
    )
}
  
export default PageNotFound;