import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productList";

const page = () => {
  return (
    <div className="max-w-screen overflow-hidden">
      <CustomNavbar />
      <ProductList />
    </div>
  );
};

export default page;
