// pages/cart.js (or a component within it)
"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CheckoutDialog from "@/components/productComponents/CheckoutDialog";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);

  // --- Mock Cart State ---
  // In a real app, this would come from Redux, Context, or local storage
  const [cartItems, setCartItems] = useState([
    { productId: "prod123", name: "iPhone 16 pro", price: 200000, quantity: 1 },
    {
      productId: "prod456",
      name: "iPhone 14 Covers",
      price: 1200,
      quantity: 2,
    },
  ]);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  // --- End Mock Cart State ---

  // Dummy user address (fetch from Redux/context in real app)
  const [userDeliveryAddress, setUserDeliveryAddress] = useState(null); // e.g., fetched from user profile

  const handleCheckoutClick = () => {
    setShowCheckout(true);
  };

  const handlePlaceOrder = async (items, deliveryAddress) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          cartItems: items, // This will be the cartItems array
          deliveryAddress: deliveryAddress,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Order Placed Successfully!");
      setShowCheckout(false);
      // Clear cart here after successful order
      setCartItems([]); // For mock, clear
      router.push("/my-orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Order Failed", {
        description:
          error.response?.data?.message ||
          "An error occurred while placing your order.",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-2"
            >
              <p className="font-semibold">
                {item.name} x {item.quantity}
              </p>
              <p>Rs.{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t-2">
            <span>Subtotal:</span>
            <span>Rs.{totalAmount}</span>
          </div>
          <Button
            onClick={handleCheckoutClick}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}

      {showCheckout && (
        <CheckoutDialog
          cartItems={cartItems}
          totalAmount={totalAmount}
          onClose={() => setShowCheckout(false)}
          onPlaceOrder={handlePlaceOrder}
          initialDeliveryAddress={userDeliveryAddress} // Pass user's existing address
        />
      )}
    </div>
  );
};

export default CartPage;
