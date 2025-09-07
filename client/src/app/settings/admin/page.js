"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const AdminAccess = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useSelector((state) => state.persisted.user);
  const fetchUserRole = async () => {
    const { data } = await axios.get("/api/user/role");
    return data.role;
  };

  const { data: role, isLoading } = useQuery({
    queryKey: ["userRole"],
    queryFn: fetchUserRole,
    enabled: isLoggedIn,
  });

  const handleRoleChange = async (checked) => {
    try {
      const role = await api.post("/user/change-role", {
        role: checked ? "admin" : "user",
      });
      if (role) {
        toast.success(`${role?.data?.message}`);
        queryClient.invalidateQueries({ queryKey: ["userRole"] });
      }
    } catch (error) {
      toast.error(`${error.response?.data?.message}` || "Something went wrong");
    }
  };

  if (!isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex gap-4 p-10 items-center border-black border-3 shadow-xl rounded-2xl">
          <Switch
            checked={role === "admin"}
            onCheckedChange={handleRoleChange}
            id="admin"
          />
          <Label htmlFor="admin">Make user Admin</Label>
        </div>
      </div>
    );
  }
};

export default AdminAccess;
