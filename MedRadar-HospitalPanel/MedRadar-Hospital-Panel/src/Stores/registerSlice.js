import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  location: '',
  city: '',
  pincode:'',
  state: '',
  email: '',
  phone: '',
  password: '',
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegister: (state, action) => {
      const data = action.payload;
      for (const key in data) {
        if (state.hasOwnProperty(key)) {
          state[key] = data[key];
        }
      }
    },
    clearRegister(state, action) {
      for (const key in state) {
        if (state.hasOwnProperty(key)) {
          state[key] = '';
        }
      }
    },
  },
});

export const { setRegister, clearRegister } = registerSlice.actions;

export default registerSlice.reducer;
