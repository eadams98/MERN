import axios from "axios";

import { BASE_URL } from "../Utilities/URLs";

export default axios.create({
  baseURL: BASE_URL
})