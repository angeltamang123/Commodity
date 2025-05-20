"use client";
import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./reducerSlices/couterslice";

export default configureStore({
  reducer: {
    counter: counterSlice,
  },
});
