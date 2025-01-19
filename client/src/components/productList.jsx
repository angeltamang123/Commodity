import axios from 'axios'
import ProductCard from './ProductCard'

const ProductList = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)

  return (
    (<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>)
  );
}

export default ProductList

