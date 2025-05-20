"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  const handleClick = () => {
    router.push("/products/" + product._id);
  };
  return (
    <Card onClick={handleClick} className="flex flex-col h-full">
      <CardContent className="p-4 flex-grow">
        <div className="aspect-square relative mb-4">
          <Image
            src={"http://localhost:7000/uploads/" + product.image}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        {}
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Category: {product.category}</p>
        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
