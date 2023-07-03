import { useState } from "react";
import { Button, Col, Container, Modal, Row, } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import useAxiosPersonal from "../../../Hooks/useAxiosPersonal";
import Swal from "sweetalert2"
import { updatePicture, userSelector } from "../../../State/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const ProfileUploadModal = ({ closeModal, showProfileModal, updateProfilePicUrl}) => {
  // Hooks
  const axios = useAxiosPersonal()
  const user = useSelector(userSelector)
  const dispatch = useDispatch()


  // Variables
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

  // Methods
  const selectFile = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

  const cleanUp = () => {
    closeModal()
    setIsFilePicked(false)
    setSelectedFile()
  }

  const uploadFile = async () => {
    const formData = new FormData()
    formData.append('profileImage', selectedFile)
    console.log(selectedFile)
    console.log(formData)

    let message, status
    try {
      const resp = await axios.post('/bucket/picture', formData)
      console.log(resp)
      message = resp.data.data
      status = resp.data.status
      console.log(message)
      dispatch(await (updatePicture(`${resp.data}?random=${new Date().getSeconds()}`)))
      updateProfilePicUrl(resp.data)
      closeModal()//setProfileModal(false)
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
      showConfirmButton: false
    })//.then(()=> window.location.reload())

  }

  return (
    <Modal show={showProfileModal} centered size="lg">
      <Modal.Header>
        <Container>
          <Row>
            <Col md={1}><FontAwesomeIcon onClick={cleanUp} icon={faXmark}/></Col>
            <Col></Col>
          </Row>
        </Container>
      </Modal.Header>

      <Modal.Body>
        <Container fluid>
          <Row>
            <Col md={{span: 6, offset: 3}}>
              File <label>{selectFile}</label>
            </Col>
          </Row>
          <Row>
            <Col md={{span: 6, offset: 3}}>
              <input type="file" name="file" onChange={selectFile} />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      
      <Modal.Footer>
        <Container>
          <Row>
            <Col md={{ span: 3 , offset: 9 }}>
              <Button variant="success" onClick={uploadFile} disabled={!isFilePicked} style={{width: "100%"}}>Submit</Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  )
}

export default ProfileUploadModal