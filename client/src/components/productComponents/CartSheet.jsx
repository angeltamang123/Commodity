"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Plus, Minus, X, CircleX } from "lucide-react";
import { Button } from "@nextui-org/react";
import { Input } from "@/components/ui/input";

import {
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} from "@/redux/reducerSlices/cartSlice";
import CheckoutDialog from "./CheckoutDialog";

const CartSheet = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { isLoggedIn, location: userLocation } = useSelector(
    (state) => state.persisted.user
  );

  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);

  // Function to handle quantity change from input or buttons
  const handleQuantityChange = (productId, newQuantity) => {
    let quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1; // Default to 1 if invalid
    }

    const currentItem = cartItems.find((item) => item.productId === productId);
    if (!currentItem) return;

    // Ensure quantity does not exceed available stock (you'd need to fetch product stock here)
    // For now, let's assume you have stock info in the cart item or fetch it
    // For a real app, you might fetch product details including stock here or on add to cart.
    // For simplicity, let's assume `item.stock` is available or you have a max limit.
    // If not, you'd need to fetch product.stock from backend.
    const maxStock = currentItem.stock || 999; // Placeholder, replace with actual stock
    quantity = Math.min(quantity, maxStock);

    const quantityDifference = quantity - currentItem.quantity;
    if (quantityDifference !== 0) {
      dispatch(
        updateItemQuantity({ productId, quantityChange: quantityDifference })
      );
    }
  };

  const handleIncrement = (productId) => {
    dispatch(updateItemQuantity({ productId, quantityChange: 1 }));
  };

  const handleDecrement = (productId) => {
    dispatch(updateItemQuantity({ productId, quantityChange: -1 }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeItemFromCart(productId));
    toast.info("Item removed from cart.");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info("Cart cleared.");
  };

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to proceed to checkout.");
      // Optionally redirect to login page
      // router.push('/login?from=/cart');
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before checking out.");
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handlePlaceOrder = async (items, deliveryAddress) => {
    try {
      // This is the API call to your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token
          },
          body: JSON.stringify({
            cartItems: items,
            deliveryAddress: deliveryAddress,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      toast.success("Order Placed Successfully!");
      dispatch(clearCart()); // Clear cart after successful order
      setShowCheckoutDialog(false); // Close checkout dialog
      // You might want to close the CartSheet here too,
      // but it's often handled by the parent component that triggers the Sheet.
      // If needed, you could pass a prop like `onOrderPlaced` from Navbar to CartSheet
      // and then call `onClose` for the sheet.
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Order Failed", {
        description:
          error.message || "An error occurred while placing your order.",
      });
    }
  };

  return (
    // h-full overflows the footer's below screen it is expected to be of screen height
    // Setting SheetContent h-screen or h-full do not solve this issue at all
    // Wherease, h-[94%] is a non robust hacky solution that might cause problem in responsiveness
    // Until then I will leave it as it is
    <div className="flex flex-col h-[94%] w-full overflow-hidden">
      {/* Cart Items List */}
      <div
        className="flex-1 overflow-y-auto py-4 pr-2 min-h-0  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 [&::-webkit-scrollbar-button]:hidden
  [scrollbar-width:thin]"
      >
        {" "}
        {/* Added pr-2 for scrollbar space */}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Your cart is empty.</p>
        ) : (
          <div className="space-y-4 overflow-x-hidden">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-2 border-b pb-4"
              >
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                    alt={item.name}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-gray-600 text-xs">
                    Rs.{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <Button
                      onClick={() => handleDecrement(item.productId)}
                      disabled={item.quantity <= 1}
                      size="icon"
                      variant="outline"
                      className="h-7 w-4 rounded-full shrink-0"
                    >
                      <Minus size={14} />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, e.target.value)
                      }
                      onBlur={(e) =>
                        handleQuantityChange(item.productId, e.target.value)
                      }
                      min={1}
                      max={item.stock} // Use actual stock if available in item
                      className="w-10 px-0 text-center text-sm font-medium h-7
                                 [appearance:textfield]
                                 [&::-webkit-outer-spin-button]:appearance-none
                                 [&::-webkit-inner-spin-button]:appearance-none
                                 shrink-0"
                    />
                    <Button
                      onClick={() => handleIncrement(item.productId)}
                      disabled={item.quantity >= (item.stock || 999)} // Use actual stock
                      size="icon"
                      variant="outline"
                      className="h-7 w-4 rounded-full shrink-0"
                    >
                      <Plus size={14} />
                    </Button>
                    <CircleX
                      size={30}
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 hover:bg-red-50 px-1 shrink-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Footer */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold mb-4">
          <span>Subtotal:</span>
          <span>Rs.{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleClearCart}
            variant="outline"
            className="w-full bg-[#FFFFFA] text-sm text-[#AF0000] border rounded-2xl border-[#AF0000] hover:border-[#00232A] hover:bg-[#00232A] hover:text-[#FFFFFA] cursor-pointer"
            disabled={cartItems.length === 0}
          >
            Clear Cart
          </Button>
          <Button
            onClick={handleCheckoutClick}
            className="w-full bg-[#AF0000] text-sm rounded-2xl hover:bg-[#730000] text-white cursor-pointer"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>

      {/* Checkout Dialog */}
      {showCheckoutDialog && (
        <CheckoutDialog
          cartItems={cartItems}
          totalAmount={totalAmount}
          onClose={() => setShowCheckoutDialog(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </div>
  );
};

export default CartSheet;
