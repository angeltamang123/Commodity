import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productList";
import axios from "axios";
import { ProductPagination } from "@/components/productPagination";

const page = async ({ searchParams }) => {
  const page = (await searchParams.page) || "1";

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}`
    );

    return (
      <main>
        <CustomNavbar />
        <ProductList data={data.products} />
        <div className="mt-8">
          <ProductPagination totalPages={data.pagination.totalPages} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }
};

export default page;
