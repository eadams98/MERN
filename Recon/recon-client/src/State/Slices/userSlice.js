import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  user: null
}

const  userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state) => {
      if (state.token) { return true}
      else {
        state.isLoading = true
      }
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
    }
  }
});

export const userSelector = (state) => state.user;
export const {logout, login, getUser, loginSuccess, loginFail} = userSlice.actions;
export default userSlice.reducer;

//API

export function attemptLogin(user, pass) {
  console.log("ATTEMPT LOGIN DISPATCH")
  return async (dispatch) => {
    dispatch(getUser())
    try {
      console.log("Before")
      const response = await UserService.loginAttempt({ email: user, password: pass })
      console.log("Response = ", response.data)
      dispatch(loginSuccess(response.data.data))
    } catch (error) {
      console.log(error.response.data)
      dispatch(loginFail(error.response.data.message))
    }
  }
}

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