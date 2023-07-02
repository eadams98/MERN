import { useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import styles from "../../../CSS/Modules/Button.module.css"
import ExcelLikeTable from "../../../Utilities/ExcelLikeTable";
import AddConnections from "./AddConnections/AddConnections";
import AddContractorToSchool from "./AddConnections/AddContractorToSchool";
import AddTraineeToSchool from "./AddConnections/AddTraineeToSchool";
import CurrentConnections from "./CurrentConnections/CurrentConnections";

const ConnectionsContainers = () => {

  const [tab, setTab] = useState("current");

  const renderSwitch = (param) => {
    switch(tab) {
      case "current":
        return <CurrentConnections/>
      case "add-contractor":
        return <AddContractorToSchool/>
      case "add-trainee":
        return <AddTraineeToSchool/>
      case "add-trainee-to-contractor":
        return <AddConnections/>
      default:
        return <div>no mapping</div>
    }
  }

  return (
    <Container fluid style={{ height: "100%", backgroundColor: "yellow", display: 'flex', alignItems: "center", justifyContent: "center"}}>

      <Container fluid style={{width: "100%", height: "98%", backgroundColor: "grey"}}>
        <Row style={{ height: "10%"}}>
          <Col
            className={tab === "current" ? styles.reconButtonActive : styles.reconButton}
            as={Button} 
            onClick={() => setTab("current")}
          >Current Connectinos</Col>
          <Col
            className={tab === "add-contractor" ? styles.reconButtonActive : styles.reconButton}  
            as={Button} 
            onClick={() => setTab("add-contractor")}
          >Request Contractor To Connect to School</Col>
          <Col
            className={tab === "add-trainee" ? styles.reconButtonActive : styles.reconButton}
            as={Button} 
            onClick={() => setTab("add-trainee")}
          >Add Student to School Connection</Col>
          <Col
            className={tab === "add-trainee-to-contractor" ? styles.reconButtonActive : styles.reconButton}
            as={Button} 
            onClick={() => setTab("add-trainee-to-contractor")}
          >Add Student to School Connection</Col>
        </Row>
        <Row style={{ border: "solid", height: "90%"}}>
          { renderSwitch(tab) }
        </Row>
      </Container>

    </Container>
  )
}

export default ConnectionsContainers