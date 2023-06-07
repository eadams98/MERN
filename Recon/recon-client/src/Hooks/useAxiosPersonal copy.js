import axiosRetry from "axios-retry";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../API/axios";
import { userSelector } from "../State/Slices/userSlice";
import useRefreshToken from "./useRefreshToken";

const useAxiosPersonal = () => {
  const refresh = useRefreshToken()
  const user = useSelector(userSelector)

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      config => {
        const token = user.user.token
    
        console.log(`token ${token}`)
        if (token) {
          console.log("config auth header")
          config.headers['Authorization'] = 'Bearer ' + token
          config.headers['Access-Control-Allow-Origin'] = "*"
          config.headers['Access-Control-Allow-Headers'] = "X-Requested-With"
        }
        // config.headers['Content-Type'] = 'application/json';
        return config
      },
      error => {
        Promise.reject(error)
      }
    )

    const responseIntercept = axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    });

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept)
    }
  }, [refresh])

  axiosRetry(
    axios, 
    { retries: 2,
      retryDelay: (retryCount) => {
        return retryCount * 1000;
      },
      retryCondition: (error) => {return error.response.data.errorCode === 403 || error.response.data.errorCode === 401;},
      onRetry: async (retryCount, error) => {
        console.log("retry count : "+ retryCount)
        if (retryCount === 1) {
          try {
            refresh()
            //const response = await axios.post("http://www.localhost:4001/generate-token", {token: refreshToken})
            //const newAccessToken = response.data.data;
            //console.log(`new access token: ${newAccessToken}`)
            //obj.token = newAccessToken
          } catch (error) {
            console.log(`error ${error}`)
          }
        }
      }
      
    },
  )

  return axios
}

export default useAxiosPersonal