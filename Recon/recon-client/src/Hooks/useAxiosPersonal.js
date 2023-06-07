import axiosRetry from "axios-retry";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "../API/axios";
import { userSelector } from "../State/Slices/userSlice";
import useRefreshToken from "./useRefreshToken";

import { CancelToken } from 'axios';




const useAxiosPersonal = () => {
  const refresh = useRefreshToken();
  const user = useSelector(userSelector);
  const [token, setToken] = useState(user.user.token);
  const [tokenUpdated, setTokenUpdated] = useState(false);
  const axiosInstanceRef = useRef(null);
  axiosInstanceRef.current = axios.create();


  useEffect(() => {
    const updateInterceptors = (newToken) => {
      axiosInstanceRef.current.interceptors.request.use(
        (config) => {
          if (newToken) {
            config.headers['Authorization'] = 'Bearer ' + newToken;
            config.headers['Access-Control-Allow-Origin'] = "*";
            config.headers['Access-Control-Allow-Headers'] = "X-Requested-With";
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    };


    const requestIntercept = axiosInstanceRef.current.interceptors.request.use(
      (config) => {
        console.log(`token ${token}`);
        if (token) {
          console.log("config auth header");
          config.headers['Authorization'] = 'Bearer ' + token;
          config.headers['Access-Control-Allow-Origin'] = "*";
          config.headers['Access-Control-Allow-Headers'] = "X-Requested-With";
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosInstanceRef.current.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response && error.response.status === 401) {
          // Unauthorized error (401)
          try {
            await refresh(); // Refresh the token
            const newToken = user.user.token; // Get the updated token
            setToken(newToken); // Update the token state
            updateInterceptors(newToken); // Update the axios interceptors with the new token
            error.config.headers['Authorization'] = 'Bearer ' + newToken; // Update the failed request's headers with the new token
            return axiosInstanceRef.current(error.config); // Retry the failed request with the updated token
          } catch (err) {
            // Error refreshing the token
            console.log('Error refreshing token:', err);
          }
        }
        return Promise.reject(error);
      }
    );

    updateInterceptors(token);

    return () => {
      axiosInstanceRef.current.interceptors.request.eject(requestIntercept);
      axiosInstanceRef.current.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh, user.user.token]);

  useEffect(() => {
    if (!tokenUpdated) {
      setToken(user.user.token);
      setTokenUpdated(true);
    }
  }, [user.user.token, tokenUpdated]);

  axiosRetry(axiosInstanceRef.current, {
    retries: 2,
    retryDelay: (retryCount) => 1000,
    retryCondition: (error) => {
      return (
        error.response &&
        (error.response.status === 403 || error.response.status === 401)
      );
    },
  });

  return axiosInstanceRef.current;
};







export default useAxiosPersonal