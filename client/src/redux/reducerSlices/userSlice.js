import { createSlice } from "@reduxjs/toolkit";
import { MoveLeft } from "lucide-react";

const initialState = {
  emailId: "",
  token: "",
  isLoggedIn: false,
  fullName: "",
  address: "",
  phoneNumber: null,
  gender: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logoutUser: (state) => {
      return initialState;
    },
    addLoginDetails: (state, action) => {
      const { emailId, fullName, phoneNumber, gender, address } =
        action.payload.user;
      const { token, isLoggedIn } = action.payload;
      return {
        ...state,
        emailId: emailId,
        token: token,
        isLoggedIn: isLoggedIn,
        address: address,
        fullName: fullName,
        phoneNumber: phoneNumber,
        gender: gender,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { logoutUser, addLoginDetails } = userSlice.actions;

export default userSlice.reducer;
