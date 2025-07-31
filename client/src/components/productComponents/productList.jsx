import ProductCard from "./ProductCard";

const ProductList = ({ data, category }) => {
  const categories = {
    Electronics: "Electronics",
    Clothing: "Clothing",
    Books: "Books",
    Sports: "Sports",
    Furnitures: "Furnitures",
    Others: "Others",
    new: "What's New",
    hot: "Hot Deals",
  };
  return (
    <div className="container w-full mx-auto px-4 py-8">
      {!category ? (
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      ) : (
        <h1 className="text-3xl font-bold mb-8">{categories[category]}</h1>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.map((product) => (
          <ProductCard id={product._id} key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
