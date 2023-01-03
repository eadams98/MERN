import axios from "axios";
import { BASE_URL } from "../Utilities/URLs";
import axiosRetry from 'axios-retry'
import { useSelector } from "react-redux";
import { userSelector } from "../State/Slices/userSlice";
//import TokenService from "./TokenService";
import useAxiosPersonal from '../Hooks/useAxiosPersonal'

class ReportService {

  /*createReport = async (obj, refreshToken) => {
    const client = axios.create()
    //const user = useSelector(userSelector)
    console.log(obj)
    console.log("token service = ", TokenService.getUserToken())

    axiosRetry(
      client, 
      { retries: 2,
        retryDelay: (retryCount) => {
          return retryCount * 1000;
        },
        retryCondition: (error) => {return error.response.status === 403 || error.response.status === 401;},
        onRetry: async (retryCount, error) => {
          console.log(retryCount)
          console.log(obj)
          if (retryCount === 1) {
            try {
              const response = await axios.post("http://www.localhost:4001/generate-token", {token: refreshToken})
              const newAccessToken = response.data.data;
              console.log(`new access token: ${newAccessToken}`)
              obj.token = newAccessToken
            } catch (error) {
              console.log(`error ${error}`)
            }
          }
        }
        // ...more options 
      },
    )
    return await client.post(`${BASE_URL}/create-report`, obj); 
  }*/

  createReport = async (obj, refreshTokenFunction) => {
    const client = useAxiosPersonal() //axios.create()
    //const user = useSelector(userSelector)
    //console.log(obj)
    //console.log("token service = ", TokenService.getUserToken())

    axiosRetry(
      client, 
      { retries: 2,
        retryDelay: (retryCount) => {
          return retryCount * 1000;
        },
        retryCondition: (error) => {return error.response.status === 403 || error.response.status === 401;},
        onRetry: async (retryCount, error) => {
          console.log(retryCount)
          console.log(obj)
          if (retryCount === 1) {
            try {
              refreshTokenFunction()
              //const response = await axios.post("http://www.localhost:4001/generate-token", {token: refreshToken})
              //const newAccessToken = response.data.data;
              //console.log(`new access token: ${newAccessToken}`)
              //obj.token = newAccessToken
            } catch (error) {
              console.log(`error ${error}`)
            }
          }
        }
        /* ...more options */ 
      },
    )
    return await client.post(`${BASE_URL}/create-report`, obj); 
  }
}


export default new ReportService();