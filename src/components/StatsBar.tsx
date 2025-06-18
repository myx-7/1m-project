import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Zap, DollarSign, Activity, Sparkles, Blocks } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  totalPixels: number;
  soldPixels: number;
  floorPrice: number;
  selectedCount?: number;
}

export const StatsBar = ({
  totalPixels,
  soldPixels,
  floorPrice,
  selectedCount = 0,
}: StatsBarProps) => {
  const availablePixels = totalPixels - soldPixels;
  const soldPercentage = (soldPixels / totalPixels) * 100;
  const totalVolume = soldPixels * floorPrice; // Calculate real volume based on sold pixels
  
  // Format volume for display
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    } else {
      return volume.toFixed(2);
    }
  };

  return (
    <div className="h-12 sm:h-14 bg-card/50 backdrop-blur-sm border-t border-border">
      <div className="h-full px-3 sm:px-4 flex items-center justify-between">
        {/* Left side - Main stats */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-6 overflow-x-auto scrollbar-hide flex-1 min-w-0">
          {/* Available pixels */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Blocks className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs font-pixel whitespace-nowrap">
              <span className="text-foreground font-semibold">
                {availablePixels.toLocaleString()}
              </span>
              <span className="text-muted-foreground hidden xs:inline">
                {" "}
                pixels left
              </span>
              <span className="text-muted-foreground xs:hidden">
                {" "}
                left
              </span>
            </span>
          </div>

          <Separator orientation="vertical" className="h-4 sm:h-6 hidden sm:block" />

          {/* Claimed stats */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-foreground rounded-full"></div>
            <span className="text-[10px] sm:text-xs font-pixel whitespace-nowrap">
              <span className="text-foreground font-semibold">
                {soldPixels.toLocaleString()}
              </span>
              <span className="text-muted-foreground hidden xs:inline">
                {" "}
                claimed
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 sm:ml-2 text-[8px] sm:text-[10px] font-pixel px-1 sm:px-1.5",
                  "bg-foreground/10 text-foreground"
                )}
              >
                {soldPercentage.toFixed(1)}%
              </Badge>
            </span>
          </div>

          <Separator orientation="vertical" className="h-4 sm:h-6 hidden md:block" />

          {/* Price */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-[10px] sm:text-xs font-pixel whitespace-nowrap">
              <span className="text-muted-foreground hidden sm:inline">
                Price:{" "}
              </span>
              <span className="text-foreground font-semibold">
                {floorPrice} SOL
              </span>
              <span className="text-muted-foreground">
                /px
              </span>
            </span>
          </div>

          {/* Selected indicator - only show when pixels are selected */}
          {selectedCount > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="h-4 sm:h-6 hidden lg:block"
              />
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-foreground rounded-full"></div>
                <span className="text-[10px] sm:text-xs font-pixel">
                  <span className="text-foreground font-semibold">
                    {selectedCount}
                  </span>
                  <span className="text-muted-foreground hidden sm:inline"> selecting</span>
                  <span className="text-muted-foreground sm:hidden"> sel</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side - Activity indicator */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-pixel whitespace-nowrap">
              Activity:{" "}
              <span className="text-foreground">
                {formatVolume(totalVolume)} SOL
              </span>
            </span>
          </div>

          <Badge
            variant="secondary"
            className={cn(
              "bg-green-500/10",
              "text-green-600 dark:text-green-400",
              "border-green-500/20",
              "text-[8px] sm:text-[10px] font-pixel px-1.5 sm:px-2"
            )}
          >
            <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            <span className="hidden xs:inline">LIVE</span>
            <span className="xs:hidden">●</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};
