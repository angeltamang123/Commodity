"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useState } from "react";
import LoginAlert from "./loginAlert";

export default function ProductCard({ product }) {
  const [loginDialog, setLoginDialog] = useState(false);
  const discount =
    ((product.price - product.discountPrice) / product.price) * 100;
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.user);
  const pathname = usePathname();

  const handleClick = () => {
    router.push("/products/" + product._id);
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      setLoginDialog(true);
      return;
    }
  };

  return (
    <div>
      <Card className="flex flex-col h-full cursor-pointer hover:shadow-sm hover:shadow-black">
        <CardContent
          onClick={handleClick}
          className="p-4 flex-grow flex-col relative overflow-hidden"
        >
          <div
            className={cn(
              "flex justify-between w-full",
              !product.isOnSale && "justify-end"
            )}
          >
            {product.isOnSale && (
              <div className="text-center border border-[#AF0000] rounded-lg  w-16 text-white font-sans text-xs bg-[#AF0000] z-1">
                <p>{Math.round(discount * 10) / 10}% Off</p>
              </div>
            )}
            {product.rating.average && (
              <div className="w-16 z-10">
                <div className="flex border w-auto justify-center border-[#AF0000] bg-[#AF0000] rounded-lg gap-1">
                  <Star className="text-[#AF0000] fill-yellow-500 size-4" />
                  <p className="text-xs text-white font-sans">
                    {Math.round(product?.rating?.average * 10) / 10} (
                    {product?.rating?.count})
                  </p>
                </div>
              </div>
            )}
          </div>
          <div
            className={`h-52 relative mx-auto mb-4 ${
              !product.rating.average && !product.isOnSale && "mt-5"
            }`}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.image}`}
              alt={product.name}
              className="object-contain rounded-md w-full"
              fill
            />
          </div>
          {product.status === "inactive" ? (
            product.stock === 0 ? (
              <div className="w-full bg-[#111B25] border-t-2 border-b-2 h-10 py-1 border-white text-white text-center z-20 left-0 absolute -mt-32">
                <p>Out Of Stock !!</p>
              </div>
            ) : (
              <div className="w-full bg-[#111B25] border-t-2 border-b-2 h-10 py-1 border-white text-white text-center z-20 left-0 absolute -mt-32">
                <p>Not Available !!</p>
              </div>
            )
          ) : null}
          <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
          {}
          {/* <p className="text-sm text-gray-600 mb-2">{product.description}</p> */}
          {!product.isOnSale ? (
            <p className="text-md font-bold">
              Rs.
              {product.price.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </p>
          ) : (
            <div className="flex justify-start gap-2">
              <p className="text-md font-bold line-through text-gray-700">
                Rs.
                {product.price.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p>|</p>
              <p className="text-md font-bold text-[#31c05f]">
                Rs.
                {product.discountPrice.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}
          {/* <p className="text-sm text-gray-600">Category: {product.category}</p> */}
          {product.status === "active" ? (
            <p className="text-sm ">Stock: {product.stock}</p>
          ) : (
            <p className="text-sm ">Product not Available</p>
          )}
        </CardContent>
        <CardFooter className="p-4 -mt-4 flex justify-center gap-2">
          <Button
            disabled={product.status === "inactive"}
            className="w-full bg-[#FFFFFA] text-[#AF0000] border-1 rounded-2xl border-[#AF0000] hover:border-[#00232A] hover:bg-[#00232A] hover:text-[#FFFFFA]"
          >
            Add to Cart
          </Button>
          <Button
            disabled={product.status === "inactive"}
            className="w-full bg-[#AF0000] rounded-2xl hover:bg-[#730000]"
            onClick={() => {
              handleBuyNow();
            }}
          >
            Buy now
          </Button>
        </CardFooter>
      </Card>
      <LoginAlert
        open={loginDialog}
        onOpenChange={setLoginDialog}
        from={pathname}
      />
    </div>
  );
}
