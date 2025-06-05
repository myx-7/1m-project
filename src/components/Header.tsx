import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Info, Menu, Moon, Sun, Blocks, ExternalLink, Github, Twitter } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress] = useState("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
  const { theme, toggleTheme } = useTheme();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:bg-primary/30 transition-all duration-300" />
            <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 group-hover:shadow-lg">
              <Blocks className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-foreground leading-none hover:text-primary transition-colors duration-200 font-pixel tracking-tight">
              milliondollarpage.xyz
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[11px] text-muted-foreground hidden sm:block font-pixel">
                Own a piece of internet history, on-chain this time
              </p>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-[9px] px-2 py-0 font-pixel",
                  "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
                  "text-green-600 dark:text-green-400",
                  "border-green-500/20",
                  "animate-pulse"
                )}
              >
                <span className="mr-1">●</span> LIVE
              </Badge>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground transition-all duration-200 font-pixel text-xs"
          >
            <Info className="w-4 h-4 mr-2" />
            How it works
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <div className="w-px h-6 bg-border mx-2" />
          
          <Button
            size="sm"
            variant={isWalletConnected ? "secondary" : "default"}
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            className={cn(
              "transition-all duration-300 font-pixel text-xs relative overflow-hidden group",
              isWalletConnected 
                ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 text-green-600 dark:text-green-400 hover:from-green-500/20 hover:to-emerald-500/20" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <div className="relative z-10 flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              {isWalletConnected ? formatAddress(walletAddress) : "Connect Wallet"}
            </div>
            {!isWalletConnected && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsWalletConnected(!isWalletConnected)}>
                <Wallet className="w-4 h-4 mr-2" />
                {isWalletConnected ? formatAddress(walletAddress) : "Connect Wallet"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Info className="w-4 h-4 mr-2" />
                How it works
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
