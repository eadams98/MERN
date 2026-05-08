import React from 'react';
import { useEffect, useState } from "react"
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap"
import { useSelector } from "react-redux";
import { userSelector } from "../../../../State/Slices/userSlice";
import useAxiosPersonal from "../../../../Hooks/useAxiosPersonal";
import SelectUserWeek from "./SelectUserWeek/SelectUserWeek";

const ViewSchoolReport = () => {
  const user = useSelector(userSelector)
  const axios = useAxiosPersonal()
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [traineeEmail, setTraineeEmail] = useState("")
  const [contractorEmail, setContractorEmail] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await axios(`/school/${user.user.id}/students`)
        const list = resp.data
        setStudents(Array.isArray(list) ? list : Array.from(list || []))
      } catch (e) {
        console.log(e)
        setStudents([])
      } finally {
        setLoadingStudents(false)
      }
    }
    load()
  }, [user.user.id])

  if (loadingStudents) {
    return (
      <Container fluid className="fullScreen">
        <Row className="justify-content-center align-items-center h-100">
          <Spinner animation="border" role="status" />
        </Row>
      </Container>
    )
  }

  return (
    <Container fluid className="fullScreen">
      <Row style={{display:'flex', alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}> 
        <Col>
          {!started ? (
            <Form style={{ maxWidth: 480, margin: "0 auto" }}>
              <Form.Group className="mb-3">
                <Form.Label>Student</Form.Label>
                <Form.Select
                  value={traineeEmail}
                  onChange={(e) => setTraineeEmail(e.target.value)}
                >
                  <option value="">Select a student</option>
                  {students.map((s) => (
                    <option key={s.traineeId ?? s.email} value={s.email}>
                      {(s.firstName || s.lastName)
                        ? `${s.firstName ?? ""} ${s.lastName ?? ""} (${s.email})`.trim()
                        : s.email}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Supervising contractor email</Form.Label>
                <Form.Control
                  type="email"
                  autoComplete="email"
                  value={contractorEmail}
                  onChange={(e) => setContractorEmail(e.target.value.trim())}
                  placeholder="contractor@example.com"
                />
              </Form.Group>
              <Button
                disabled={!traineeEmail || !contractorEmail}
                onClick={() => setStarted(true)}
              >
                View reports
              </Button>
            </Form>
          ) : (
            <SelectUserWeek
              userID={traineeEmail}
              contractorEmail={contractorEmail}
              role="school"
              resetParent={() => setStarted(false)}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ViewSchoolReport
