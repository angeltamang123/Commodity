import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array of cart items: { productId, name, price, quantity, image }
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload; // Expects { productId, name, price, quantity, image }
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );

      if (!existingItem) {
        state.items.push(newItem);
      } else {
        existingItem.quantity += newItem.quantity; // Direct mutation of existingItem, Immer handles it
        existingItem.price = newItem.price; // Ensure price is up-to-date
      }
      state.totalQuantity += newItem.quantity;
      state.totalAmount += newItem.price * newItem.quantity;
    },

    removeItemFromCart: (state, action) => {
      const productIdToRemove = action.payload; // Expects productId
      const removedItem = state.items.find(
        (item) => item.productId === productIdToRemove
      );

      if (removedItem) {
        state.totalQuantity -= removedItem.quantity;
        state.totalAmount -= removedItem.price * removedItem.quantity;
        state.items = state.items.filter(
          (item) => item.productId !== productIdToRemove
        );
      }
    },

    updateItemQuantity: (state, action) => {
      const { productId, quantityChange } = action.payload; // quantityChange can be +1 or -1
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantityChange;
        state.totalQuantity += quantityChange;
        state.totalAmount += existingItem.price * quantityChange;

        if (existingItem.quantity <= 0) {
          state.totalQuantity -= existingItem.quantity;
          state.totalAmount -= existingItem.price * existingItem.quantity;
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
