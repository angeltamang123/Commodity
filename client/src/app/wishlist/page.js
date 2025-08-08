"use client";

import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productComponents/productList";
import { ProductPagination } from "@/components/productComponents/productPagination";
import api from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";

const fetchWishlistProducts = async (page, limit) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  const response = await api.get(`/products/wishlist?${params.toString()}`);
  return response.data;
};

export default function Wishlist() {
  const searchParams = useSearchParams();
  const page = searchParams?.page || "1";
  const limit = searchParams?.limit || "16";

  const { data, isLoading, error } = useQuery({
    queryKey: ["wishlist-products", page, limit],
    queryFn: () => fetchWishlistProducts(page, limit),
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <main>
        <CustomNavbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
          <p>Loading wishlist products...</p>
        </div>
      </main>
    );
  }

  if (error) {
    console.error(`Error fetching products from your Wishlist:`, error);
    return (
      <main>
        <CustomNavbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Wishlist
          </h2>
          <p className="text-muted-foreground">
            Failed to fetch products for your wishlist. Please try again later.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-sm text-gray-500 mt-2">
              Error: {error.message || "Unknown error"}
            </p>
          )}
        </div>
        <Footer />
      </main>
    );
  }

  const products = data?.data ?? [];
  const pagination = data?.pagination ?? { totalPages: 0 };

  return (
    <main>
      <CustomNavbar />
      <ProductList data={products} category={"wishlist"} />

      <div className="mt-8">
        <ProductPagination totalPages={pagination.totalPages} />
      </div>
      <Footer />
    </main>
  );
}
