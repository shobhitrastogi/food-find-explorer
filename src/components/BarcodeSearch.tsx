
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Barcode } from "lucide-react";
import { toast } from "sonner";

const BarcodeSearch = () => {
  const [barcode, setBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcode.trim()) {
      toast.error("Please enter a barcode");
      return;
    }

    setIsLoading(true);
    
    // Validate barcode format (simple validation)
    const barcodeRegex = /^[0-9]{8,13}$/;
    if (!barcodeRegex.test(barcode)) {
      toast.error("Invalid barcode format. Please enter a valid EAN/UPC barcode (8-13 digits)");
      setIsLoading(false);
      return;
    }
    
    navigate(`/product/${barcode}`);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full gap-2">
      <div className="relative flex-1">
        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Enter barcode (e.g. 3017620422003)"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Scan"}
      </Button>
    </form>
  );
};

export default BarcodeSearch;
