
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, Users, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  emoji?: string;
}

export const PublicChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "🦍 ape_lord",
      message: "gm degens! just aped into 100 pixels 🚀",
      timestamp: new Date(Date.now() - 300000),
      emoji: "🦍"
    },
    {
      id: "2",
      user: "💎 diamond_paws",
      message: "wagmi frens, this is going parabolic",
      timestamp: new Date(Date.now() - 240000),
      emoji: "💎"
    },
    {
      id: "3",
      user: "🌙 moon_soon",
      message: "wen 10x? ngmi if you're not in",
      timestamp: new Date(Date.now() - 180000),
      emoji: "🌙"
    },
    {
      id: "4",
      user: "🔥 pixel_chad",
      message: "claiming my territory like a true degen",
      timestamp: new Date(Date.now() - 120000),
      emoji: "🔥"
    },
    {
      id: "5",
      user: "⚡ sol_maxi",
      message: "solana szn baby! this is alpha",
      timestamp: new Date(Date.now() - 60000),
      emoji: "⚡"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineCount] = useState(147);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const userEmojis = ["🦍", "💎", "🌙", "🔥", "⚡", "🚀", "👾", "🎮", "🎯", "💫", "🐸", "🪐"];
  const myEmoji = userEmojis[Math.floor(Math.random() * userEmojis.length)];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      user: `${myEmoji} anon_degen`,
      message: newMessage.trim(),
      timestamp: new Date(),
      emoji: myEmoji
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between font-pixel">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-500 animate-pulse" />
            <span>Degen Chat</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Users className="w-3 h-3" />
            <span>{onlineCount}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex flex-col h-[calc(100%-4rem)]">
        <ScrollArea className="flex-1 mb-3" ref={scrollAreaRef}>
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="text-xs break-words">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-semibold text-purple-400 font-pixel text-[10px]">
                    {msg.user}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="text-foreground text-[11px] leading-relaxed pl-4 border-l-2 border-purple-500/20">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="gm degens... share your alpha 🚀"
            className="text-xs bg-muted/50 border-purple-500/20 font-pixel"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            maxLength={100}
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="text-[9px] text-muted-foreground mt-2 text-center font-pixel">
          🚀 Share alpha • No rugs • WAGMI
        </div>
      </CardContent>
    </Card>
  );
};
