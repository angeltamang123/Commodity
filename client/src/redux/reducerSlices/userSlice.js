import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

const initialState = {
  emailId: "",
  isLoggedIn: false,
  fullName: "",
  location: {},
  phoneNumber: null,
  gender: "",
  userId: null,
  wishlist: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logoutUser: (state) => {
      return initialState;
    },
    addLoginDetails: (state, action) => {
      const {
        emailId,
        fullName,
        phoneNumber,
        gender,
        location,
        _id,
        wishlist,
      } = action.payload.user;
      const { isLoggedIn } = action.payload;

      return {
        ...state,
        userId: _id,
        emailId: emailId,
        wishlist: wishlist,
        isLoggedIn: isLoggedIn,
        location: location,
        fullName: fullName,
        phoneNumber: phoneNumber,
        gender: gender,
      };
    },

    addToWishList: (state, action) => {
      state.wishlist.push(action.payload);
    },

    removeFromWishList: (state, action) => {
      const currentList = state.wishlist;
      state.wishlist = currentList.filter((item) => {
        return item !== action.payload;
      });
    },

    updateUserDetails: (state, action) => {
      const { fieldName, value } = action.payload;
      state[fieldName] = value;
    },
  },
});

export const {
  logoutUser,
  addLoginDetails,
  addToWishList,
  removeFromWishList,
  updateUserDetails,
} = userSlice.actions;

export default userSlice.reducer;
