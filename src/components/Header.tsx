
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Info, Menu, Moon, Sun, Blocks } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const Header = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center transition-transform hover:scale-105 duration-200">
            <Blocks className="w-4 h-4 text-background" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground leading-none hover:text-primary transition-colors duration-200">
              milliondollarpage.xyz
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground hidden sm:block">
                Own a piece of internet history, this time on-chain
              </p>
              <Badge variant="secondary" className="text-xs px-2 py-0 bg-primary/10 text-primary border-primary/20 animate-pulse">
                On-Chain
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
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
            className="text-muted-foreground hover:text-foreground hidden md:flex transition-all duration-200 hover:scale-105"
          >
            <Info className="w-4 h-4 mr-2" />
            How it works
          </Button>
          
          <Button
            size="sm"
            variant={isWalletConnected ? "secondary" : "default"}
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            className={`transition-all duration-300 hover:scale-105 ${
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
