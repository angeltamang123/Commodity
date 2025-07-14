import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productList";
import axios from "axios";
import { ProductPagination } from "@/components/productPagination";

const New = async ({ searchParams }) => {
  const page = searchParams.page;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products?latest=true&page=${page}`
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

export default New;
