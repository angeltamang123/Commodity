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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import CommodityLogo from "../commodityLogo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/reducerSlices/userSlice";

export function AdminSidebar() {
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
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
      url: "/admin/payments",
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
          "bg-[#111B25] overflow-clip",
          state === "collapsed" && "p-0"
        )}
      >
        {state !== "collapsed" ? (
          <div className="flex justify-between items-center mx-2">
            <Link
              href="/"
              className={cn(
                state !== "collapsed" &&
                  `flex justify-between items-center mx-2`
              )}
            >
              <CommodityLogo className="text-[#730000] size-16" />
            </Link>

            <SidebarTrigger className="text-white text-2xl" />
          </div>
        ) : (
          <CommodityLogo
            onClick={toggleSidebar}
            className="text-[#730000] cursor-pointer"
          />
        )}
      </SidebarHeader>
      <SidebarContent className="bg-[#111B25] text-white -mt-2 pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    pathName.includes(item.url) &&
                      `bg-[#730000] border-[#730000] rounded-md`
                  )}
                >
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
      <SidebarFooter className="bg-[#111B25]">
        <Button
          className="bg-[#730000] hover:bg-[#AF0000] hover:cursor-pointer"
          onClick={() => {
            router.push("/");
            setTimeout(() => {
              dispatch(logoutUser());
            }, 1000);
          }}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
