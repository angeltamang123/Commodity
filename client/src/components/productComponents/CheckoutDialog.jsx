"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MapPin } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const locationSchema = Yup.object().shape({
  formattedAddress: Yup.string().required("Formatted address is required"),
  name: Yup.string().nullable(),
  street: Yup.string().nullable(),
  suburb: Yup.string().nullable(),
  district: Yup.string().nullable(),
  city: Yup.string().required("City is required"),
  county: Yup.string().nullable(),
  state: Yup.string().nullable(),
  country: Yup.string().required("Country is required"),
  postcode: Yup.string().nullable(),
  coordinates: Yup.object()
    .shape({
      lat: Yup.number().required("Latitude is required"),
      lon: Yup.number().required("Longitude is required"),
    })
    .required("Coordinates are required"),
  result_type: Yup.string().nullable(),
  place_id: Yup.string().nullable(),
});

const checkoutValidationSchema = Yup.object().shape({
  deliveryAddress: locationSchema.required("Please select a delivery address."),
});

const CheckoutDialog = ({ cartItems, totalAmount, onClose, onPlaceOrder }) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectDefaultLocation, setSelectDefaultLocation] = useState(false);
  const { location, isLoggedIn } = useSelector((state) => state.persisted.user);

  const formik = useFormik({
    initialValues: {
      deliveryAddress: null,
    },
    validationSchema: checkoutValidationSchema,
    onSubmit: async (values) => {
      onPlaceOrder(cartItems, values.deliveryAddress);
    },
  });

  const handleLocationSelected = (locationData) => {
    formik.setFieldValue("deliveryAddress", locationData);
    formik.setFieldTouched("deliveryAddress", true, false);
    setShowLocationPicker(false);
  };

  const handleSelectDefault = (checked) => {
    if (checked) {
      formik.setFieldValue("deliveryAddress", location);
      formik.setFieldTouched("deliveryAddress", true, false);
    } else {
      formik.setFieldValue("deliveryAddress", null);
    }
    setSelectDefaultLocation(checked);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>

        {/* Order Summary */}
        <div className="mb-4 max-h-40 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Items:</h3>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm text-gray-700"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>Rs.{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>Total:</span>
            <span>Rs.{totalAmount}</span>
          </div>
        </div>

        {/* Delivery Address Section */}
        <div className="mb-4">
          <label className="flex gap-2 items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin className="size-5" />
            Delivery Address
          </label>
          <Button
            onClick={() => setShowLocationPicker(true)}
            className={`w-full px-4 py-6 border rounded-xl shadow-sm text-left whitespace-normal break-words justify-start
              ${
                formik.touched.deliveryAddress && formik.errors.deliveryAddress
                  ? "border-red-500 bg-red-50 text-red-800"
                  : "border-gray-300 bg-white"
              }
            `}
            variant="bordered"
          >
            {formik.values.deliveryAddress?.formattedAddress ||
              "Select delivery location"}
          </Button>
          {formik.touched.deliveryAddress &&
            typeof formik.errors.deliveryAddress === "string" && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.deliveryAddress}
              </p>
            )}
          {isLoggedIn && location?.formattedAddress && (
            <div className="flex items-center gap-3 mt-2">
              <Checkbox
                id="terms"
                checked={selectDefaultLocation}
                onCheckedChange={(checked) => {
                  handleSelectDefault(checked);
                }}
              />
              <Label htmlFor="terms">Use your default location</Label>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={formik.handleSubmit}
            color="primary"
            className="px-6 py-2 rounded-lg bg-[#AF0000] text-white hover:bg-[#730000]"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </div>

        {/* Location Picker Modal */}
        {showLocationPicker && (
          <LocationPicker
            onConfirm={handleLocationSelected}
            onCancel={() => setShowLocationPicker(false)}
            apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_KEY}
            initialPosition={
              formik.values.deliveryAddress?.coordinates
                ? [
                    formik.values.deliveryAddress.coordinates.lat,
                    formik.values.deliveryAddress.coordinates.lon,
                  ]
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutDialog;
