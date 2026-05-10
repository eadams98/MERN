import React from 'react';
import './App.css';

import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from './Routes/Login/Login'
import Home from './Routes/Home/Home';
import PrivateRoutes from './Utilities/PrivateRoute';
import { useSelector } from 'react-redux';
import { userSelector } from './State/Slices/userSlice';
import PageNotFound from './PageNotFound';
import GenerateReport from './Routes/Home/Report/Create/GenerateNewReport';
import ViewWrapper from './Routes/Home/Report/View/wrapper';
import ProfileContainer from './Routes/Home/Profile/ProfileContainer';
import ConnectionsContainers from './Routes/Home/Connections/ConnectionContainer';
import Unauthorized from './Utilities/Unauthorized';
import PageWrapper from './Utilities/PageWrapper';


function App() {

  const user = useSelector(userSelector)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PageNotFound/>} path='*'/>
          <Route element={<Login user={user}/>} path="/" />
          <Route element={<PageWrapper height="100vh"/>} path="/test" />
          <Route element={<PrivateRoutes/>}>
            <Route element={<Home/>} path="/home/" >
              <Route element={<Unauthorized/>}>
                <Route path="profile" element={<ProfileContainer/>}/>
                <Route path="report/view" element={<ViewWrapper/>}/>
                <Route path="report/create" element={<GenerateReport/>}/>
                <Route path="connections" element={<ConnectionsContainers/>}/>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
