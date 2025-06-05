
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Grid3X3, Users } from "lucide-react";

interface StatsBarProps {
  totalPixels: number;
  soldPixels: number;
  floorPrice: number;
}

export const StatsBar = ({ totalPixels, soldPixels, floorPrice }: StatsBarProps) => {
  const percentageSold = (soldPixels / totalPixels) * 100;

  return (
    <footer className="h-12 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left - Stats */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Grid3X3 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 hidden sm:inline">Pixels:</span>
            <span className="text-gray-900 font-medium">
              {soldPixels.toLocaleString()} / {totalPixels.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 hidden sm:inline">Floor:</span>
            <span className="text-gray-900 font-medium">{floorPrice} SOL</span>
          </div>

          <div className="flex items-center gap-2 text-sm hidden md:flex">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Owners:</span>
            <span className="text-gray-900 font-medium">156</span>
          </div>
        </div>

        {/* Right - Progress */}
        <div className="flex items-center gap-3">
          <div className="w-24 md:w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentageSold}%` }}
            />
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
            {percentageSold.toFixed(1)}%
          </Badge>
        </div>
      </div>
    </footer>
  );
};
