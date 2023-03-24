import { Container, Spinner } from "react-bootstrap"
import ProfileForm from "./ProfileForm"

const ProfileContainer = () => {
  
  return (
    <Container fluid className="fullScreen" style={{ display: 'flex', alignItems: "center"}}>
      <ProfileForm />
    </Container>
  )
}

export default ProfileContainer