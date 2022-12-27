import axios from "axios";
import { BASE_URL } from "../Utilities/URLs";

class UserService {

  loginAttempt = async (obj) => {
    console.log("USER SERVICE LOGIN ATTEMPT")
    return await axios.post(`${BASE_URL}/login`, obj); 
  }

}


export default new UserService();