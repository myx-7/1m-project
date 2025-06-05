import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, Users, X, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  emoji?: string;
}

interface PublicChatProps {
  onClose?: () => void;
  isDesktop?: boolean;
}

export const PublicChat = ({ onClose, isDesktop = true }: PublicChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "🦍 anon_ape",
      message: "gm frens! buying my first blocks 🚀",
      timestamp: new Date(Date.now() - 300000),
      emoji: "🚀"
    },
    {
      id: "2",
      user: "💎 diamond_hands",
      message: "this is the future of art fr",
      timestamp: new Date(Date.now() - 240000),
      emoji: "💎"
    },
    {
      id: "3",
      user: "🌙 moon_walker",
      message: "wen lambo? 😂",
      timestamp: new Date(Date.now() - 180000),
      emoji: "🌙"
    },
    {
      id: "4",
      user: "🔥 pixel_lord",
      message: "already minted 50 blocks, this is addictive",
      timestamp: new Date(Date.now() - 120000),
      emoji: "🔥"
    },
    {
      id: "5",
      user: "⚡ sol_enjoyer",
      message: "solana go brrr",
      timestamp: new Date(Date.now() - 60000),
      emoji: "⚡"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineCount] = useState(147);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const userEmojis = ["🦍", "💎", "🌙", "🔥", "⚡", "🚀", "👾", "🎮", "🎯", "💫"];
  const myEmoji = userEmojis[Math.floor(Math.random() * userEmojis.length)];

  useEffect(() => {
    if (scrollAreaRef.current && !isMinimized) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      user: `${myEmoji} anon`,
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

  if (!isDesktop) {
    // Mobile full-screen chat
  return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary animate-pulse" />
            <h2 className="text-lg font-semibold font-pixel">Global Chat</h2>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Users className="w-3 h-3" />
            <span>{onlineCount}</span>
          </div>
          </div>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in fade-in-0 slide-in-from-bottom-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-primary font-pixel text-sm">
                    {msg.user}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="text-foreground text-sm leading-relaxed pl-6 border-l-2 border-primary/20">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="text-sm bg-muted/30 border-primary/20 font-pixel"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              maxLength={100}
            />
            <Button
              size="default"
              onClick={handleSendMessage}
              className="bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar chat
  return (
    <Card className={cn(
      "h-full border-0 shadow-none bg-transparent transition-all duration-300",
      isMinimized && "h-auto"
    )}>
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-sm flex items-center justify-between font-pixel">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary animate-pulse" />
            <span>Global Chat</span>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <Users className="w-3 h-3" />
              <span>{onlineCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                isMinimized && "rotate-180"
              )} />
            </Button>
            {onClose && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-3 pt-0 flex flex-col h-[calc(100%-4rem)]">
          <ScrollArea className="flex-1 mb-3 pr-3" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="text-xs break-words animate-in fade-in-0 slide-in-from-bottom-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-semibold text-primary font-pixel text-[11px]">
                      {msg.user}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div className="text-foreground text-[11px] leading-relaxed pl-4 border-l-2 border-primary/10 hover:border-primary/30 transition-colors">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="say gm..."
                className="text-xs bg-muted/30 border-primary/20 font-pixel focus:border-primary/50 transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            maxLength={100}
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
        
            <div className="text-[9px] text-muted-foreground text-center font-pixel opacity-60">
          💬 Be nice • No spam • Have fun!
            </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
};
