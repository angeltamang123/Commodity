import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex grow min-h-screen">
        <AdminSidebar />

        <div className="relative flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
