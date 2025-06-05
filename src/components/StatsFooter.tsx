
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Grid3X3, Users, Heart } from "lucide-react";

interface StatsFooterProps {
  totalPixels: number;
  soldPixels: number;
  floorPrice: number;
  selectedCount: number;
}

export const StatsFooter = ({ totalPixels, soldPixels, selectedCount }: Omit<StatsFooterProps, 'floorPrice'>) => {
  const percentageSold = (soldPixels / totalPixels) * 100;

  return (
    <footer className="h-16 border-t border-gray-800 bg-gray-950/90 backdrop-blur-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Grid3X3 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Duvar:</span>
            <span className="text-white font-medium">
              {soldPixels.toLocaleString()} / {totalPixels.toLocaleString()}
            </span>
            <Badge variant="secondary" className="bg-purple-500/10 border-purple-500/30 text-purple-300 text-xs">
              {percentageSold.toFixed(1)}% dolu
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-gray-400">Hatıralar:</span>
            <span className="text-white font-medium">{soldPixels}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Katılımcı:</span>
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
                <span className="text-white font-medium">{selectedCount}</span> alan seçildi
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Heart className="w-4 h-4 mr-2" />
                Hatıra Bırak
              </Button>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              Hatıra bırakmak için alan seç ✨
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
