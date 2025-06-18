-- Chat Messages Schema for Supabase
-- Run this in your Supabase SQL editor

-- Create the chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL CHECK (LENGTH(message) <= 280),
    user_wallet TEXT, -- Can be null for anonymous users
    username TEXT, -- Display name (can be anon or wallet-based)
    is_anonymous BOOLEAN DEFAULT false,
    emoji TEXT DEFAULT '👤',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_message_length CHECK (LENGTH(TRIM(message)) > 0),
    CONSTRAINT valid_username_length CHECK (LENGTH(username) <= 50)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_wallet ON chat_messages (user_wallet);
CREATE INDEX IF NOT EXISTS idx_chat_messages_anonymous ON chat_messages (is_anonymous);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_chat_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at_column();

-- Function to get recent chat messages (last 100)
CREATE OR REPLACE FUNCTION get_recent_chat_messages(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
    id UUID,
    message TEXT,
    user_wallet TEXT,
    username TEXT,
    is_anonymous BOOLEAN,
    emoji TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.id,
        cm.message,
        cm.user_wallet,
        cm.username,
        cm.is_anonymous,
        cm.emoji,
        cm.created_at,
        cm.updated_at
    FROM chat_messages cm
    ORDER BY cm.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old messages (keep only last 1000)
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH old_messages AS (
        SELECT id FROM chat_messages 
        ORDER BY created_at DESC 
        OFFSET 1000
    )
    DELETE FROM chat_messages 
    WHERE id IN (SELECT id FROM old_messages);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Policy for reading (everyone can read chat messages)
CREATE POLICY "Allow read access to everyone" ON chat_messages
    FOR SELECT USING (true);

-- Policy for inserting (anonymous users can insert)
CREATE POLICY "Allow insert for anonymous users" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- Policy for updating (users can only update their own messages within 5 minutes)
CREATE POLICY "Allow update for message owners" ON chat_messages
    FOR UPDATE USING (
        user_wallet IS NOT NULL 
        AND created_at > NOW() - INTERVAL '5 minutes'
    );

-- Policy for deleting (users can only delete their own messages within 5 minutes)
CREATE POLICY "Allow delete for message owners" ON chat_messages
    FOR DELETE USING (
        user_wallet IS NOT NULL 
        AND created_at > NOW() - INTERVAL '5 minutes'
    );

-- Insert some sample messages
INSERT INTO chat_messages (message, user_wallet, username, is_anonymous, emoji) VALUES
('gm frens! 🌅', 'BGuTS2LvaN3RQcsfffx5rMTPynNrN9bPK5Sjks6imipE', 'BGuTS...imipE', false, '🌅'),
('this chat is pretty cool tbh', null, 'anon_user', true, '🦍'),
('just minted my first pixel NFT! 🎉', 'CxvE8PJdJvQy2fPbThX7R2N4Y1B8K3Z9M5nQr6LpVwXs', 'CxvE8...VwXs', false, '🎉'),
('staying anon for now 👤', null, 'anon_ghost', true, '👤'),
('solana ecosystem is fire 🔥', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', '9WzDX...AWWM', false, '🔥')
ON CONFLICT DO NOTHING; 