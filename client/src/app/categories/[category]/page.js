import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productList";
import axios from "axios";

const Category = async ({ params }) => {
  const { category } = await params;
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products?category=${category}`
  );
  return (
    <div className="max-w-screen overflow-hidden">
      <CustomNavbar />
      <ProductList data={data} category={category} />
    </div>
  );
};

export default Category;
