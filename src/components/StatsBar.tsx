
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Zap, DollarSign, Target, Users } from "lucide-react";

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
            <span className="text-foreground font-semibold">{availablePixels.toLocaleString()}</span> pixels left to ape
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-muted-foreground font-pixel">
            <span className="text-foreground font-semibold">{soldPixels}</span> claimed ({soldPercentage.toFixed(1)}%)
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <DollarSign className="w-3 h-3 text-yellow-500" />
          <span className="text-xs text-muted-foreground font-pixel">
            Floor: <span className="text-foreground font-semibold">{floorPrice} SOL</span>
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-muted-foreground font-pixel">
            <span className="text-foreground font-semibold">147</span> degens online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30 text-[10px] font-pixel animate-pulse">
          <Zap className="w-3 h-3 mr-1" />
          FOMO MODE 🚀
        </Badge>
        
        <div className="text-[10px] text-muted-foreground font-pixel hidden md:block">
          💎 Last mint: 2 sec ago
        </div>
        
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-[10px] font-pixel">
          🔥 HOT
        </Badge>
      </div>
    </div>
  );
};
