
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, Product } from "@/api/foodApi";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Button } from "@/components/ui/button";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page, PAGE_SIZE),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product);
    // In the future, this will navigate to the product detail page
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 mb-4">Failed to load products</p>
        <Button onClick={() => setPage(1)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => <ProductCardSkeleton key={index} />)
          : data?.products.map((product) => (
              <ProductCard
                key={product.code || product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
      </div>
      
      {data && (
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={loadMore}
            disabled={isFetching || !data?.products.length || page >= data?.page_count}
            className="bg-food-green hover:bg-food-green/80"
          >
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
