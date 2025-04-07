
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After component is mounted, we can safely access the theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Avoid hydration mismatch by rendering after mount
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      <ToggleGroup 
        type="single" 
        value={theme}
        onValueChange={(value) => {
          if (value) setTheme(value);
        }}
        className="border rounded-md"
      >
        <ToggleGroupItem value="light" aria-label="Light mode">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark mode">
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        </ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="System mode">
          <span className="text-xs font-medium">Auto</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ThemeToggle;
