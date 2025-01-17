import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const AdminLayout = ({children}) => {
  return (
    <SidebarProvider>
    <Sidebar />
    <div>
      <SidebarTrigger />
     {children}
    </div>
  </SidebarProvider>
  )
}

export default AdminLayout