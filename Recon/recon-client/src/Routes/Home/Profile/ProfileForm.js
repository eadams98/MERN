import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Modal, OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap"
import { useSelector } from "react-redux"
import useAxiosPersonal from "../../../Hooks/useAxiosPersonal"
import useSnapshots from "../../../Hooks/useSnapshots"
import { userSelector } from "../../../State/Slices/userSlice"
import defaultProfilePicture from '../../../Default-Profile-Picture.jpeg';
import Swal from "sweetalert2"
import ProfileUploadModal from "./ProfileUploadModal"

const ProfileForm = () => {
  // Hooks
  const axios = useAxiosPersonal()
  const snapshots = useSnapshots()
  const user = useSelector(userSelector)

  // Variables
  const [loading, setLoading] = useState(true)
  const [profileForm, setProfileForm] = useState({
    name: {
      first: "",
      last: ""
    },
    email: "",
    role: "",
    connections: []
  })
  const [edit, setEdit] = useState(false)
  const [profileModal, setProfileModal] = useState(false)

  // Effects
  useEffect(() => {
    const getProfileDetails = async () => {
      setLoading(true)
      try {
        //console.log(`role = ${user.user.roles[0].authority}`)
        const role = user.user.roles[0].authority
        const id = user.user.id
        const resp = await axios(`${role}/${id}`)
        const { firstName, lastName, trainees, email } = resp.data
        const profileForm = {
          name: {
            first: firstName,
            last: lastName
          },
          email: email,
          role: role,
          connections: trainees
        }
  
        setProfileForm(profileForm)
        snapshots.SetSnapshot('profileForm', profileForm)
        console.log(`data = ${resp.data}`)
        console.log(resp)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    getProfileDetails()
  }, [])

  useEffect(() => {
    if (!edit && !snapshots.Validate(profileForm, 'profileForm')) {
      setProfileForm(snapshots.GetSnapshot('profileForm'))
      console.log("snapshot reset")
    }
  }, [edit])

  // Methods
  const updateProfileForm = (e) => {
    const { name, value } = e.target
    if (name === 'first' || name === 'last') {
      setProfileForm({
        ...profileForm,
        name: {
          ...profileForm.name,
          [name]: value
        }
      })
    } else {
      setProfileForm({
        ...profileForm,
        [name]: value
      })
    }
    
  }

  const toggleEdit = () => {
    setEdit(prev => {return !prev})
    const snapshot = snapshots.GetSnapshot('profileForm')
  }

  const submitProfileForm = async () => {
    let message, status
    try {
      const resp = await axios.put('/update-profile', profileForm)
      console.log(resp)
      message = resp.data.data
      status = resp.data.status
    } catch (error) {
      console.log(error)
      message = error.response.data.message
      status = error.response.data.status
    }

    Swal.fire({
      position: 'top',
      icon: status === 'success' ? 'success' : 'error',
      timer: 2000,
      text: message,
    })
    
  }

  const closeModal = () => {
    setProfileModal(false)
  }

  if(loading) { return <div style={{width: "100%"}}><Spinner /></div>}
  else {return (
    <> 
      <ProfileUploadModal closeModal={closeModal} showProfileModal={profileModal}/>

      <Container fluid style={{ height: "80%", backgroundColor: "grey"}}>
        <Row style={{ height: "50%", border: "solid red"}}>
          {/* left half. Picture */}
          <Col style={{height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Card style={{ height: "80%", width: "80%"}}>
              <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Click to upload photo</Tooltip>}
                >
                  <Card.Img 
                    onClick={() => {setProfileModal(true); console.log(profileModal)}}
                    style={{ width: "100%", height: "100%"}}
                    src={ user?.user?.profilePicture ? user.user.profilePicture : defaultProfilePicture}
                  />
                </OverlayTrigger>
            </Card>
          </Col>
          
          {/* right half. form fields */}
          <Col>
            <Container fluid style={{ height: "100%", border: "solid red"}}>
              <Row style={{ height: "33.4%", border: "solid green"}}>
                <Col>First: <Form.Control name='first' onChange={updateProfileForm} disabled={!edit} value={profileForm?.name.first} style={{ textAlign: "center" }} /> </Col>
                <Col>Last: <Form.Control name='last' onChange={updateProfileForm} disabled={!edit} value={profileForm?.name.last} style={{ textAlign: "center" }} /> </Col>
              </Row>

              <Row style={{ height: "33.3%", border: "solid green"}}>
                <Col>Email: <Form.Control name='email' onChange={updateProfileForm} disabled={!edit} value={profileForm?.email} style={{ textAlign: "center" }} /> </Col>
              </Row>
              
              <Row style={{ height: "33.3%", border: "solid green"}}>
                <Col>Role: <b>{profileForm?.role}</b> </Col>
              </Row>
            </Container>
          </Col>
        </Row>

        <Row style={{ height: "50%", border: "solid blue"}}>
          <Col>
            <Container fluid style={{ height: "100%", border: "solid red"}}>
              <Row style={{height: "10%", border: "solid"}}><Col></Col></Row>
              <Row style={{height: "70%", border: "solid"}}>
                <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Table striped bordered hover style={{backgroundColor: "white", height: "90%", width: "100%"}}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>School</th>
                        <th>Average Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        profileForm?.connections?.map((connection, idx) => {
                          return (
                            <tr key={idx}> 
                              <td>{idx}</td>
                              <td>{connection.name}</td>
                              <td>{connection.email}</td>
                              <td>{connection.school}</td>
                              <td>{connection.avgGrade}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row style={{height: "20%", display: "flex", alignItems: "center"}}>
                {
                  !edit ? <Col md={{span: 3, offset: 1}} > <Button onClick={toggleEdit} style={{ width: "100%"}}>EDIT</Button> </Col> : null
                }
                {
                  edit ? 
                  <>
                    <Col md={{span: 3, offset: 1}} > <Button onClick={toggleEdit} variant="warning" style={{ width: "100%"}}>CANCEL</Button> </Col>
                    <Col md={{span: 3, offset: 4}} > <Button onClick={submitProfileForm} disabled={snapshots.Validate(profileForm, 'profileForm')} variant="success" style={{ width: "100%"}}>Submit</Button> </Col>
                  </> : null
                }
                
              </Row>
            </Container>
          </Col>
        </Row>
        
      </Container>
    </>
  )}
}

export default ProfileForm