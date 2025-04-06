
import { toast } from "sonner";

export interface Product {
  id: string;
  code: string;
  product_name: string;
  image_url: string;
  image_small_url: string;
  categories: string;
  categories_tags: string[];
  ingredients_text: string;
  nutrition_grades: string;
  nutriments: {
    energy_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    sugars_100g?: number;
    [key: string]: any;
  };
  nutrient_levels: Record<string, string>;
  labels: string;
  labels_tags: string[];
}

export interface ProductsResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
}

const BASE_URL = "https://world.openfoodfacts.org";

export const fetchProducts = async (page: number = 1, pageSize: number = 24): Promise<ProductsResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v2/search?fields=code,product_name,image_url,image_small_url,categories,categories_tags,ingredients_text,nutrition_grades,nutriments,nutrient_levels,labels,labels_tags&page=${page}&page_size=${pageSize}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status}`, { cause: errorData });
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products. Please try again later.");
    throw error;
  }
};

export const searchProducts = async (query: string, page: number = 1, pageSize: number = 24): Promise<ProductsResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&page=${page}&page_size=${pageSize}&json=true`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status}`, { cause: errorData });
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching products:", error);
    toast.error("Failed to search products. Please try again later.");
    throw error;
  }
};

export const getProductByBarcode = async (barcode: string): Promise<{ product: Product }> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
    
    if (!response.ok) {
      const errorMessage = response.status === 404
        ? `Product with barcode ${barcode} not found`
        : `API error: ${response.status}`;
        
      throw new Error(errorMessage, { cause: { status: response.status } });
    }
    
    const data = await response.json();
    
    if (!data.product || Object.keys(data.product).length === 0) {
      throw new Error(`Product with barcode ${barcode} not found`, { cause: { status: 404 } });
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    
    // Only show toast for non-404 errors
    if ((error as any)?.cause?.status !== 404) {
      toast.error("Failed to load product details. Please try again later.");
    }
    
    throw error;
  }
};
