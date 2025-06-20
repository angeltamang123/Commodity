import { createSlice } from "@reduxjs/toolkit";

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
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("userDetails");
      }
      return initialState;
    },
    addLoginDetails: (state, action) => {
      const { emailId, fullName, phoneNumber, gender, address } =
        action.payload.user;
      const { token, isLoggedIn } = action.payload;

      const userDetails = {
        emailId,
        fullName,
        phoneNumber,
        gender,
        address,
        token,
        isLoggedIn,
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      }

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
    loadUserDetailsFromSessionStorage: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  logoutUser,
  addLoginDetails,
  loadUserDetailsFromSessionStorage,
} = userSlice.actions;

export default userSlice.reducer;
