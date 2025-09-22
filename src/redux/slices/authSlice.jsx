import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  admin: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.admin = action.payload.admin;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.admin = false;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
