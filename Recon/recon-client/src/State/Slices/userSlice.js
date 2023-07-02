import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import swal from "sweetalert2";
import UserService from "../../Services/User"

/*type UserType = {
  isAuthenticate: boolean;
  name: string;
}

const initialState: UserType = {
  isAuthenticate: false,
  name: ""
}*/

const initialState = {
  isLoading: false,
  isError: false,
  error: null,
  isAuthenticate: false,
  name: "",
  token: null,
  user: null,
  profilePicture: ""
}

const  userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.isAuthenticate = false;
      state.name = "";
      state.user = null
    },
    getUser: (state) => {
      state.isLoading = true
    },
    updateUserToken: (state, action) => {
      state.user.token = action.payload
      state.isLoading = false
      console.log("USER TOKEN UPDATE")
      console.log(state.user)
    },
    updateUserProfilePhote: (state, {payload}) => {
      state.user.profilePicture = `http://localhost:4001/${payload}`
    },
    login: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, {payload}) => {
      state.isLoading = false;
      state.isError = false
      state.error = null
      state.user = payload
    },
    loginFail: (state, {payload}) => {
      state.isLoading = false;
      state.isError = true;
      state.error = payload
    },
    logout: (state) => {
      state.isAuthenticate = false;
      state.name = "";
      state.user = null
      state.isLoading = false
    },
    loadingInProgress: (state) => {
      state.isLoading = true
    },
    loadingComplete: (state) => {
      state.isLoading = false
    }
  }
});

export const userSelector = (state) => state.user;
export const {logout, login, getUser, loginSuccess, loginFail, resetUser, updateUserToken, updateUserProfilePhote, loadingInProgress, loadingComplete} = userSlice.actions;
export default userSlice.reducer;

//API
export function setLoadingInProgress() {
  return async (dispatch) => {
    dispatch(loadingInProgress())
  }
}

export function setLoadingComplete() {
  return async (dispatch) => {
    dispatch(loadingComplete())
  }
}

export function resetAuth() {
  return async (dispatch) => {
    dispatch(getUser())
    try {
      dispatch(resetUser())
    } catch (error) {
      console.log(error)
    }
  }
}

export function updateAuth(newAccessToken) {
  console.log(newAccessToken)
  return async (dispatch) => {
    dispatch(getUser())
    try {
      dispatch(updateUserToken(newAccessToken))
    } catch (error) {
      console.log(error)
    }
  }
}

export function attemptLogin(user, pass, userType) {
  console.log("ATTEMPT LOGIN DISPATCH")
  return async (dispatch) => {
    dispatch(getUser())
    setTimeout(async ()=>{
      try {
        console.log("Before")
        const response = await UserService.loginAttempt({ username: user, password: pass }, userType)
        console.log("Response = ", response.data)
        dispatch(loginSuccess(response.data))
      } catch (error) {
        console.log(error.response.data)
        console.log(error)
        dispatch(loginFail(error.response.data.message))
        swal.fire({
          position: 'top',
          icon: 'error',
          title:"ERROR",
          text: error.response.data.errorMessage,
          footer: error.response.data.timestamp,
          showConfirmButton: false,
          timer: 3000
      })
      }
    }, 1000)
    
  }
}

export function attemptLogout() {
  return async (dispatch) => {
    dispatch(getUser())
    try {
      dispatch(logout())
    } catch (error) {
      console.log(error)
    }
  }
}

export function updatePicture(src) {
  return async (dispatch) => {
    
    try {
      dispatch(updateUserProfilePhote(src))
      //dispatch(resetUser())
    } catch (error) {
      console.log(error)
    } finally {
      console.log(userSelector.toString())
    }
  }
}

/*export function updateToken() {
  return async (dispatch) => {
    dispatch(getUser())
    try {
      //const response = await ReportService
      dispatch(updateUserToken())
    } catch (error) {
      console.log(error)
    }
  }
}*/

export const attemptLoginAsync = createAsyncThunk("user/login", async (user, id) => {
  try {
    const response = await UserService.loginAttempt({ email: user.name , password: user.password })
    let data = response.data.data
    return data
  } catch (error) {
    let data = error.response.data.message
    return data
  }
})