import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../../State/Slices/userSlice";

function buildLinks(authorityRaw) {
  const authority = (authorityRaw || "").toLowerCase();
  const links = [
    {
      to: "profile",
      label: "Profile",
      description: "Account settings and profile picture",
    },
    {
      to: "report/view",
      label: "View reports",
      description: "Open the report workspace for your role",
    },
  ];
  if (authority !== "trainee" && authority !== "school") {
    links.push({
      to: "report/create",
      label: "Create report",
      description: "Start a new weekly report",
    });
  }
  if (authority === "school" || authority !== "council") {
    links.push({
      to: "connections",
      label: "Connections",
      description: "Manage schools, trainees, and contractors",
    });
  }
  return links;
}

function HomeDashboard() {
  const user = useSelector(userSelector);
  const role = user?.user?.roles?.[0]?.authority;
  const links = buildLinks(role);

  return (
    <div className="dashboard-grid">
      <h1 className="dashboard-grid__title">Home</h1>
      <p className="text-muted mb-4">
        Signed in as {user?.user?.username || "user"}
        {role ? ` · Role: ${role}` : null}
      </p>
      <Row className="g-3">
        {links.map((item) => (
          <Col key={item.to} md={6}>
            <Card className="h-100 recon-dashboard-card shadow-sm">
              <Card.Body>
                <Card.Title>
                  <Link to={item.to}>{item.label}</Link>
                </Card.Title>
                <Card.Text className="text-muted small mb-0">{item.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HomeDashboard;
