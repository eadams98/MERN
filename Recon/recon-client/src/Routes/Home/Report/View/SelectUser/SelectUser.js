import { useEffect, useState } from "react";
import { Col, Container, Form, FormGroup, Row, Button, FormLabel, Spinner } from "react-bootstrap"
import useAxiosPersonal from "../../../../../Hooks/useAxiosPersonal";

const SelectUser = ({setUserIDInParent, setIsLoadingInParent}) => {

  const [myUsers, setMyUsers] = useState([])
  const axios = useAxiosPersonal()
  const [loading, setLoading] = useState(false)

  useEffect(()=> {
    const getMyUsers = async () => {
      setLoading(true)
      const response = await axios.get("get-my-users")
      console.log(response)
      setMyUsers(response.data)
      setLoading(false)
    }
      
      /*setTimeout(()=>{getMyUsers()
        .catch(console.error)}, 10000)*/
        getMyUsers()
  }, [])

  useEffect(()=> {
    console.log(loading)
  }, [loading])
  
    if(loading) return<Spinner /> 
    else {
      return (
      <Container fluid style={{ backgroundColor: "grey", height: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{height: "50%", border: "solid red"}}>
          <Row><Col>User</Col></Row>
          <Row>
            <Col>
              <Form.Select style={{ margin: "auto", textAlign: "center" }} onChange={(e) => setUserIDInParent(e.target.value)} >
                <option value="" hidden>{myUsers.length > 0 ? '--select a user---' : 'No users'}</option>
                {myUsers.map((userObj, index) => { return <option key={index} value={userObj.userID}>{userObj.name}</option> })}
              </Form.Select>
            </Col>
          </Row>
        </div>
      </Container>
      )
    }
    
  
} 

export default SelectUser