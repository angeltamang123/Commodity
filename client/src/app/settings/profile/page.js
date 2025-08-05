"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateUserDetails } from "@/redux/reducerSlices/userSlice";
import LocationPicker from "@/components/LocationPicker";
import api from "@/lib/axiosInstance";
import { toast } from "sonner";

const ProfilePage = () => {
  const user = useSelector((state) => state.persisted.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState({
    fullName: false,
    emailId: false,
    phoneNumber: false,
    gender: false,
    location: false,
  });

  const [inputValues, setInputValues] = useState({
    fullName: user.fullName,
    emailId: user.emailId,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
  });

  const [loading, setLoading] = useState(false);

  const userId = user.userId;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleUpdateField = async (fieldName, value) => {
    if (value === user[fieldName]) {
      setIsEditing({ ...isEditing, [fieldName]: false });
      return;
    }

    try {
      setLoading(true);
      const payload = { [fieldName]: value };
      console.log(payload);
      await api.patch(`/user/${userId}`, payload);

      dispatch(
        updateUserDetails({
          fieldName: fieldName,
          value: value,
        })
      );

      setIsEditing({ ...isEditing, [fieldName]: false });
      toast.success(`Update Success`);
    } catch (err) {
      toast.error(`Update Failed !!`, {
        description: `${err?.response?.data?.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelected = async (selectedLocation) => {
    try {
      setLoading(true);
      await api.patch(`/user/${userId}`, {
        location: selectedLocation,
      });

      dispatch(
        updateUserDetails({
          fieldName: "location",
          value: selectedLocation,
        })
      );

      setIsEditing({ ...isEditing, location: false });
      toast.success("Location updated");
    } catch (err) {
      toast.error(`Location update failed !!`, {
        description: `${err.response?.data?.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidPhoneNumber = (number) => {
    return /^\d{10}$/.test(number);
  };

  const renderField = (fieldName, label, type = "text") => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex-1 min-w-[150px]">
        <span className="font-bold text-gray-700">{label}</span>
      </div>
      <div className="flex-2 flex items-center w-full">
        {isEditing[fieldName] ? (
          <div className="flex items-center w-full space-x-2">
            <input
              type={type}
              name={fieldName}
              value={inputValues[fieldName] || ""}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateField(fieldName, inputValues[fieldName]);
                }
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={() =>
                handleUpdateField(fieldName, inputValues[fieldName])
              }
              // Disable button if phone number is not valid
              disabled={
                fieldName === "phoneNumber" &&
                !isValidPhoneNumber(inputValues.phoneNumber)
              }
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setIsEditing({ ...isEditing, [fieldName]: false });
                setInputValues({
                  ...inputValues,
                  [fieldName]: user[fieldName],
                });
              }}
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1 text-gray-800">
              {user[fieldName] || `Add ${label}`}
            </span>
            <Button
              onClick={() => setIsEditing({ ...isEditing, [fieldName]: true })}
              variant="link"
              className="ml-4 p-0 h-auto"
            >
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) return <p className="text-center mt-8">Loading profile...</p>;

  return (
    <div className="w-full h-full mx-auto px-8 pt-20 p-5 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold border-b-2 pb-4 mb-6 text-gray-800">
        Profile
      </h1>
      {renderField("fullName", "Full name")}
      {renderField("emailId", "Contact email")}
      {renderField("phoneNumber", "Phone Number", "tel")}

      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex-1 min-w-[150px]">
          <span className="font-bold text-gray-700">Gender</span>
        </div>
        <div className="flex-2 flex items-center w-full">
          {isEditing.gender ? (
            <div className="flex items-center w-full space-x-2">
              <Select
                value={inputValues.gender}
                onValueChange={(value) =>
                  setInputValues({ ...inputValues, gender: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleUpdateField("gender", inputValues.gender)}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsEditing({ ...isEditing, gender: false });
                  setInputValues({ ...inputValues, gender: user.gender });
                }}
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-gray-800">
                {user.gender || "Add Gender"}
              </span>
              <Button
                onClick={() => setIsEditing({ ...isEditing, gender: true })}
                variant="link"
                className="ml-4 p-0 h-auto"
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex-1 min-w-[150px]">
          <span className="font-bold text-gray-700">Location</span>
        </div>
        <div className="flex-2 flex items-center w-full">
          {isEditing.location ? (
            <div className="flex-1 flex items-center justify-end space-x-2">
              <Button
                onClick={() => setIsEditing({ ...isEditing, location: false })}
                variant="destructive"
              >
                Cancel
              </Button>
              <LocationPicker
                onConfirm={handleLocationSelected}
                onCancel={() => setIsEditing({ ...isEditing, location: false })}
                apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_KEY}
                initialPosition={
                  user.location?.coordinates
                    ? [
                        user.location.coordinates.lat,
                        user.location.coordinates.lon,
                      ]
                    : undefined
                }
              />
            </div>
          ) : (
            <>
              <div className="flex-1 flex flex-col">
                <span className="text-gray-800">
                  {user.location?.formattedAddress || "No location set"}
                </span>
              </div>
              <Button
                onClick={() => setIsEditing({ ...isEditing, location: true })}
                variant="link"
                className="ml-4 p-0 h-auto"
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
