
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/api/foodApi";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const NutritionGradeBadge = ({ grade }: { grade: string }) => {
  if (!grade) return null;
  
  const formattedGrade = grade.toUpperCase();
  
  return (
    <div className={`nutrition-badge nutrition-${formattedGrade.toLowerCase()}`}>
      {formattedGrade}
    </div>
  );
};

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  // Fallback image if product image is not available
  const imageUrl = product.image_url || product.image_small_url || "/placeholder.svg";
  
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "No information available";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card 
      className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-40 bg-muted">
        <img
          src={imageUrl}
          alt={product.product_name || "Product Image"}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        {product.nutrition_grades && (
          <div className="absolute top-2 right-2">
            <NutritionGradeBadge grade={product.nutrition_grades} />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-1">
          {product.product_name || "Unknown Product"}
        </h3>
        {product.categories && (
          <p className="text-muted-foreground text-sm mb-2">
            {truncateText(product.categories, 60)}
          </p>
        )}
        {product.ingredients_text && (
          <div className="mt-2">
            <span className="text-xs font-medium block mb-1">Ingredients:</span>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.ingredients_text}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
