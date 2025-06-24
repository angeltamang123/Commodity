import { AdminSidebar } from "@/components/admin-sidebar";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <body>
      <SidebarProvider>
        <AdminSidebar />
        <div>
          <SidebarTrigger className="text-black size-10" />
          {children}
        </div>
      </SidebarProvider>
    </body>
  );
};

export default AdminLayout;
