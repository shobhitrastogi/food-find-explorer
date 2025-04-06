
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold text-food-green">FoodFind</span>
            <span className="text-xl font-light ml-1">Explorer</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-end md:justify-center">
          <div className="w-full max-w-md relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-8"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {/* We'll add filters and other options here in future updates */}
        </div>
      </div>
    </header>
  );
};

export default Header;
