import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client.js";
import { clearToken, setToken, getToken } from "../authStorage.js";

export const registerUser = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    await api.post("/auth/register", payload);
    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || "Register failed");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const res = await api.post("/auth/login", payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || "Login failed");
  }
});

const initialState = {
  token: getToken(),
  user: null,
  status: "idle",
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      clearToken();
    }
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.status = "succeeded"; })
      .addCase(registerUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })
      .addCase(loginUser.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.token = a.payload.access_token;
        s.user = a.payload.user;
        setToken(a.payload.access_token);
      })
      .addCase(loginUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
