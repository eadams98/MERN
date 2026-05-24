import React from "react";
import { Container } from "react-bootstrap";
import PrimaryNav from "../Routes/Home/Navbar/PrimaryNav";

/**
 * Shared chrome: top nav + scrollable main. Nested routes render via Outlet in the parent.
 */
function AppShell({ navHeight = "10", children }) {
  return (
    <Container fluid className="app-shell vh-100">
      <PrimaryNav navHeight={navHeight} />
      <main className="app-shell__main">{children}</main>
    </Container>
  );
}

export default AppShell;
