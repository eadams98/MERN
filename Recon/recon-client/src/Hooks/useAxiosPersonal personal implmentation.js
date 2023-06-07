import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../API/axios";
import { userSelector, updateUserToken } from "../State/Slices/userSlice";
import useRefreshToken from "./useRefreshToken";

const useAxiosPersonal = () => {
  const refresh = useRefreshToken();
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const [token, setToken] = useState(user.user.token)

  const retryCounterRef = useRef(0); // Counter to track retries

  useEffect(() => {
    //alert(`USER TOKEN UPDATED to ${user.user.token}`)
    setToken(user.user.token);
  }, [user.user.token]);

  useEffect(() => {
    // Access the updated user state here
    console.log(user);
  }, [user]);

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        //const token = user.user.token
    
        console.log(`token ${token}`)
        if (token) {
          console.log("config auth header")
          if (config.url !== `/refresh/contractor/${user.user.refreshToken}`) {
            config.headers['Authorization'] = 'Bearer ' + token
          }
          config.headers['Access-Control-Allow-Origin'] = "*"
          config.headers['Access-Control-Allow-Headers'] = "X-Requested-With"
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    const responseIntercept = axios.interceptors.response.use(
      function (response) {
        // ... Your response interceptor code
        return response;
      },
      function (error) {
        // ... Your response interceptor code
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, token]);

  async function performAsyncOperation() {
    try {
      delete axios.defaults.headers.common["Authorization"];
      //await refresh()
      const result = await axios.get(
        `/refresh/contractor/${user.user.refreshToken}`
      );
      console.log(result.data);
      const newAccessToken = result.data;

      // Update the user with the new access token
      dispatch(updateUserToken(newAccessToken));
      setToken(newAccessToken)
    } catch (error) {
      throw new Error("Async operation failed");
    }
  }

  const retryWithDelay = (asyncFn, maxRetries, delay) => {
    return new Promise((resolve, reject) => {
      const attempt = async () => {
        try {
          const result = await asyncFn();
          resolve(result);
        } catch (error) {
          if (maxRetries <= 0) {
            reject(error);
          } else {
            setTimeout(() => {
              attempt();
              maxRetries--;
            }, delay);
          }
        }
      };

      attempt();
    });
  };

  const axiosRetryRequest = async (config) => {
    try {
      return await axios(config);
    } catch (error) {
      if (
        (error.response?.data.errorCode === 403 ||
          error.response?.data.errorCode === 401) &&
        retryCounterRef.current < 2 // Limit the retries to 2
      ) {
        retryCounterRef.current++; // Increment the retry counter
        await performAsyncOperation(); // Wait for the async operation to complete
        return axiosRetryRequest(config); // Retry the request
      }
      throw error;
    }
  };

  const axiosRetry = async (config) => {
    try {
      return await retryWithDelay(
        () => axiosRetryRequest(config),
        2, // Maximum retries
        30000 // Retry delay (30 seconds)
      );
    } catch (error) {
      // Handle the error
      console.log("Error: ", error);
      throw error;
    }
  };

  return axiosRetry;
};




export default useAxiosPersonal