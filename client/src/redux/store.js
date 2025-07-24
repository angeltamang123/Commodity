"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducerSlices/userSlice";
import cartSlice from "./reducerSlices/cartSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import reduxLogger from "redux-logger";

const persistedRootReducer = combineReducers({
  user: userSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const pReducer = persistReducer(persistConfig, persistedRootReducer);

const rootReducer = combineReducers({
  persisted: pReducer,
  cart: cartSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }).concat(reduxLogger),
});

export const persistor = persistStore(store);
