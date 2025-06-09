import { createClient } from '@supabase/supabase-js';
import { PixelNFTRecord } from '@/types/nft';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database table name
export const PIXEL_NFT_TABLE = 'pixel_nfts';

// Database types for better TypeScript support
export interface PixelNFTDatabase {
  id: string;
  pixel_ids: number[];
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  image_url: string;
  metadata_url: string;
  nft_mint_address: string;
  owner_wallet: string;
  transaction_signature: string;
  created_at: string;
  updated_at?: string;
}

// Convert database record to application record
export const fromDatabaseRecord = (dbRecord: PixelNFTDatabase): PixelNFTRecord => ({
  id: dbRecord.id,
  pixelIds: dbRecord.pixel_ids,
  startX: dbRecord.start_x,
  startY: dbRecord.start_y,
  endX: dbRecord.end_x,
  endY: dbRecord.end_y,
  imageUrl: dbRecord.image_url,
  metadataUrl: dbRecord.metadata_url,
  nftMintAddress: dbRecord.nft_mint_address,
  ownerWallet: dbRecord.owner_wallet,
  transactionSignature: dbRecord.transaction_signature,
  createdAt: dbRecord.created_at
});

// Convert application record to database record
export const toDatabaseRecord = (appRecord: Omit<PixelNFTRecord, 'id'>): Omit<PixelNFTDatabase, 'id' | 'created_at' | 'updated_at'> => ({
  pixel_ids: appRecord.pixelIds,
  start_x: appRecord.startX,
  start_y: appRecord.startY,
  end_x: appRecord.endX,
  end_y: appRecord.endY,
  image_url: appRecord.imageUrl,
  metadata_url: appRecord.metadataUrl,
  nft_mint_address: appRecord.nftMintAddress,
  owner_wallet: appRecord.ownerWallet,
  transaction_signature: appRecord.transactionSignature
});

// Initialize database tables (run this once during setup)
export const initializeDatabase = async () => {
  const { error } = await supabase.rpc('create_pixel_nft_table_if_not_exists');
  
  if (error) {
    console.error('Failed to initialize database:', error);
    throw new Error('Database initialization failed');
  }
  
  console.log('Database initialized successfully');
};

// Health check for database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from(PIXEL_NFT_TABLE).select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}; 