
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Grid3X3, Zap, Info } from "lucide-react";

interface HeaderProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export const Header = ({ selectedCount, onClearSelection }: HeaderProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Pixel Grid
          </h1>
          <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300 border-gray-700">
            2025
          </Badge>
        </div>

        {/* Center - Selection Info */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-3 animate-fade-in">
            <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300">
              {selectedCount} pixel{selectedCount !== 1 ? 's' : ''} selected
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-gray-400 hover:text-white"
            >
              Clear
            </Button>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <Info className="w-4 h-4 mr-2" />
            How it works
          </Button>
          
          <Button
            size="sm"
            variant={isWalletConnected ? "secondary" : "default"}
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            className={isWalletConnected 
              ? "bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20" 
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            }
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isWalletConnected ? "Connected" : "Connect Wallet"}
          </Button>

          {selectedCount > 0 && (
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 animate-pulse"
            >
              <Zap className="w-4 h-4 mr-2" />
              Mint ({selectedCount})
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
