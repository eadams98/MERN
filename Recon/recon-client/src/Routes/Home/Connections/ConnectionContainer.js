import { useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import styles from "../../../CSS/Modules/Button.module.css"
import ExcelLikeTable from "../../../Utilities/ExcelLikeTable";
import AddConnections from "./AddConnections/AddConnections";

const ConnectionsContainers = () => {

  const [tab, setTab] = useState("current");

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
            className={tab === "add" ? styles.reconButtonActive : styles.reconButton}  
            as={Button} 
            onClick={() => setTab("add")}
          >Add Connections</Col>
        </Row>
        <Row style={{ border: "solid", height: "90%"}}>
          {
            tab === "add" ?
              (
                <AddConnections />
              )
              :
              (
                <Container style={{border: "solid red", display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <Row style={{height: "90%", width: "100%", border: "solid yellow"}}>
                    <ExcelLikeTable tableName="current connections" />
                  </Row>
                </Container>
              )
          }
        </Row>
      </Container>

    </Container>
  )
}

export default ConnectionsContainers