import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  createBrowserRouter,
  Route,
  BrowserRouter as Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from './Routes/Login/Login'
import Home from './Routes/Home/Home';
import ErrorPage from './error-page';
import ProtectedRoute from './Utilities/RouteGuard';
import PrivateRoutes from './Utilities/PrivateRoute';
import { useSelector } from 'react-redux';
import { userSelector } from './State/Slices/userSlice';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>,
      errorElement: <ErrorPage />,
    },
    {
      path: "/home",
      element: 
        <ProtectedRoute user={true}>
          <Home/>
        </ProtectedRoute>
      ,
    },
  ]);

  const user = useSelector(userSelector)
  console.log("user", user)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Login user={user}/>} path="/" />
          <Route element={<PrivateRoutes/>}>
            <Route element={<Home/>} path="/home" />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
