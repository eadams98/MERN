import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Modal, OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import useAxiosPersonal from "../../../Hooks/useAxiosPersonal"
import useSnapshots from "../../../Hooks/useSnapshots"
import { setLoadingComplete, setLoadingInProgress, userSelector } from "../../../State/Slices/userSlice"
import defaultProfilePicture from '../../../Default-Profile-Picture.jpeg';
import Swal from "sweetalert2"
import ProfileUploadModal from "./ProfileUploadModal"

const ProfileForm = () => {
  // Hooks
  const axios = useAxiosPersonal()
  const snapshots = useSnapshots()
  const user = useSelector(userSelector)
  const dispatch = useDispatch();

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
  const [profilePicURL, setProfilePicURL] = useState({imageSrc: "", imageHash: Math.random()})

  // Effects
  
  useEffect(() => {
    const role = user.user.roles[0].authority
    const id = user.user.id
    const getSchoolStudents = async () => {
      setLoading(true)
      try {
        const resp = await axios(`/school/${id}/students`)
        console.log(resp.data)
        setProfileForm(prevState => {
          return {
          ...prevState,
          connections: resp.data
         }
      })
        //setDataOne(true)
        //snapshots.SetSnapshot('profileForm', profileForm)
      } catch (error) {
        console.log(error)
        //setError(true)
      }
    }
    const getProfileDetails = async () => {
      setLoading(true)
      try {
        //console.log(`role = ${user.user.roles[0].authority}`)
        const resp = await axios(`${role}/${id}`)
        const { firstName, lastName, trainees, email, schoolName } = resp.data
        let profileForm
        switch (role) {
          case "school":
            profileForm = {
              name: schoolName,
              email: email,
              role: role,
            }
            break;
          default:
            profileForm = {
              name: {
                first: firstName,
                last: lastName
              },
              email: email,
              role: role,
              connections: trainees
            }
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
    const getProfilePictureURL = async () => {
      try {
        const resp = await axios(`/bucket/picture`)
        //const encodedUrl = encodeURIComponent(resp.data);
        const data = resp.data;
        setProfilePicURL({imageSrc: data, imageHash: Math.random()})
        console.log(resp)
      } catch (err) {
        console.log(err)
      }
    }
    getProfileDetails()
    getProfilePictureURL()
    if (role == "school") { getSchoolStudents() }
  }, [])

  useEffect(() => {
    console.log(profilePicURL)
  }, [profilePicURL])

  useEffect(() => {
    console.log(user)
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

  const updateProfilePicUrl = (value) => {
    console.log("GOGOGO")
    setProfilePicURL({imageSrc: value, imageHash:  Math.random()})
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
      <ProfileUploadModal closeModal={closeModal} showProfileModal={profileModal} updateProfilePicUrl={updateProfilePicUrl}/>

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
                    //src={ user?.user?.profilePicture ? user.user.profilePicture : defaultProfilePicture}
                    src={ profilePicURL.imageSrc !== "" ?`${profilePicURL.imageSrc}?random=${new Date().getSeconds()}` : defaultProfilePicture}
                    key={profilePicURL.imageHash}
                  />
                </OverlayTrigger>
            </Card>
          </Col>
          
          {/* right half. form fields */}
          <Col>
            <Container fluid style={{ height: "100%", border: "solid red"}}>
              { user.user.roles[0].authority != "school" ?
                <Row style={{ height: "33.4%", border: "solid green"}}>
                  <Col>First: <Form.Control name='first' onChange={updateProfileForm} disabled={!edit} value={profileForm?.name.first} style={{ textAlign: "center" }} /> </Col>
                  <Col>Last: <Form.Control name='last' onChange={updateProfileForm} disabled={!edit} value={profileForm?.name.last} style={{ textAlign: "center" }} /> </Col>
                </Row>
                :
                <Row style={{ height: "33.4%", border: "solid green"}}>
                  <Col>School: <Form.Control name='first' onChange={updateProfileForm} disabled={!edit} value={profileForm?.name} style={{ textAlign: "center" }} /> </Col>
                </Row>
              }

              <Row style={{ height: "33.3%", border: "solid green"}}>
                <Col>Email: <Form.Control name='email' onChange={updateProfileForm} disabled={!edit} value={profileForm?.email} style={{ textAlign: "center" }} /> </Col>
              </Row>
              
              <Row style={{ height: "33.3%", border: "solid green"}}>
                <Col>Role: <b>{profileForm?.role}</b> </Col>
              </Row>
            </Container>
          </Col>
        </Row>

        <Row style={{ height: "50%", border: "solid blue", overflow: "hidden"}}>
          <Col style={{ height: "100%" }}>
            <div style={{ height: "100%", border: "solid red"}}>
              <div style={{height: "10%", border: "solid"}}></div>
              <div style={{height: "70%", border: "solid", overflow: "auto"}}>
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
                
              </div>
              <div style={{height: "20%", display: "flex", alignItems: "center"}}>
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
                
              </div>
            </div>
          </Col>
        </Row>
        
      </Container>
    </>
  )}
}

export default ProfileForm