import React from "react";
import CustomNavbar from "@/components/navbar";
import ProductList from "@/components/productList";
import axios from "axios";

const page = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products`
  );
  return (
    <div className="max-w-screen overflow-hidden">
      <CustomNavbar />
      <ProductList data={data} />
    </div>
  );
};

export default page;
