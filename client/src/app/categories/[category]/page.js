import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productComponents/productList";
import axios from "axios";
import { ProductPagination } from "@/components/productComponents/productPagination";
import Footer from "@/components/Footer";

const Category = async ({ params, searchParams }) => {
  params = await params;
  searchParams = await searchParams;
  const category = params?.category;
  const page = searchParams?.page || "1";
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products?category=${category}&page=${page}`
    );

    return (
      <main>
        <CustomNavbar />
        <ProductList data={data.products} category={category} />

        <div className="mt-8">
          <ProductPagination totalPages={data.pagination.totalPages} />
        </div>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error(
      `Error fetching products for category ${category}:`,
      error.message
    );
    return <div>Error loading products. Please try again later.</div>;
  }
};

export default Category;
