import api from "@/lib/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => {
    const res = await api.get(`/notifications/unseen-count`);
    return res.data.unseen;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    unseenCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.unseenCount += 1;
    },
    markAllSeen: (state) => {
      state.unseenCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.unseenCount = action.payload;
    });
  },
});

export const { addNotification, markAllSeen } = notificationSlice.actions;
export default notificationSlice.reducer;
