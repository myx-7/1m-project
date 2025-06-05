
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Grid3X3, Users } from "lucide-react";

interface StatsFooterProps {
  totalPixels: number;
  soldPixels: number;
  floorPrice: number;
  selectedCount: number;
}

export const StatsFooter = ({ totalPixels, soldPixels, floorPrice, selectedCount }: StatsFooterProps) => {
  const percentageSold = (soldPixels / totalPixels) * 100;

  return (
    <footer className="h-16 border-t border-gray-800 bg-gray-950/90 backdrop-blur-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Grid3X3 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Grid:</span>
            <span className="text-white font-medium">
              {soldPixels.toLocaleString()} / {totalPixels.toLocaleString()}
            </span>
            <Badge variant="secondary" className="bg-green-500/10 border-green-500/30 text-green-300 text-xs">
              {percentageSold.toFixed(1)}% sold
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Floor:</span>
            <span className="text-white font-medium">{floorPrice} SOL</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Owners:</span>
            <span className="text-white font-medium">156</span>
          </div>
        </div>

        {/* Center - Progress bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentageSold}%` }}
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">
                Total: <span className="text-white font-medium">{(selectedCount * floorPrice).toFixed(3)} SOL</span>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Zap className="w-4 h-4 mr-2" />
                Mint Now
              </Button>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              Select pixels to mint
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
