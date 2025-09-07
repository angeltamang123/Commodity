"use client";
import {
  Bell,
  Calendar,
  Home,
  Inbox,
  LayoutGrid,
  Lock,
  NotebookText,
  Package,
  Search,
  Settings,
  ShieldUser,
  User,
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

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import CommodityLogo from "./commodityLogo";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/reducerSlices/userSlice";

export function SettingsSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathName = usePathname();
  // Menu items.
  const items = [
    {
      title: "Profile",
      url: "/settings/profile",
      icon: User,
    },
    {
      title: "Password",
      url: "/settings/password",
      icon: Lock,
    },
    {
      title: "Admin",
      url: "/settings/admin",
      icon: ShieldUser,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className={cn("bg-[#111B25] overflow-clip")}>
        <div className="flex justify-between items-center mx-2">
          <Link href="/">
            <CommodityLogo className="text-[#730000] size-16" />
          </Link>
          <p className="text-white font-bold text-2xl mr-4">Settings</p>
        </div>
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
