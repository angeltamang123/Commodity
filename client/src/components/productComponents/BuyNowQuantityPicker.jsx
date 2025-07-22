// components/QuantityPickerModal.js
"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const QuantityPickerModal = ({ product, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value) || value < 1) {
      value = 1;
    }
    value = Math.min(value, product.stock);

    setQuantity(value);
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirm = () => {
    onConfirm(quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xs mx-auto p-6 shadow-lg relative">
        {" "}
        <h2 className="text-xl font-bold mb-4 text-center">
          Select Quantity for <br /> {product.name}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          {" "}
          <Button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Minus size={16} />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityChange}
            min={1}
            max={product.stock}
            className="w-20 text-center text-lg font-semibold border-gray-300 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent 
            focus-visible:ring-transparent focus:ring-0 [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none
            [-moz-appearance:textfield]"
          />
          <Button
            onClick={handleIncrement}
            disabled={quantity >= product.stock}
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100" // Custom styles
          >
            <Plus size={16} />
          </Button>
        </div>
        <p className="text-sm text-gray-600 text-center mb-4">
          Available Stock: {product.stock}
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-4 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-[#AF0000] text-white hover:bg-[#730000]"
            disabled={quantity < 1 || quantity > product.stock}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuantityPickerModal;
