import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { userSelector } from '../State/Slices/userSlice'

const PrivateRoutes = () => {
  let auth = useSelector(userSelector)
  return (
    auth.user ? <Outlet/> : <Navigate to="/"/>
  )
}

export default PrivateRoutes 