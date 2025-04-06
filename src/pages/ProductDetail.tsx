
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductByBarcode } from "@/api/foodApi";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

const NutritionGradeBadge = ({ grade }: { grade: string }) => {
  if (!grade) return null;
  
  const formattedGrade = grade.toUpperCase();
  const getBadgeColor = () => {
    switch (formattedGrade) {
      case 'A': return 'bg-green-500 hover:bg-green-600';
      case 'B': return 'bg-lime-500 hover:bg-lime-600';
      case 'C': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'D': return 'bg-orange-500 hover:bg-orange-600';
      case 'E': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  return (
    <Badge className={`text-white ${getBadgeColor()} text-lg px-3 py-1`}>
      {formattedGrade}
    </Badge>
  );
};

const ProductDetail = () => {
  const { barcode } = useParams<{ barcode: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => getProductByBarcode(barcode!),
    enabled: !!barcode,
  });

  const product = data?.product;

  // Go back to previous page
  const handleGoBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
          <Loader className="animate-spin h-12 w-12 text-food-green" />
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load product details</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Extract nutrition data
  const nutriments = product.nutriments || {};
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          &larr; Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Card className="overflow-hidden">
              <div className="relative h-80 bg-white flex items-center justify-center p-4">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.product_name || "Product Image"}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h1 className="text-3xl font-bold mb-2 md:mb-0">{product.product_name || "Unknown Product"}</h1>
              {product.nutrition_grades && (
                <div className="flex items-center gap-3">
                  <span className="text-sm">Nutrition Grade:</span>
                  <NutritionGradeBadge grade={product.nutrition_grades} />
                </div>
              )}
            </div>
            
            {product.categories && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.split(',').map((category, i) => (
                    <Badge key={i} variant="outline" className="text-sm">
                      {category.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Separator className="my-6" />
            
            {product.ingredients_text && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <p className="text-muted-foreground">{product.ingredients_text}</p>
              </div>
            )}
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Nutrition Facts (per 100g)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Energy</div>
                  <div className="font-medium">{nutriments.energy_100g || 0} kcal</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Fat</div>
                  <div className="font-medium">{nutriments.fat_100g || 0} g</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Carbs</div>
                  <div className="font-medium">{nutriments.carbohydrates_100g || 0} g</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Sugars</div>
                  <div className="font-medium">{nutriments.sugars_100g || 0} g</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Proteins</div>
                  <div className="font-medium">{nutriments.proteins_100g || 0} g</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Salt</div>
                  <div className="font-medium">{nutriments.salt_100g || 0} g</div>
                </div>
              </div>
            </div>
            
            {product.labels && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {product.labels.split(',').map((label, i) => (
                    <Badge key={i} className="bg-food-green hover:bg-food-green/80">
                      {label.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm text-muted-foreground">Product Code</h3>
              <div>{product.code || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
