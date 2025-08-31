import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productComponents/productList";
import axios from "axios";
import { ProductPagination } from "@/components/productComponents/productPagination";
import Footer from "@/components/Footer";

const page = async ({ searchParams }) => {
  searchParams = await searchParams;
  const page = searchParams?.page || "1";

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/products?page=${page}`
    );

    return (
      <main>
        <CustomNavbar />
        <ProductList data={data.products} />
        <div className="mt-1">
          <ProductPagination totalPages={data.pagination.totalPages} />
        </div>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }
};

export default page;
