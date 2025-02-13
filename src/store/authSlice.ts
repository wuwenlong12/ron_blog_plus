import { createSlice } from "@reduxjs/toolkit";
import { auth, logout } from "../api/auth";
import type { AppDispatch } from "../store";
import { User } from "../api/auth/type";

interface AuthState {
  siteIsOpen: boolean;
  siteIsInit: boolean;
  isAuthenticated: boolean;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  siteIsOpen: true,
  siteIsInit: true,
  isAuthenticated: false,
  user: null,
  status: "idle",
};

// 创建 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAuthenticated = true;
      state.siteIsOpen = true;
      state.user = action.payload;
      state.status = "succeeded";
    },
    setSiteIsInit: (state, action) => {
      state.siteIsInit = action.payload;
    },
    setNoLogin: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "succeeded";
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state) => {
      state.status = "failed";
      state.isAuthenticated = false;
      state.user = null;
    },
    setSiteIsNotOpen: (state) => {
      state.status = "failed";
      state.siteIsOpen = false;
      state.isAuthenticated = false;
      state.user = null;
      state.status = "succeeded";
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "idle";
    },
  },
});

// Action Creators
export const {
  setSiteIsInit,
  setAdmin,
  setLoading,
  setError,
  setNoLogin,
  clearUser,
  setSiteIsNotOpen,
} = authSlice.actions;

// **手动处理异步检查登录状态**
export const checkLoginStatus = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const res = await auth();
    if (res.code === 0) {
      dispatch(setAdmin(res.data));
    } else if (res.code === 1) {
      dispatch(setAdmin(res.data));
      dispatch(setSiteIsInit(false));
    } else if (res.code === 2) {
      dispatch(setSiteIsNotOpen());
    } else if (res.code === 3) {
      dispatch(setNoLogin());
    } else {
      dispatch(setError());
    }
  } catch (error) {
    dispatch(setError());
  }
};

export const logoutHandle = () => async (dispatch: AppDispatch) => {
  const res = await logout();
  if (res.code === 0) {
    dispatch(clearUser());
  }
};

export default authSlice.reducer;
