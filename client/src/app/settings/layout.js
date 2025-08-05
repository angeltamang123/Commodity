import { SettingsSidebar } from "@/components/SettingsSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex grow min-h-screen">
        <SettingsSidebar />

        <div className="relative flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
