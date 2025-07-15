import { logoutUser } from "@/redux/reducerSlices/userSlice";
import { store } from "@/redux/store";
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response with error handling in case of auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error("Authentication error:", error.response.data.message);
      store.dispatch(logoutUser());
      toast.error(`Authentication error: ${error.response.data.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;
