"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import ProductDetail from "@/components/productComponents/productDetails";
import CustomNavbar from "@/components/navbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/products/${productId}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2Icon className="h-8 w-8 animate-spin text-gray-700" />
        <span className="ml-2 text-gray-700">Loading product details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div>
      <CustomNavbar />
      <div className="border-b-2 border-gray-200">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
