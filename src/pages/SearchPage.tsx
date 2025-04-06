
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "@/api/foodApi";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Filter } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["search", query, page],
    queryFn: () => searchProducts(query, page, PAGE_SIZE),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    setPage(1);
  }, [query]);

  const handleProductClick = (productCode: string) => {
    window.location.href = `/product/${productCode}`;
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (isError) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Search Results for: {query}</h1>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load search results</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Search Results for: {query}</h1>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
          </div>
        ) : data?.products?.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <ProductCard
                  key={product.code || product.id}
                  product={product}
                  onClick={() => handleProductClick(product.code)}
                />
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={loadMore}
                disabled={isFetching || !data.products.length || page >= data?.page_count}
                className="bg-food-green hover:bg-food-green/80"
              >
                {isFetching ? "Loading..." : "Load More"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="mb-4">No products found for: {query}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
