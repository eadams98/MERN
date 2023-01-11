import { attemptLogout, userSelector } from "../../../State/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Alert, Card, Button, Navbar, NavDropdown, Nav, CardImg } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import defaultProfilePicture from '../../../Default-Profile-Picture.jpeg';

const PrimaryNav = ({navHeight = "10", ...restProps}) => {
  
  //props
  //{ navHeight = "10", ...restProps } = props;
  console.log(restProps)

  // tools
  const location = useLocation();
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  console.log(user)
  console.log(location.pathname)

  //methods
  const formName = (nameObj) => {
    return `${nameObj.first} ${nameObj.last}`
  }
  const handleLogout = async () => dispatch(await attemptLogout());

  
  return (
    <Row style={{height: `${navHeight}%`, backgroundColor: "blue"}}>
                  
        <Navbar variant="dark" bg="dark" style={{height: "100%", width: "100%"}}>
          <Container style={{ height: "100%"}}>
            <Card style={{ height: "100%", width: "10%"}}>
              <CardImg src={user.user?.profilePicture ? user.user.profilePicture : defaultProfilePicture} style={{height: "100%", width: "100%"}}/>
            </Card>
            <Navbar.Brand href="#home">RECON</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="me-auto">
              <NavDropdown title="Report" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to={"report/view"} disabled={location.pathname === "/home/report/view"}>View</NavDropdown.Item>
                { user.user.role !== "JR. CONTRACTOR" ? <NavDropdown.Item as={Link} to={"report/create"} disabled={location.pathname === "/home/report/create"}>Create</NavDropdown.Item> : null }
              </NavDropdown>
                <Nav.Link as={Link} to={"profile"} disabled={location.pathname === "/home/profile"}>Profile</Nav.Link>
              </Nav>
            <Navbar.Collapse className="justify-content-end">
              <Nav.Link as={Button} onClick={handleLogout}>Logout</Nav.Link>
              <Navbar.Text>
                Signed in as: <a href="#login">{formName(user.user.name)}</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      
    </Row>
  )
}

export default PrimaryNav;