import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emailId: "",
  token: "",
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
      const { token, isLoggedIn } = action.payload;

      return {
        ...state,
        userId: _id,
        emailId: emailId,
        token: token,
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
  },
});

export const {
  logoutUser,
  addLoginDetails,
  addToWishList,
  removeFromWishList,
} = userSlice.actions;

export default userSlice.reducer;
