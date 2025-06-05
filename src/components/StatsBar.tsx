
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Zap, DollarSign } from "lucide-react";

interface StatsBarProps {
  totalPixels: number;
  soldPixels: number;
  floorPrice: number;
}

export const StatsBar = ({ totalPixels, soldPixels, floorPrice }: StatsBarProps) => {
  const availablePixels = totalPixels - soldPixels;
  const soldPercentage = (soldPixels / totalPixels) * 100;

  return (
    <div className="h-12 bg-card border-t border-border px-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground font-pixel">
            <span className="text-foreground font-semibold">{availablePixels.toLocaleString()}</span> blocks available
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-muted-foreground font-pixel">
            <span className="text-foreground font-semibold">{soldPixels}</span> minted ({soldPercentage.toFixed(1)}%)
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <DollarSign className="w-3 h-3 text-yellow-500" />
          <span className="text-xs text-muted-foreground font-pixel">
            Floor: <span className="text-foreground font-semibold">{floorPrice} SOL</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-[10px] font-pixel">
          <Zap className="w-3 h-3 mr-1" />
          Real-time minting 🔥
        </Badge>
        
        <div className="text-[10px] text-muted-foreground font-pixel hidden md:block">
          💰 Total volume: 1,234 SOL
        </div>
      </div>
    </div>
  );
};
