import { supabase } from '@/db/database';
import { RealtimeChannel, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  message: string;
  user_wallet: string | null;
  username: string;
  is_anonymous: boolean;
  emoji: string;
  created_at: string;
  updated_at: string;
}

export interface SendMessageRequest {
  message: string;
  user_wallet?: string | null;
  username: string;
  is_anonymous: boolean;
  emoji: string;
}

export interface ChatApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Get recent chat messages
export const getChatMessages = async (limit = 50): Promise<ChatApiResponse<ChatMessage[]>> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat messages:', error);
      return { success: false, error: error.message };
    }

    // Reverse to show oldest first
    const messages = (data || []).reverse();
    return { success: true, data: messages };
  } catch (error) {
    console.error('Failed to fetch chat messages:', error);
    return { success: false, error: 'Failed to fetch messages' };
  }
};

// Send a new chat message
export const sendChatMessage = async (messageData: SendMessageRequest): Promise<ChatApiResponse<ChatMessage>> => {
  try {
    // Validate message
    if (!messageData.message?.trim()) {
      return { success: false, error: 'Message cannot be empty' };
    }

    if (messageData.message.length > 280) {
      return { success: false, error: 'Message too long (max 280 characters)' };
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        message: messageData.message.trim(),
        user_wallet: messageData.is_anonymous ? null : messageData.user_wallet,
        username: messageData.username,
        is_anonymous: messageData.is_anonymous,
        emoji: messageData.emoji
      }])
      .select()
      .single();

    if (error) {
      console.error('Error sending chat message:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send chat message:', error);
    return { success: false, error: 'Failed to send message' };
  }
};

// Subscribe to real-time chat messages
export const subscribeToChatMessages = (
  onMessage: (message: ChatMessage) => void,
  onError?: (error: Error) => void
): RealtimeChannel => {
  console.log('🔄 Setting up chat subscription...');
  
  const subscription = supabase
    .channel('chat_messages_channel') // More specific channel name
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      },
      (payload) => {
        console.log('🆕 Real-time message payload:', payload);
        if (payload.new) {
          onMessage(payload.new as ChatMessage);
        }
      }
    )
    .subscribe((status) => {
      console.log('📡 Chat subscription status:', status);
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        console.log('✅ Successfully subscribed to chat messages');
      } else if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
        console.error('❌ Channel error in chat subscription');
        if (onError) {
          onError(new Error('Channel error in chat subscription'));
        }
      } else if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT) {
        console.error('⏰ Chat subscription timed out');
        if (onError) {
          onError(new Error('Chat subscription timed out'));
        }
      } else if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
        console.warn('🔒 Chat subscription closed');
      }
    });

  return subscription;
};

// Unsubscribe from chat messages
export const unsubscribeFromChatMessages = (subscription: RealtimeChannel) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};

// Get online users count (simplified - could be enhanced with presence)
export const getOnlineUsersCount = async (): Promise<number> => {
  try {
    // Simple approximation: count unique users who sent messages in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('user_wallet')
      .gte('created_at', tenMinutesAgo)
      .not('user_wallet', 'is', null);

    if (error) {
      console.error('Error getting online count:', error);
      return 42; // Default fallback
    }

    const uniqueUsers = new Set(data?.map(row => row.user_wallet) || []);
    return Math.max(uniqueUsers.size + Math.floor(Math.random() * 20), 42); // Add some randomness
  } catch (error) {
    console.error('Failed to get online count:', error);
    return 42; // Default fallback
  }
};

// Truncate wallet address for display
export const truncateWallet = (wallet: string): string => {
  if (!wallet || wallet.length < 10) return wallet;
  return `${wallet.slice(0, 5)}...${wallet.slice(-5)}`;
};

// Generate random emoji for anonymous users
export const getRandomEmoji = (): string => {
  const emojis = ['🦍', '💎', '🌙', '🔥', '⚡', '🚀', '👾', '🎮', '🎯', '💫', '🌟', '✨', '🎨', '🎭', '🎪', '🎳', '🎲', '🎯', '🎪', '🎭'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}; 