import { createSlice } from "@reduxjs/toolkit";

// Load saved auth state from localStorage if it exists
const savedAuth = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("auth")) : null;

const initialState = savedAuth || {
  user: null,
  admin: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.admin = action.payload.admin;
      state.isLoggedIn = true;

      // Persist to localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: state.user,
          admin: state.admin,
          isLoggedIn: state.isLoggedIn,
        })
      );
    },
    logout: (state) => {
      state.user = null;
      state.admin = false;
      state.isLoggedIn = false;

      // Remove from localStorage
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
