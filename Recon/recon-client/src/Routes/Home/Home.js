import React from 'react';
import {
  Outlet,
  useLocation,
} from "react-router-dom";
import AppShell from "../../Layouts/AppShell";
import HomeDashboard from "./Dashboard/HomeDashboard";

function Home() {
    const location = useLocation();

    return (
        <AppShell navHeight="10">
          {location.pathname === "/home" || location.pathname === "/home/" ? (
            <HomeDashboard />
          ) : (
            <Outlet/>
          )}
        </AppShell>
    );
}

export default Home;
