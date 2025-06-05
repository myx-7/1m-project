
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Info, Menu, Moon, Sun, Blocks } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const Header = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center transition-transform hover:scale-105 duration-200 hover:rotate-12">
            <Blocks className="w-3 h-3 text-background" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-foreground leading-none hover:text-primary transition-colors duration-200 font-pixel">
              milliondollarpage.xyz
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-muted-foreground hidden sm:block font-pixel">
                Own a piece of internet history
              </p>
              <Badge variant="secondary" className="text-[9px] px-2 py-0 bg-primary/10 text-primary border-primary/20 animate-pulse font-pixel">
                🚀 LIVE
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 hover:rotate-12"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hidden md:flex transition-all duration-200 hover:scale-105 font-pixel text-[10px]"
          >
            <Info className="w-4 h-4 mr-2" />
            How it works
          </Button>
          
          <Button
            size="sm"
            variant={isWalletConnected ? "secondary" : "default"}
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            className={`transition-all duration-300 hover:scale-105 font-pixel text-[10px] ${
              isWalletConnected 
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900" 
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isWalletConnected ? "Connected" : "Connect"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="md:hidden text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
