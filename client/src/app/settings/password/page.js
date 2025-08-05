"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/axiosInstance";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChangePasswordPage = () => {
  const user = useSelector((state) => state.persisted.user);
  const userId = user.userId;

  const [step, setStep] = useState("check-password");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckPassword = async () => {
    if (!currentPassword) {
      return toast.error("Please enter your current password.");
    }
    setLoading(true);
    setError("");

    try {
      const payload = { password: currentPassword };
      await api.post(`/user/check-password`, payload);
      setStep("change-password");
      toast.success("Password verified. Please enter your new password.");
      setCurrentPassword("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Incorrect password. Please try again.";
      setError(errorMessage);
      toast.error("Verification Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill in both new password fields.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New password and confirm password do not match.");
    }
    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        newPassword: newPassword,
      };
      await api.post(`/user/change-password`, payload);

      setStep("check-password");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to change password.";
      setError(errorMessage);
      toast.error("Update Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-150 h-fit mx-auto p-5 bg-white shadow-lg -mt-16 rounded-xl">
        <h1 className="text-2xl font-bold border-b-2 pb-4 mb-6 text-gray-800">
          Change Password
        </h1>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {step === "check-password" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCheckPassword();
                }
              }}
            />
            <Button
              onClick={handleCheckPassword}
              disabled={loading}
              className="w-full bg-[#AF0000] hover:bg-[#730000]"
            >
              {loading ? "Verifying..." : "Verify Password"}
            </Button>
          </div>
        )}
        {step === "change-password" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Enter new password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-[#AF0000] hover:bg-[#730000]"
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordPage;
