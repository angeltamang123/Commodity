"use client";
import {
  Bell,
  Calendar,
  Home,
  Inbox,
  LayoutGrid,
  NotebookText,
  Package,
  Search,
  Settings,
  WalletCards,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import CommodityLogo from "./commodityLogo";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutGrid,
    },
    {
      title: "Inventory",
      url: "/admin/inventory",
      icon: Package,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: NotebookText,
    },
    {
      title: "Payments",
      url: "#",
      icon: WalletCards,
    },
  ];

  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          "bg-[#A1040B] overflow-clip",
          state === "collapsed" && "p-0"
        )}
      >
        <Link
          href="/"
          className={cn(
            state !== "collapsed" && `flex justify-between items-center mx-2`
          )}
        >
          <CommodityLogo className="text-[#730000]" />
          <span
            className={cn(
              `font-bold text-xl text-black`,
              state === "collapsed" && `hidden`
            )}
          >
            Commodity
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-[#111B25] text-white pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/admin/notifications"}>
                    <Bell />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
