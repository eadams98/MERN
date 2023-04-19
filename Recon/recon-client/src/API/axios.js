import axios from "axios";

import { BASE_URL, BASE_URL_AWS } from "../Utilities/URLs";

export default axios.create({
  baseURL: BASE_URL
})