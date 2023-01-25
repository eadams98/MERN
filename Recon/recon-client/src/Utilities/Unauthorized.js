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
    "JR. CONTRACTOR": new Set(["/home/report/view"]),
    "CONTRACTOR": new Set(["/home/report/view"]),
    "SCHOOL": new Set(["/home/report/view", "/home/connections"])
  };

  return (
    auth.isLoading ?
      <div>LOADING</div>
      :
      accessMapping[auth.user.role].has(location.pathname) ? <Outlet/> : <div>UNAUTHORIZED ACCESSED</div>
  )
}

export default Unauthorized; 