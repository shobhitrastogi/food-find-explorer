
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import BarcodeSearch from "@/components/BarcodeSearch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-food-green">
            <img src="/placeholder.svg" alt="Logo" className="w-8 h-8" />
            <span>Food Explorer</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-4">
          <Tabs defaultValue="name">
            <TabsList className="mb-4">
              <TabsTrigger value="name">Search by Name</TabsTrigger>
              <TabsTrigger value="barcode">Search by Barcode</TabsTrigger>
            </TabsList>
            <TabsContent value="name">
              <form onSubmit={handleSearch} className="flex w-full gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search for food products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </TabsContent>
            <TabsContent value="barcode">
              <BarcodeSearch />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </header>
  );
};

export default Header;
