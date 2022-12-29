import axios from "axios";
import { BASE_URL } from "../Utilities/URLs";

class ReportService {

  createReport = async (obj) => {
    return await axios.post(`${BASE_URL}/create-report`, obj); 
  }

}


export default new ReportService();