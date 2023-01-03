import { useDispatch, useSelector } from "react-redux";
import UserService from "../Services/User";
import { updateAuth, userSelector } from "../State/Slices/userSlice";
//import useAuth from "./useAuth"



const useRefreshToken = () => {
  const user = useSelector(userSelector)
  const dispatch = useDispatch()

  const refresh = async () => {
    const response = await UserService.refreshToken(user.user.refreshToken)
    const token = response.data.data
    dispatch(updateAuth(token))
    console.log(response)
    console.log(user)
  }

  return refresh
}

export default useRefreshToken;