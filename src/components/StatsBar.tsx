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
  const totalVolume = 2.34; // Mock data in thousands

  return (
    <div className="h-14 bg-card/50 backdrop-blur-sm border-t border-border transition-all duration-300">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Main stats */}
        <div className="flex items-center gap-3 md:gap-6 overflow-x-auto">
          {/* Available pixels */}
          <div className="flex items-center gap-2 shrink-0">
            <Blocks className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-pixel whitespace-nowrap">
              <span className="text-foreground font-semibold">
                {availablePixels.toLocaleString()}
              </span>
              <span className="text-muted-foreground">
                {" "}
                pixels left
              </span>
            </span>
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* Claimed stats */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 bg-foreground rounded-full"></div>
            <span className="text-xs font-pixel whitespace-nowrap">
              <span className="text-foreground font-semibold">
                {soldPixels.toLocaleString()}
              </span>
              <span className="text-muted-foreground">
                {" "}
                claimed
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  "ml-2 text-[10px] font-pixel transition-all duration-300",
                  "bg-foreground/10 text-foreground"
                )}
              >
                {soldPercentage.toFixed(1)}%
              </Badge>
            </span>
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* Price */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-pixel whitespace-nowrap">
              <span className="text-muted-foreground">
                Price:{" "}
              </span>
              <span className="text-foreground font-semibold">
                {floorPrice} SOL
              </span>
              <span className="text-muted-foreground">
                /pixel
              </span>
            </span>
          </div>

          {/* Selected indicator - only show when pixels are selected */}
          {selectedCount > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="h-6 hidden md:block"
              />
              <div className="flex items-center gap-2 shrink-0 animate-in fade-in-0 slide-in-from-left-2">
                <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
                <span className="text-xs font-pixel">
                  <span className="text-foreground font-semibold">
                    {selectedCount}
                  </span>
                  <span className="text-muted-foreground"> selecting</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side - Activity indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-pixel">
              Activity:{" "}
              <span className="text-foreground">
                {totalVolume}K SOL
              </span>
            </span>
          </div>

          <Badge
            variant="secondary"
            className={cn(
              "bg-green-500/10",
              "text-green-600 dark:text-green-400",
              "border-green-500/20",
              "text-[10px] font-pixel",
              "hover:scale-105 transition-transform duration-200"
            )}
          >
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            <span className="hidden sm:inline">LIVE</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};
