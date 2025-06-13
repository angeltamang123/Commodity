import { createSlice } from "@reduxjs/toolkit";
import { MoveLeft } from "lucide-react";

export const boxSlice = createSlice({
  name: "box",
  initialState: {
    backgroundColor: "red",
    circle: "none",
    width: 100,
    height: 10,
    marginRight: 50,
    marginLeft: 50,
    marginTop: 50,
    marginBottom: 50,
  },
  reducers: {
    incrementHeight: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.height += 10;
    },
    incrementWidth: (state) => {
      state.width += 1;
    },
    decrementHeight: (state) => {
      state.height -= 10;
    },
    decrementWidth: (state) => {
      state.width -= 10;
    },
    changeColor: (state) => {
      state.backgroundColor = "blue";
    },
    moveLeft: (state) => {
      state.marginLeft -= 10;
      state.marginRight += 10;
    },
    moveRight: (state) => {
      state.marginLeft += 10;
      state.marginRight -= 10;
    },
    moveUp: (state) => {
      state.marginTop -= 10;
      state.marginBottom += 10;
    },
    moveDown: (state) => {
      state.marginTop += 10;
      state.marginBottom -= 10;
    },
    makeCircle: (state) => {
      state.circle = "full";
    },
    revertCircle: (state) => {
      state.circle = "none";
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  incrementHeight,
  incrementWidth,
  decrementHeight,
  decrementWidth,
  changeColor,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  makeCircle,
  revertCircle,
} = boxSlice.actions;

export default boxSlice.reducer;
