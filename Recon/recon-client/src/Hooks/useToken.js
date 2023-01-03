import { useSelector } from "react-redux";
import { updateAuth, userSelector } from "../State/Slices/userSlice";
//import useAuth from "./useAuth"



const useToken = () => {
  const user = useSelector(userSelector)
 

  const getToken = async () => {
    const token = user.user.refreshToken
    console.log(token)
    return token
  }

  return getToken
}

export default useToken;