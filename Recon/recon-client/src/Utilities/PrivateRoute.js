import { stringify } from 'json5'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { userSelector } from '../State/Slices/userSlice'

const PrivateRoutes = () => {
  let auth = useSelector(userSelector)
  //alert("auth is", JSON.stringify(auth))
  setTimeout(() => {
    
  })
  console.log(auth)
  return (
    auth.isLoading ?
      <div>LOADING</div>
      :
      auth.user ? <Outlet/> : <Navigate to="/"/>
  )
}

export default PrivateRoutes 