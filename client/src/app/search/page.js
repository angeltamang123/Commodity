import { FilterSidebar } from "@/components/filter-sidebar";
import CustomNavbar from "@/components/navbar";
import ProductCard from "@/components/ProductCard";
import { ProductPagination } from "@/components/productPagination";
import axios from "axios";

export default async function SearchPage({ searchParams }) {
  searchParams = await searchParams;
  const { q, maxPrice, minPrice, category, hasDiscount } = searchParams;
  const page = searchParams?.page || "1";
  const limit = searchParams?.limit || "6";

  const queryParts = [];
  if (q) queryParts.push(`q=${encodeURIComponent(q)}`);
  if (minPrice && minPrice !== "0")
    queryParts.push(`minPrice=${encodeURIComponent(minPrice)}`);
  if (maxPrice && maxPrice !== "10000000")
    queryParts.push(`maxPrice=${encodeURIComponent(maxPrice)}`);
  if (category && category !== "all")
    queryParts.push(`category=${encodeURIComponent(category)}`);
  if (hasDiscount === "true")
    queryParts.push(`hasDiscount=${encodeURIComponent(hasDiscount)}`);
  queryParts.push(`page=${encodeURIComponent(page)}`);
  queryParts.push(`limit=${encodeURIComponent(limit)}`);

  const queryString = queryParts.join("&");
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products${
    queryString ? `?${queryString}` : ""
  }`;

  const filterKey = JSON.stringify({
    q: searchParams.q || "",
    category: searchParams.category || "all",
    minPrice: searchParams.minPrice || "0",
    maxPrice: searchParams.maxPrice || "10000000",
    category: searchParams.category || "all",
    hasDiscount: searchParams.hasDiscount || "false",
    page: searchParams.page || "1",
    limit: searchParams.limit || "6",
  });

  try {
    const { data } = await axios.get(apiUrl);
    return (
      <div>
        <CustomNavbar />
        <div className="container mx-auto px-4 py-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Search Results {q && `for "${q}"`}
            </h1>
            <p className="text-muted-foreground">
              {data.pagination.totalProducts || 0} products found.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <FilterSidebar
                key={filterKey}
                initialSearchParams={searchParams}
              />
            </aside>
            {/* Main Content */}
            <main className="lg:col-span-3">
              {data.products.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.products.map((product) => (
                      <ProductCard
                        id={product._id}
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>
                  <ProductPagination totalPages={data.pagination.totalPages} />
                </div>
              ) : (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold">No Products Found</h2>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    return <div>Failed to fetch search results. Please try again later.</div>;
  }
}
