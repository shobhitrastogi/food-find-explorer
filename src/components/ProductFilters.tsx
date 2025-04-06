
import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type FilterOptions = {
  categories: string[];
  nutritionGrades: string[];
  maxSugar: number;
  maxFat: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

interface ProductFiltersProps {
  availableCategories: string[];
  onChange: (filters: FilterOptions) => void;
}

const ProductFilters = ({ availableCategories, onChange }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [maxSugar, setMaxSugar] = useState<number>(100);
  const [maxFat, setMaxFat] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Update parent component when filters change
  useEffect(() => {
    onChange({
      categories: selectedCategories,
      nutritionGrades: selectedGrades,
      maxSugar,
      maxFat,
      sortBy,
      sortOrder,
    });
  }, [selectedCategories, selectedGrades, maxSugar, maxFat, sortBy, sortOrder, onChange]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleGradeToggle = (grade: string) => {
    setSelectedGrades(prev => 
      prev.includes(grade) 
        ? prev.filter(g => g !== grade) 
        : [...prev, grade]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedGrades([]);
    setMaxSugar(100);
    setMaxFat(100);
    setSortBy("name");
    setSortOrder("asc");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Filters
          {(selectedCategories.length > 0 || selectedGrades.length > 0) && (
            <Badge className="ml-1 bg-food-green text-xs">
              {selectedCategories.length + selectedGrades.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Sort</h3>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="sort-by" className="mb-2 block">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Product Name</SelectItem>
                    <SelectItem value="grade">Nutrition Grade</SelectItem>
                    <SelectItem value="calories">Calories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <Label htmlFor="sort-order" className="mb-2 block">Order</Label>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                  <SelectTrigger id="sort-order">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending (A-Z)</SelectItem>
                    <SelectItem value="desc">Descending (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
              {availableCategories.map((category, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${i}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={`category-${i}`} className="text-sm">{category}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Nutrition Grade</h3>
            <div className="flex flex-wrap gap-3">
              {["A", "B", "C", "D", "E"].map((grade) => (
                <div key={grade} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`grade-${grade}`} 
                    checked={selectedGrades.includes(grade)}
                    onCheckedChange={() => handleGradeToggle(grade)}
                  />
                  <Label htmlFor={`grade-${grade}`} className="text-sm">Grade {grade}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Sugar Content (per 100g)</h3>
            <div className="px-2">
              <Slider 
                value={[maxSugar]} 
                onValueChange={values => setMaxSugar(values[0])}
                max={100}
                step={1}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0g</span>
                <span>Max: {maxSugar}g</span>
                <span>100g</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Fat Content (per 100g)</h3>
            <div className="px-2">
              <Slider 
                value={[maxFat]} 
                onValueChange={values => setMaxFat(values[0])}
                max={100}
                step={1}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>0g</span>
                <span>Max: {maxFat}g</span>
                <span>100g</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
            <Button onClick={() => setIsOpen(false)} className="bg-food-green hover:bg-food-green/80">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductFilters;
