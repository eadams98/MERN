import { useDispatch, useSelector } from "react-redux";
import UserService from "../Services/User";
import { updateAuth, userSelector, updateUserToken } from "../State/Slices/userSlice";
//import useAuth from "./useAuth"



const useRefreshToken = () => {
  const user = useSelector(userSelector)
  const dispatch = useDispatch()

  const refresh = async () => {
    console.log("REFRESH")
    const response = await UserService.refreshToken(user.user.refreshToken, user.user.roles[0].authority)
    const token = response.data
    console.log(response)
    console.log(`user ${user}`)
    console.log(`after user`)
    console.log(`token: ${token}`)
    //dispatch(updateAuth(token))
    dispatch(updateUserToken(token));
    
  }

  return refresh
}

export default useRefreshToken;