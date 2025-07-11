"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducerSlices/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import reduxLogger from "redux-logger";

const rootReducer = combineReducers({
  user: userSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: () => [reduxLogger],
});

export const persistor = persistStore(store);
