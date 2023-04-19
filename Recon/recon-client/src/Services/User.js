//import axios from "axios";
//import { BASE_URL } from "../Utilities/URLs";
import axios from "../API/axios";

class UserService {

  loginAttempt = async (obj) => {
    console.log("USER SERVICE LOGIN ATTEMPT")
    return await axios.post(`/user/authenticate/contractor`, obj); 
  }

  refreshToken = async (refreshToken) => {
    console.log("USER SERVICE REFRESH ATTEMPT")
    return await axios.post(`/generate-token`, { token: refreshToken }); 
  }

}


export default new UserService();