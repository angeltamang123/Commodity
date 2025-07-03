import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex flex-grow min-h-screen">
        <AdminSidebar />

        <div className="relative flex-1">
          <div className="absolute top-4 left-4 z-100 ">
            <SidebarTrigger className="-ml-2 -mt-2" />
          </div>

          <div className="">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
