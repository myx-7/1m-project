
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Blocks, Users } from "lucide-react";

interface StatsBarProps {
  totalPixels: number;
  soldPixels: number;
  floorPrice: number;
}

export const StatsBar = ({ totalPixels, soldPixels, floorPrice }: StatsBarProps) => {
  const percentageSold = (soldPixels / totalPixels) * 100;

  return (
    <footer className="h-12 border-t border-border bg-background/95 backdrop-blur-sm transition-colors duration-300">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left - Stats */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Blocks className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground hidden sm:inline">Blocks:</span>
            <span className="text-foreground font-medium transition-colors duration-200">
              {soldPixels.toLocaleString()} / {totalPixels.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground hidden sm:inline">Floor:</span>
            <span className="text-foreground font-medium">{floorPrice} SOL</span>
          </div>

          <div className="flex items-center gap-2 text-sm hidden md:flex">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Owners:</span>
            <span className="text-foreground font-medium">156</span>
          </div>
        </div>

        {/* Right - Progress */}
        <div className="flex items-center gap-3">
          <div className="w-24 md:w-32 bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-foreground h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentageSold}%` }}
            />
          </div>
          <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs transition-colors duration-300">
            {percentageSold.toFixed(1)}%
          </Badge>
        </div>
      </div>
    </footer>
  );
};
