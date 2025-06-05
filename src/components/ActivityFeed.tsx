
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Target, Crown, TrendingUp } from "lucide-react";

interface Activity {
  id: string;
  type: 'mint' | 'whale' | 'streak' | 'territory';
  user: string;
  amount?: number;
  timestamp: Date;
  emoji: string;
}

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "whale",
      user: "whale_hunter",
      amount: 250,
      timestamp: new Date(Date.now() - 30000),
      emoji: "🐋"
    },
    {
      id: "2",
      type: "mint",
      user: "pixel_ape",
      amount: 15,
      timestamp: new Date(Date.now() - 45000),
      emoji: "🦍"
    },
    {
      id: "3",
      type: "territory",
      user: "land_grabber",
      amount: 50,
      timestamp: new Date(Date.now() - 60000),
      emoji: "🏴"
    },
    {
      id: "4",
      type: "streak",
      user: "degen_lord",
      amount: 5,
      timestamp: new Date(Date.now() - 90000),
      emoji: "🔥"
    }
  ]);

  useEffect(() => {
    // Simulate real-time activities
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'whale' : 'mint',
        user: `anon_${Math.floor(Math.random() * 9999)}`,
        amount: Math.floor(Math.random() * 100) + 1,
        timestamp: new Date(),
        emoji: ['🦍', '💎', '🌙', '🔥', '⚡'][Math.floor(Math.random() * 5)]
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'whale': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'mint': return <Zap className="w-3 h-3 text-blue-500" />;
      case 'territory': return <Target className="w-3 h-3 text-purple-500" />;
      case 'streak': return <TrendingUp className="w-3 h-3 text-orange-500" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'whale':
        return `🐋 WHALE ALERT! ${activity.amount} pixels`;
      case 'mint':
        return `⚡ Minted ${activity.amount} pixels`;
      case 'territory':
        return `🏴 Claimed territory (${activity.amount}px)`;
      case 'streak':
        return `🔥 ${activity.amount} day streak!`;
      default:
        return `Activity by ${activity.user}`;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="h-full border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 font-pixel">
          <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>Live Activity</span>
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-[9px] animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] font-semibold text-purple-400 font-pixel">
                      {activity.emoji} {activity.user}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <div className="text-[11px] text-foreground font-pixel">
                    {getActivityText(activity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
