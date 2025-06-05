
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Zap, TrendingUp } from "lucide-react";

export const FOMOCounter = () => {
  const [recentMints, setRecentMints] = useState(23);
  const [lastMintTime, setLastMintTime] = useState("2s");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate minting activity
      if (Math.random() > 0.7) {
        setRecentMints(prev => prev + Math.floor(Math.random() * 3) + 1);
        setLastMintTime("0s");
        setIsActive(true);
        
        // Reset activity indicator
        setTimeout(() => setIsActive(false), 1000);
      } else {
        setLastMintTime(prev => {
          const current = parseInt(prev);
          return `${current + 1}s`;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isActive ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
            }`}></div>
            <span className="text-sm font-semibold text-foreground font-pixel">
              FOMO MODE
            </span>
            <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-[9px] animate-pulse">
              🔥 HOT
            </Badge>
          </div>
          <Timer className="w-4 h-4 text-orange-500" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-pixel">
              Last mint:
            </span>
            <span className="text-xs font-semibold text-orange-300 font-pixel">
              {lastMintTime} ago
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-pixel">
              Last 5 min:
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs font-semibold text-green-300 font-pixel">
                {recentMints} mints
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-pixel">
              Pace:
            </span>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-300 font-pixel">
                ACCELERATING
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-[10px] text-orange-300 font-pixel animate-pulse">
            ⚠️ Supply running low! Don't get rekt!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
