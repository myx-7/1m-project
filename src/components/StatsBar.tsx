import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Zap, DollarSign, Activity, Sparkles } from "lucide-react";
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
  const totalVolume = 1234; // Mock data

  return (
    <div className="h-14 bg-card/50 backdrop-blur-sm border-t border-border transition-all duration-300">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Main stats */}
        <div className="flex items-center gap-3 md:gap-6 overflow-x-auto">
          {/* Available blocks */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs font-pixel whitespace-nowrap">
              <span className="text-foreground font-semibold">
                {availablePixels.toLocaleString()}
              </span>
              <span className="text-muted-foreground hidden sm:inline">
                {" "}
                available
              </span>
            </span>
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* Minted stats */}
          <div className="flex items-center gap-2 shrink-0">
            <TrendingUp
              className={cn(
                "w-3 h-3 transition-colors duration-300",
                soldPercentage > 50 ? "text-green-500" : "text-blue-500"
              )}
            />
            <span className="text-xs font-pixel whitespace-nowrap">
              <span className="text-foreground font-semibold">
                {soldPixels}
              </span>
              <span className="text-muted-foreground hidden sm:inline">
                {" "}
                minted
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  "ml-2 text-[10px] font-pixel transition-all duration-300",
                  soldPercentage > 50
                    ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                    : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                )}
              >
                {soldPercentage.toFixed(1)}%
              </Badge>
            </span>
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* Floor price */}
          <div className="flex items-center gap-2 shrink-0">
            <DollarSign className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-pixel whitespace-nowrap">
              <span className="text-muted-foreground hidden sm:inline">
                Floor:{" "}
              </span>
              <span className="text-foreground font-semibold">
                {floorPrice} SOL
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
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-xs font-pixel">
                  <span className="text-primary font-semibold">
                    {selectedCount}
                  </span>
                  <span className="text-muted-foreground"> selected</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side - Live indicator and volume */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <Activity className="w-3 h-3 text-orange-500 animate-pulse" />
            <span className="text-[10px] text-muted-foreground font-pixel">
              Volume:{" "}
              <span className="text-foreground">
                {totalVolume.toLocaleString()} SOL
              </span>
            </span>
          </div>

          <Badge
            variant="secondary"
            className={cn(
              "bg-gradient-to-r from-orange-100 to-red-100",
              "dark:from-orange-950 dark:to-red-950",
              "text-orange-700 dark:text-orange-300",
              "border-orange-200 dark:border-orange-800",
              "text-[10px] font-pixel",
              "hover:scale-105 transition-transform duration-200"
            )}
          >
            <Zap className="w-3 h-3 mr-1 animate-pulse" />
            <span className="hidden sm:inline">Real-time LIVE </span>
          </Badge>
        </div>
      </div>
    </div>
  );
};
