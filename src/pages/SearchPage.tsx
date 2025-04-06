
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { searchProducts, Product } from "@/api/foodApi";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProductFilters, { FilterOptions } from "@/components/ProductFilters";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;
  
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    nutritionGrades: [],
    maxSugar: 100,
    maxFat: 100,
    sortBy: "name",
    sortOrder: "asc"
  });

  const {
    data,
    isLoading,
    isFetching,
    isError,
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

  const availableCategories = useMemo(() => {
    if (!data?.products) return [];
    
    const categoriesSet = new Set<string>();
    
    data.products.forEach(product => {
      if (product.categories_tags) {
        product.categories_tags.forEach(category => {
          // Clean up category name
          const cleanCategory = category
            .replace('en:', '')
            .replace('fr:', '')
            .replace(/-/g, ' ')
            .split(':')
            .pop();
          
          if (cleanCategory) {
            categoriesSet.add(cleanCategory);
          }
        });
      }
    });
    
    return Array.from(categoriesSet);
  }, [data?.products]);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let filtered = [...data.products];
    
    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => {
        const productCategories = product.categories_tags || [];
        return filters.categories.some(category => 
          productCategories.some(pc => pc.includes(category.toLowerCase().replace(' ', '-')))
        );
      });
    }
    
    // Apply nutrition grade filter
    if (filters.nutritionGrades.length > 0) {
      filtered = filtered.filter(product => 
        filters.nutritionGrades.includes(product.nutrition_grades?.toUpperCase() || '')
      );
    }
    
    // Apply sugar content filter
    filtered = filtered.filter(product => {
      const sugarContent = product.nutriments?.sugars_100g || 0;
      return sugarContent <= filters.maxSugar;
    });
    
    // Apply fat content filter
    filtered = filtered.filter(product => {
      const fatContent = product.nutriments?.fat_100g || 0;
      return fatContent <= filters.maxFat;
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? (a.product_name || '').localeCompare(b.product_name || '')
          : (b.product_name || '').localeCompare(a.product_name || '');
      }
      
      if (filters.sortBy === 'grade') {
        return filters.sortOrder === 'asc' 
          ? (a.nutrition_grades || 'z').localeCompare(b.nutrition_grades || 'z')
          : (b.nutrition_grades || 'z').localeCompare(a.nutrition_grades || 'z');
      }
      
      if (filters.sortBy === 'calories') {
        const aCalories = a.nutriments?.energy_100g || 0;
        const bCalories = b.nutriments?.energy_100g || 0;
        return filters.sortOrder === 'asc' 
          ? aCalories - bCalories
          : bCalories - aCalories;
      }
      
      return 0;
    });
    
    return filtered;
  }, [data?.products, filters]);

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
          <ProductFilters 
            availableCategories={availableCategories} 
            onChange={setFilters}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
          </div>
        ) : filteredProducts.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
