//import axios from "axios";
//import { BASE_URL } from "../Utilities/URLs";
import axios from "../API/axios";

class UserService {

  loginAttempt = async (obj, userType) => {
    console.log("USER SERVICE LOGIN ATTEMPT")
    return await axios.post(`/user/authenticate/${userType}`, obj); 
  }

  refreshToken = async (refreshToken, role) => {
    console.log("USER SERVICE REFRESH ATTEMPT")
    return await axios.get(`/refresh/${role}/${refreshToken}`); 
  }

}


export default new UserService();