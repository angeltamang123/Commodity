"use client";
import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./reducerSlices/couterslice";
import boxSlice from "./reducerSlices/boxSlice";

export default configureStore({
  reducer: {
    counter: counterSlice,
    box: boxSlice,
  },
});
