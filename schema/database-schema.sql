-- Database Schema for Pixel NFT Grid
-- Run this in your Supabase SQL editor to set up the database

-- Create the pixel_nfts table
CREATE TABLE IF NOT EXISTS pixel_nfts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pixel_ids INTEGER[] NOT NULL,
    start_x INTEGER NOT NULL CHECK (start_x >= 0 AND start_x < 100),
    start_y INTEGER NOT NULL CHECK (start_y >= 0 AND start_y < 100),
    end_x INTEGER NOT NULL CHECK (end_x >= 0 AND end_x < 100),
    end_y INTEGER NOT NULL CHECK (end_y >= 0 AND end_y < 100),
    image_url TEXT NOT NULL,
    metadata_url TEXT NOT NULL,
    nft_mint_address TEXT NOT NULL UNIQUE,
    owner_wallet TEXT NOT NULL,
    transaction_signature TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure start coordinates are less than or equal to end coordinates
    CONSTRAINT valid_coordinates CHECK (start_x <= end_x AND start_y <= end_y)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pixel_nfts_coordinates ON pixel_nfts (start_x, start_y, end_x, end_y);
CREATE INDEX IF NOT EXISTS idx_pixel_nfts_owner ON pixel_nfts (owner_wallet);
CREATE INDEX IF NOT EXISTS idx_pixel_nfts_mint_address ON pixel_nfts (nft_mint_address);
CREATE INDEX IF NOT EXISTS idx_pixel_nfts_created_at ON pixel_nfts (created_at DESC);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_pixel_nfts_updated_at ON pixel_nfts;
CREATE TRIGGER update_pixel_nfts_updated_at
    BEFORE UPDATE ON pixel_nfts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check if pixels overlap (used for validation)
CREATE OR REPLACE FUNCTION check_pixel_overlap(
    new_start_x INTEGER,
    new_start_y INTEGER,
    new_end_x INTEGER,
    new_end_y INTEGER,
    exclude_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM pixel_nfts
        WHERE (exclude_id IS NULL OR id != exclude_id)
        AND NOT (
            new_start_x > end_x OR 
            new_end_x < start_x OR 
            new_start_y > end_y OR 
            new_end_y < start_y
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to prevent overlapping pixel ranges
CREATE OR REPLACE FUNCTION prevent_pixel_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF check_pixel_overlap(NEW.start_x, NEW.start_y, NEW.end_x, NEW.end_y, NEW.id) THEN
        RAISE EXCEPTION 'Pixel range overlaps with existing NFT';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent overlapping pixels
DROP TRIGGER IF EXISTS prevent_overlap_trigger ON pixel_nfts;
CREATE TRIGGER prevent_overlap_trigger
    BEFORE INSERT OR UPDATE ON pixel_nfts
    FOR EACH ROW
    EXECUTE FUNCTION prevent_pixel_overlap();

-- Function to get grid statistics (used by the API)
CREATE OR REPLACE FUNCTION get_grid_statistics()
RETURNS JSON AS $$
DECLARE
    total_nfts INTEGER;
    total_pixels INTEGER;
    unique_owners INTEGER;
BEGIN
    -- Count total NFTs
    SELECT COUNT(*) INTO total_nfts FROM pixel_nfts;
    
    -- Calculate total pixels occupied
    SELECT COALESCE(SUM((end_x - start_x + 1) * (end_y - start_y + 1)), 0) 
    INTO total_pixels FROM pixel_nfts;
    
    -- Count unique owners
    SELECT COUNT(DISTINCT owner_wallet) INTO unique_owners FROM pixel_nfts;
    
    RETURN json_build_object(
        'totalNFTs', total_nfts,
        'totalPixelsOccupied', total_pixels,
        'uniqueOwners', unique_owners
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if a pixel range is available
CREATE OR REPLACE FUNCTION are_pixels_available(
    check_start_x INTEGER,
    check_start_y INTEGER,
    check_end_x INTEGER,
    check_end_y INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT check_pixel_overlap(check_start_x, check_start_y, check_end_x, check_end_y);
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) for better security
ALTER TABLE pixel_nfts ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust these based on your authentication needs)
-- For now, allow read access to everyone and write access to authenticated users

-- Policy for reading (everyone can read)
CREATE POLICY "Allow read access to everyone" ON pixel_nfts
    FOR SELECT USING (true);

-- Policy for inserting (authenticated users only)
CREATE POLICY "Allow insert for authenticated users" ON pixel_nfts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating (only owner can update their NFTs)
CREATE POLICY "Allow update for NFT owners" ON pixel_nfts
    FOR UPDATE USING (auth.uid()::text = owner_wallet);

-- Policy for deleting (only owner can delete their NFTs)
CREATE POLICY "Allow delete for NFT owners" ON pixel_nfts
    FOR DELETE USING (auth.uid()::text = owner_wallet);

-- Insert some sample data for testing (optional)
INSERT INTO pixel_nfts (
    pixel_ids, start_x, start_y, end_x, end_y, image_url, metadata_url,
    nft_mint_address, owner_wallet, transaction_signature
) VALUES
(
    ARRAY[1010, 1011, 1110, 1111],
    10, 10, 11, 11,
    'https://picsum.photos/400/400?random=1',
    'https://api.example.com/metadata/nft_001',
    '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    '5VfN7Q8KqPb79RkJ4yq5rNX2YW9JrZ3C8H4A1xV2B6uE9T3M7L'
),
(
    ARRAY[2525, 2526, 2527, 2625, 2626, 2627],
    25, 25, 27, 26,
    'https://picsum.photos/400/400?random=2',
    'https://api.example.com/metadata/nft_002',
    '8yLXvh3DW98e86TYJTEqbE6kBkheTqA83TZRuJpthBtV',
    'AdzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtBXXN',
    '6WgO8R9LrQc89SjK5zr6sOY3ZX0KsA4D9I5B2yW3C7vF0U4N8M'
),
(
    ARRAY[5050, 5051, 5052, 5150, 5151, 5152, 5250, 5251, 5252],
    50, 50, 52, 52,
    'https://picsum.photos/400/400?random=3',
    'https://api.example.com/metadata/nft_003',
    '9zMYwi4EX09f97UKJUFrcF7lCkheTqA83TZRuJosgAsU',
    'BezDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtCYYO',
    '7XhP9S0MsRd90TkL6As7tPZ4aY1LtB5E0J6C3zX4D8wG1V5O9N'
)
ON CONFLICT (nft_mint_address) DO NOTHING; 