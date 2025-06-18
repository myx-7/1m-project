import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Info,
  Menu,
  Moon,
  Sun,
  Blocks,
  ExternalLink,
  Github,
  Twitter,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HowItWorksDialog } from "./HowItWorksDialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Logo } from "./Logo";

export const Header = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleWalletClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(!visible);
    }
  };

  return (
    <>
      <header className="h-14 sm:h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between">
          {/* Logo & Description */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Main Logo */}
            <Logo size="sm" />
            
            {/* Tagline & Info */}
            <div className="hidden xs:flex items-center gap-1 sm:gap-2 overflow-hidden">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-sans whitespace-nowrap">
                <span className="hidden sm:inline">Advertise forever • Reach millions</span>
                <span className="sm:hidden">Advertise forever</span>
              </p>
              <div className="w-1 h-1 bg-muted-foreground/40 rounded-full hidden sm:block" />
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block font-sans whitespace-nowrap">
                Own your space
              </p>
              <div className="w-1 h-1 bg-muted-foreground/40 rounded-full hidden sm:block" />
              <p className="text-[10px] sm:text-xs text-muted-foreground font-sans whitespace-nowrap">
                <span className="hidden sm:inline">From 0.01 SOL</span>
                <span className="sm:hidden">0.01 SOL</span>
              </p>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[8px] sm:text-[9px] px-1 sm:px-2 py-0 font-sans ml-1",
                  "bg-blue-500/10",
                  "text-blue-600 dark:text-blue-400",
                  "border-blue-500/20"
                )}
              >
                <span className="mr-0.5 sm:mr-1">🚀</span> 
                <span className="hidden xs:inline">HOT</span>
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHowItWorks(true)}
              className="text-muted-foreground hover:text-foreground font-sans text-xs"
            >
              <Info className="w-4 h-4 mr-2" />
              How it works
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            <Button
              size="sm"
              variant={connected ? "secondary" : "default"}
              onClick={handleWalletClick}
              className={cn(
                "font-sans text-xs",
                connected
                  ? "bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20"
                  : "bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {connected && publicKey
                ? formatAddress(publicKey.toString())
                : "Connect Wallet"}
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground p-1.5 sm:p-2"
            >
              {theme === "dark" ? (
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
                  className="text-muted-foreground hover:text-foreground p-1.5 sm:p-2"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleWalletClick}>
                  <Wallet className="w-4 h-4 mr-2" />
                  {connected && publicKey
                    ? formatAddress(publicKey.toString())
                    : "Connect Wallet"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowHowItWorks(true)}>
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

      <HowItWorksDialog
        open={showHowItWorks}
        onOpenChange={setShowHowItWorks}
      />
    </>
  );
};
