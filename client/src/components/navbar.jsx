"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  ChevronDown,
  Search,
  User,
  ShoppingCart,
  Phone,
  MapPin,
} from "lucide-react";
import CommodityLogo from "./commodityLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/reducerSlices/userSlice";
import { useEffect } from "react";

export default function CustomNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { phoneNumber, address } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <div className="max-w-screen overflow-hidden relative z-10">
      {/* Top Bar */}
      <div className="w-full bg-[#AF0000] text-[#FFFFFA] px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          {isLoggedIn && <Phone size={16} />}
          <span>{phoneNumber}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Get 50% Off on Selected Items</span>
          <Button
            size="xs"
            variant="bordered"
            className="text-[#FFFFFA] text-xs -p-2 h-7 border-white hover:bg-white/20"
          >
            Shop Now
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn && <MapPin size={16} />}
          <span>{address}</span>
        </div>
      </div>
      {/* Main Navbar */}
      <Navbar className="border-b flex w-full justify-between bg-[#FEFEFE] ">
        <NavbarBrand className="ml-4">
          <Link href="/" className="flex justify-start items-center gap-2">
            <CommodityLogo className="text-[#730000]" />
            <span className="font-bold text-xl text-[#AF0000]">Commodity</span>
          </Link>
        </NavbarBrand>

        <NavbarContent className="flex ml-56 justify-between gap-4">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  endContent={<ChevronDown size={16} />}
                  radius="sm"
                  variant="light"
                >
                  Categories
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Categories"
              className="w-[200px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem href="/categories/electronics">
                Electronics
              </DropdownItem>
              <DropdownItem href="/categories/clothing">Clothing</DropdownItem>
              <DropdownItem href="/categories/books">Books</DropdownItem>
              <DropdownItem href="/categories/sports">Sports</DropdownItem>
              <DropdownItem href="/categories/furniture">
                Furniture
              </DropdownItem>
              <DropdownItem href="/categories/other">Other</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem>
            <Link href="/deals" className="text-default-600">
              Deals
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/whats-new" className="text-default-600">
              What&apos;s New
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/delivery" className="text-default-600">
              Delivery
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="ml-16 gap-1">
          <NavbarItem className="lg:flex w-44 font-normal">
            <Input
              placeholder="Search Product"
              startContent={<Search />}
              type="search"
            />
          </NavbarItem>
          <NavbarItem>
            <Button
              className="text-default-600"
              href="/cart"
              as={Link}
              variant="light"
              startContent={<ShoppingCart size={20} />}
            >
              Cart
            </Button>
          </NavbarItem>
          {isLoggedIn ? (
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                    radius="sm"
                    startContent={<User size={20} />}
                    variant="light"
                  >
                    Account
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="Categories"
                className="w-[200px]"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                <DropdownItem href="/account">Settings</DropdownItem>
                <DropdownItem
                  onPress={() => {
                    dispatch(logoutUser());
                    window.location.reload();
                  }}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              disableRipple
              className="p-0 bg-transparent border-gray-400 data-[hover=true]:bg-transparent"
              radius="sm"
              onPress={() => {
                router.push("/login");
              }}
              variant="bordered"
            >
              Login
            </Button>
          )}
        </NavbarContent>
      </Navbar>
    </div>
  );
}
