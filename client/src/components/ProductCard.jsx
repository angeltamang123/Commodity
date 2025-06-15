"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
  const discount =
    ((product.price - product.discountPrice) / product.price) * 100;
  const router = useRouter();
  const handleClick = () => {
    router.push("/products/" + product._id);
  };
  return (
    <Card
      onClick={handleClick}
      className="flex flex-col h-full cursor-pointer "
    >
      <CardContent className="p-4 flex-grow flex-col relative overflow-hidden">
        {product.discountPrice && (
          <div className="text-center absolute w-32 -ml-14 text-xs bg-[#31c05f] rotate-[-45deg] z-10">
            <p>{Math.round(discount * 10) / 10}% Off</p>
          </div>
        )}
        <div className="absolute w-full -mt-3 items-center z-10">
          <div className="flex gap-1 translate-x-[72%]">
            <Star className="text-yellow-500 fill-yellow-500 size-4" />
            <p className="text-xs font-sans">
              {Math.round(product.rating * 10) / 10}
            </p>
          </div>
        </div>
        <div className="h-52 relative mx-auto mb-4">
          <Image
            src={"http://localhost:7000/uploads/" + product.image}
            alt={product.name}
            className="object-contain rounded-md w-full"
            fill
          />
        </div>
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        {}
        {/* <p className="text-sm text-gray-600 mb-2">{product.description}</p> */}
        {!product.discountPrice ? (
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
        <p className="text-sm ">Stock: {product.stock}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-center gap-2">
        <Button className="w-full bg-[#FFFFFA] text-[#AF0000] border-1 rounded-2xl border-[#AF0000] hover:border-[#00232A] hover:bg-[#00232A] hover:text-[#FFFFFA]">
          Add to Cart
        </Button>
        <Button className="w-full bg-[#AF0000] rounded-2xl hover:bg-[#730000]">
          Buy now
        </Button>
      </CardFooter>
    </Card>
  );
}
