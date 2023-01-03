import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button } from "react-bootstrap"
import { useSelector } from "react-redux";
import { userSelector } from "../../../../State/Slices/userSlice";
import Swal from "sweetalert2";
import useRefreshToken from "../../../../Hooks/useRefreshToken";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";

const ViewJrContractorReport = () => {
  
  //variables
  const user = useSelector(userSelector)
  const refresh = useRefreshToken()
  const axios = useAxiosPersonal()

  const [reportForm, setReportForm] = useState({
    grade: "",
    week: {
      start: "",
      end: ""
    },
    description: ""
  })
  const [validForm, setValidForm] = useState(false);
  const [inRefute, setInRefute] = useState(false)

  // Effects
  useEffect(()=> {
    
  }, [])

  // methods

  return(
    <Container fluid style={{ backgroundColor: "yellow", height: "100%" }}>
      <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}> 
        <Col> {/* <Col className='h-75'> */}
          <Container fluid style={{ backgroundColor: "grey", height: "75vh" }}>

            {/* Row 1 */}
            <Row style={{ height: "10%", border: "solid" }}>
                <Col md={{span: 4, offset: 4}} style={{ display: "flex" }}>
                  <Form.Select 
                    style={{ margin: "auto", textAlign: "center" }} 
                  >
                    <option value="">Week 1</option>
                    <option value="">Week 2</option>
                    <option value="">Week 3</option>
                    <option value="" hidden selected>--select a week---</option>
                  </Form.Select>
                </Col>
            </Row>

            {/* Row 2 */}
            <Row style={{ height: "90%", border: "solid", display: "flex"}}>
              <Container fluid style={{ backgroundColor: "white", height: "90%", margin: "auto" }}>
                <div style={{height: "10%", border: "solid"}}>
                  <Row>
                    <Col>Grade</Col>
                  </Row>
                  <Row>
                    <Col>A</Col>
                  </Row>
                </div>

                <div style={{height: "40%", border: "solid"}}>
                  <Row >
                    <Col>Description</Col>
                  </Row>
                  <Row>
                    <Col>good</Col>
                  </Row>
                </div>

                <div style={{height: "40%", border: "solid"}}>
                  <Row style={{height: "20%", border: "solid"}}><Col>Revisions</Col></Row>
                  <Row style={{height: "80%", border: "solid green"}}>
                    <Col>
                      {
                        inRefute ?
                          <textarea
                            name="description"
                            type="textarea"
                            style={{ width: "100%", height: "100%", resize: "none"}}                   
                          />
                          :
                          null
                      }
                    </Col>
                  </Row>
                </div>

                <Row style={{height: "10%", border: "solid"}}>
                  <Col md={{span: 4, offset: 1}} style={{position: "relative"}}>
                    {
                      inRefute ?
                        <Button style={{position: "absolute", left: "38.5%", bottom: "5%"}} onClick={()=> setInRefute(false)} variant="danger">Cancel</Button>
                        :
                        <Button style={{position: "absolute", left: "38.5%", bottom: "5%"}} onClick={()=> setInRefute(true)}>Refute</Button> 
                    }
                  </Col>
                  <Col md={{span: 4, offset: 2}} style={{position: "relative"}}>
                    {
                      inRefute ? <Button style={{position: "absolute", left: "38.5%", bottom: "5%"}} variant="success">submit</Button> : null
                    }
                  </Col>
                </Row>
                
              </Container>
            </Row>

          </Container>
        </Col>
      </Row>
    </Container>
  )
}

export default ViewJrContractorReport