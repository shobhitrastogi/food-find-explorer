
import { Card, CardContent } from "@/components/ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden">
      <div className="h-40 bg-muted skeleton"></div>
      <CardContent className="p-4">
        <div className="skeleton h-6 w-3/4 mb-2"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="mt-2">
          <div className="skeleton h-3 w-1/3 mb-1"></div>
          <div className="skeleton h-3 w-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
