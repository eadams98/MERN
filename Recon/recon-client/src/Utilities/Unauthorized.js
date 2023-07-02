import { stringify } from 'json5'
import { useSelector } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { userSelector } from '../State/Slices/userSlice'

const Unauthorized = () => {
  let auth = useSelector(userSelector)
  const location = useLocation();

  //alert("auth is", JSON.stringify(auth))
  
  console.log(auth)
  console.log(`location = ${location.pathname}`)

  const accessMapping = {
    "JR. CONTRACTOR": new Set(["/home/report/view", "/home/profile"]),
    "CONTRACTOR": new Set(["/home/report/view", "/home/report/create", "/home/profile"]),
    "SCHOOL": new Set(["/home/report/view", "/home/connections", "/home/profile", "/home/connections"])
  };

  const convert = {
    "trainee": "JR. CONTRACTOR",
    "contractor": "CONTRACTOR",
    "school": "SCHOOL"
  }

  return (
    /*auth.isLoading ?
      <div>LOADING</div>
      :*/
      accessMapping[convert[auth.user.roles[0].authority]].has(location.pathname) ? <Outlet/> : <div className="fullScreen" style={{display: 'flex', alignItems: "center", justifyContent: "center"}}><div>UNAUTHORIZED ACCESSED</div></div>
  )
}

export default Unauthorized; 