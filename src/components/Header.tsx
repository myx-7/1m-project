
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Info, Menu } from "lucide-react";

export const Header = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <header className="h-16 border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 leading-none">
              milliondollarpage.xyz
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Own a piece of internet history
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hidden md:flex"
          >
            <Info className="w-4 h-4 mr-2" />
            How it works
          </Button>
          
          <Button
            size="sm"
            variant={isWalletConnected ? "secondary" : "default"}
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            className={isWalletConnected 
              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
              : "bg-black text-white hover:bg-gray-800"
            }
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isWalletConnected ? "Connected" : "Connect"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="md:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
