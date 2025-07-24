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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CommodityLogo from "./commodityLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/reducerSlices/userSlice";
import { useEffect } from "react";
import { SearchBar } from "./search/searchBar";
import CartSheet from "./productComponents/CartSheet";

export default function CustomNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();

  const { isLoggedIn, phoneNumber, location } = useSelector(
    (state) => state.persisted.user
  );

  const totalCartQuantity = useSelector((state) => state.cart.totalQuantity);

  return (
    <div className="max-w-screen overflow-visible relative z-10">
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
          {isLoggedIn && (location?.suburb || location?.city) && (
            <MapPin size={16} />
          )}
          <span>{location?.suburb || location?.city}</span>
        </div>
      </div>
      {/* Main Navbar */}
      <Navbar className="border-b flex w-full justify-between overflow-visible bg-[#FEFEFE] ">
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
              <DropdownItem href="/categories/Electronics">
                Electronics
              </DropdownItem>
              <DropdownItem href="/categories/Clothing">Clothing</DropdownItem>
              <DropdownItem href="/categories/Books">Books</DropdownItem>
              <DropdownItem href="/categories/Sports">Sports</DropdownItem>
              <DropdownItem href="/categories/Furnitures">
                Furnitures
              </DropdownItem>
              <DropdownItem href="/categories/Others">Others</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem>
            <Link href="/deals" className="text-default-600">
              Deals
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/latest" className="text-default-600">
              What&apos;s New
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/delivery" className="text-default-600">
              Delivery
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className={`ml-16 ${isLoggedIn ? "gap-1" : "gap-4"}`}>
          <NavbarItem className="lg:flex w-64 font-normal">
            <SearchBar />
          </NavbarItem>
          <NavbarItem className="ml-12">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className={`text-default-600 overflow-visible cursor-pointer ${
                    !isLoggedIn && "hidden"
                  }`}
                  variant="light"
                  startContent={<ShoppingCart size={22} />}
                >
                  Cart
                  {totalCartQuantity > 0 && (
                    <span className="absolute -top-1 left-5 bg-[#AF0000] text-white text-xs rounded-4xl h-4.5 w-5 flex items-center justify-center">
                      {totalCartQuantity}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Shopping Cart</SheetTitle>
                  <SheetDescription>
                    Review your items before checkout.
                  </SheetDescription>
                </SheetHeader>
                <CartSheet />
              </SheetContent>
            </Sheet>
          </NavbarItem>
          {isLoggedIn ? (
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent cursor-pointer"
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
              className="p-0 -ml-16 bg-transparent border-1 rounded-md w-56 border-[#730000] text-[#730000] data-[hover=true]:bg-transparent cursor-pointer"
              radius="sm"
              onPress={() => {
                if (pathName === "/") {
                  router.push("/login");
                } else {
                  router.push(`/login?from=${pathName}`);
                }
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
