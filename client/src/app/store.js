import { configureStore } from '@reduxjs/toolkit';
import  registerReducer  from '../features/counter/registerSlice';

export const store = configureStore({
  reducer: {
    register: registerReducer,
  },
});
