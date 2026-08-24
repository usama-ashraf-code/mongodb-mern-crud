// import {  createSlice , createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  name:"",
  email:"",
  password:"",
  image: null
};



// ========== ASYNC THUNK ==========
// Server ko data send karega
// export const registerUser = createAsyncThunk(
//     "register/registerUser",
//     async (formData, thunkAPI) => {
//         try {
//             const res = await axios.post("http://localhost:5000/register", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data || "Error");
//         }
//     }
// );

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  
  reducers: {
    setName: (state,action) => {
      state.name =action.payload
    },
    setEmail: (state,action) => {
      state.email =action.payload
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
  },
})


 export const { setName , setEmail,   setImage}= registerSlice.actions;

export default registerSlice.reducer;
