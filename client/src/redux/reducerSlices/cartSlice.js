import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

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
      const newItem = action.payload; // Expects { productId, name, price, quantity, image, stock }
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );

      state.totalQuantity += newItem.quantity;
      state.totalAmount += newItem.price * newItem.quantity;

      if (!existingItem) {
        state.items.push(newItem);
        toast.success(`${newItem.quantity} x ${newItem.name} added to cart!`);
      } else {
        const potentialQuantity = existingItem.quantity + newItem.quantity;
        const maxStock = newItem.stock;

        if (potentialQuantity > maxStock) {
          const quantityToAdd = maxStock - existingItem.quantity;
          if (quantityToAdd > 0) {
            existingItem.quantity += quantityToAdd;
            state.totalQuantity -= newItem.quantity - quantityToAdd;
            state.totalAmount -=
              newItem.price * (newItem.quantity - quantityToAdd);
            toast.warning(
              `Only ${quantityToAdd} more of ${newItem.name} added. Reached maximum stock.`
            );
          } else {
            state.totalQuantity -= newItem.quantity;
            state.totalAmount -= newItem.price * newItem.quantity;
            toast.warning(
              `Cannot add more ${newItem.name}. Already at maximum stock.`
            );
          }
        } else {
          existingItem.quantity = potentialQuantity;
          toast.success(`${newItem.quantity} x ${newItem.name} added to cart!`);
        }

        existingItem.price = newItem.price;
      }
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
