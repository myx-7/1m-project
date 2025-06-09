import { useState, useRef, useEffect } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, Users, X, ChevronDown, Eye, EyeOff, Settings, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  getChatMessages, 
  sendChatMessage, 
  subscribeToChatMessages, 
  unsubscribeFromChatMessages,
  getOnlineUsersCount,
  truncateWallet,
  getRandomEmoji,
  type ChatMessage 
} from "@/api/chat";
import { RealtimeChannel } from '@supabase/supabase-js';

interface PublicChatProps {
  onClose?: () => void;
  isDesktop?: boolean;
}

export const PublicChat = ({ onClose, isDesktop = true }: PublicChatProps) => {
  const { connected, publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineCount, setOnlineCount] = useState(42);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [userEmoji, setUserEmoji] = useState(getRandomEmoji());
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  // Load initial messages and setup subscription
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      // Load messages
      const messagesResult = await getChatMessages(50);
      if (messagesResult.success && messagesResult.data) {
        setMessages(messagesResult.data);
      }
      
      // Load online count
      const count = await getOnlineUsersCount();
      setOnlineCount(count);
      
      setIsLoading(false);
    };

    loadInitialData();

    // Setup real-time subscription
    subscriptionRef.current = subscribeToChatMessages(
      (newMessage) => {
        console.log('📨 New real-time message received:', newMessage);
        // Avoid duplicates by checking if message already exists
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === newMessage.id);
          if (messageExists) {
            console.log('Message already exists, skipping duplicate');
            return prev;
          }
          console.log('Adding new message to UI');
          return [...prev, newMessage];
        });
      },
      (error) => {
        console.error('❌ Chat subscription error:', error);
      }
    );

    // Update online count periodically
    const countInterval = setInterval(async () => {
      const count = await getOnlineUsersCount();
      setOnlineCount(count);
    }, 30000); // Every 30 seconds

    return () => {
      console.log('🧹 Cleaning up chat subscription');
      if (subscriptionRef.current) {
        unsubscribeFromChatMessages(subscriptionRef.current);
      }
      clearInterval(countInterval);
    };
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && !isMinimized) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, isMinimized]);

  const generateUsername = () => {
    if (isAnonymous) {
      return `anon_${Math.random().toString(36).substring(2, 8)}`;
    } else if (connected && publicKey) {
      return truncateWallet(publicKey.toString());
    } else {
      return 'visitor';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      message: newMessage.trim(),
      user_wallet: connected && !isAnonymous ? publicKey?.toString() : null,
      username: generateUsername(),
      is_anonymous: isAnonymous || !connected,
      emoji: userEmoji
    };
    
    // Optimistic update - add message immediately to UI
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`, // Temporary ID
      message: messageData.message,
      user_wallet: messageData.user_wallet,
      username: messageData.username,
      is_anonymous: messageData.is_anonymous,
      emoji: messageData.emoji,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add optimistic message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");
    
    try {
      const result = await sendChatMessage(messageData);
      if (result.success && result.data) {
        // Replace optimistic message with real message from server
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? result.data! : msg
          )
        );
      } else {
        console.error('Failed to send message:', result.error);
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        setNewMessage(messageData.message); // Restore message in input
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      setNewMessage(messageData.message); // Restore message in input
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageDisplayName = (message: ChatMessage) => {
    if (message.is_anonymous) {
      return `${message.emoji} ${message.username}`;
    } else if (message.user_wallet) {
      return `${message.emoji} ${message.username}`;
    } else {
      return `${message.emoji} ${message.username}`;
    }
  };

  const SettingsPanel = () => (
    <div className="space-y-3 p-3 border-t border-border bg-muted/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Privacy Settings</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowSettings(false)}
          className="h-6 w-6 p-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs">Anonymous Mode</span>
          {isAnonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </div>
        <Button
          size="sm"
          variant={isAnonymous ? "default" : "outline"}
          onClick={() => setIsAnonymous(!isAnonymous)}
          className="h-6 text-xs"
        >
          {isAnonymous ? "ON" : "OFF"}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs">Emoji</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setUserEmoji(getRandomEmoji())}
          className="h-6 text-xs"
        >
          {userEmoji} <Sparkles className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {!connected && (
        <div className="pt-2">
          <WalletMultiButton className="!h-7 !text-xs w-full" />
        </div>
      )}
    </div>
  );

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
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:bg-muted"
            >
              <Settings className="w-4 h-4" />
            </Button>
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
        </div>

        {showSettings && <SettingsPanel />}
        
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-muted-foreground">Loading messages...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="animate-in fade-in-0 slide-in-from-bottom-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary font-pixel text-sm">
                      {getMessageDisplayName(msg)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.created_at)}
                    </span>
                    {!msg.is_anonymous && msg.user_wallet && (
                      <span className="text-xs text-blue-500 opacity-60">
                        🔗
                      </span>
                    )}
                  </div>
                  <div className="text-foreground text-sm leading-relaxed pl-6 border-l-2 border-primary/20">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAnonymous ? "Type anonymously..." : "Type a message..."}
              className="text-sm bg-muted/30 border-primary/20 font-pixel"
              onKeyPress={handleKeyPress}
              maxLength={280}
            />
            <Button
              size="default"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            {isAnonymous ? `Chatting as ${userEmoji} anon` : connected ? `Chatting as ${userEmoji} ${truncateWallet(publicKey?.toString() || '')}` : 'Connect wallet or chat anonymously'}
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
              onClick={() => setShowSettings(!showSettings)}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <Settings className="w-3 h-3" />
            </Button>
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
      
      {showSettings && !isMinimized && <SettingsPanel />}
      
      {!isMinimized && (
        <CardContent className="p-3 pt-0 flex flex-col h-[calc(100%-4rem)]">
          <ScrollArea className="flex-1 mb-3 pr-3" ref={scrollAreaRef}>
            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <div className="text-xs text-muted-foreground">Loading...</div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="text-xs break-words animate-in fade-in-0 slide-in-from-bottom-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-semibold text-primary font-pixel text-[11px]">
                        {getMessageDisplayName(msg)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(msg.created_at)}
                      </span>
                      {!msg.is_anonymous && msg.user_wallet && (
                        <span className="text-[9px] text-blue-500 opacity-60">
                          🔗
                        </span>
                      )}
                    </div>
                    <div className="text-foreground text-[11px] leading-relaxed pl-4 border-l-2 border-primary/10 hover:border-primary/30 transition-colors">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isAnonymous ? "anon mode..." : "say gm..."}
                className="text-xs bg-muted/30 border-primary/20 font-pixel focus:border-primary/50 transition-colors"
                onKeyPress={handleKeyPress}
                maxLength={280}
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
            
            <div className="text-[9px] text-muted-foreground text-center font-pixel opacity-60 space-y-1">
              <div>
                {isAnonymous ? `${userEmoji} anon mode` : connected ? `${userEmoji} ${truncateWallet(publicKey?.toString() || '')}` : 'wallet not connected'}
              </div>
              <div>💬 Be nice • No spam • Have fun!</div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
