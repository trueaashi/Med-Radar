import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  hospital: null,
  approved: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const  {data}  = action.payload;
      console.log(data);
      state.hospital = data.hospital;
      state.approved = data.approved;
      if (data === null || !data.isAuth) {
        state.isAuth = false;
      } else {
        state.isAuth = true;
      }
    },
    clearAuth(state, action) {
      state.isAuth = false;
      state.hospital = null;
      state.approved = false;
    },
  },
});

export const { setAuth , clearAuth} = authSlice.actions;

export default authSlice.reducer;
