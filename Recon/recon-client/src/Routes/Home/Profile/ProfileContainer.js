import { Container, Spinner } from "react-bootstrap"
import ProfileForm from "./ProfileForm"

const ProfileContainer = () => {
  
  return (
    <Container fluid style={{ height: "100%", backgroundColor: "yellow", display: 'flex', alignItems: "center"}}>
      <ProfileForm />
    </Container>
  )
}

export default ProfileContainer