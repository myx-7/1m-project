
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Zap, Heart, Users } from "lucide-react";

interface StatsBarProps {
  totalPixels: number;
  soldPixels: number;
  floorPrice: number;
}

export const StatsBar = ({ totalPixels, soldPixels }: Omit<StatsBarProps, 'floorPrice'>) => {
  const availablePixels = totalPixels - soldPixels;
  const soldPercentage = (soldPixels / totalPixels) * 100;

  return (
    <div className="h-12 bg-card border-t border-border px-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground font-pixel">
            <span className="text-foreground font-semibold">{availablePixels.toLocaleString()}</span> boş alan var
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <Heart className="w-3 h-3 text-red-500" />
          <span className="text-xs text-muted-foreground font-pixel">
            <span className="text-foreground font-semibold">{soldPixels}</span> hatıra bırakıldı ({soldPercentage.toFixed(1)}%)
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-muted-foreground font-pixel">
            <span className="text-foreground font-semibold">156</span> kişi katıldı
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px] font-pixel">
          <Zap className="w-3 h-3 mr-1" />
          Canlı hatıra duvarı ✨
        </Badge>
        
        <div className="text-[10px] text-muted-foreground font-pixel hidden md:block">
          💫 İlk hatıra: 3 gün önce
        </div>
      </div>
    </div>
  );
};
