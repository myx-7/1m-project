import { supabase, PIXEL_NFT_TABLE, fromDatabaseRecord, toDatabaseRecord, PixelNFTDatabase } from '@/db/database';
import { PixelNFTRecord } from '@/types/nft';

export class PixelNFTModel {
  
  /**
   * Fetch all NFT pixel records from the database
   */
  static async getAll(): Promise<PixelNFTRecord[]> {
    try {
      const { data, error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching NFT records:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      return data.map((record: PixelNFTDatabase) => fromDatabaseRecord(record));
    } catch (error) {
      console.error('Failed to fetch NFT records:', error);
      throw error;
    }
  }

  /**
   * Get NFT records by specific pixel coordinates
   */
  static async getByPixelCoordinates(x: number, y: number): Promise<PixelNFTRecord[]> {
    try {
      const { data, error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('*')
        .lte('start_x', x)
        .gte('end_x', x)
        .lte('start_y', y)
        .gte('end_y', y);

      if (error) {
        console.error('Error fetching NFT by coordinates:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      return data.map((record: PixelNFTDatabase) => fromDatabaseRecord(record));
    } catch (error) {
      console.error('Failed to fetch NFT by coordinates:', error);
      throw error;
    }
  }

  /**
   * Get NFT record by NFT mint address
   */
  static async getByMintAddress(mintAddress: string): Promise<PixelNFTRecord | null> {
    try {
      const { data, error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('*')
        .eq('nft_mint_address', mintAddress)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found
          return null;
        }
        console.error('Error fetching NFT by mint address:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return data ? fromDatabaseRecord(data) : null;
    } catch (error) {
      console.error('Failed to fetch NFT by mint address:', error);
      throw error;
    }
  }

  /**
   * Get NFT records by owner wallet
   */
  static async getByOwner(ownerWallet: string): Promise<PixelNFTRecord[]> {
    try {
      const { data, error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('*')
        .eq('owner_wallet', ownerWallet)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching NFTs by owner:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      return data.map((record: PixelNFTDatabase) => fromDatabaseRecord(record));
    } catch (error) {
      console.error('Failed to fetch NFTs by owner:', error);
      throw error;
    }
  }

  /**
   * Create a new NFT pixel record
   */
  static async create(nftData: Omit<PixelNFTRecord, 'id'>): Promise<PixelNFTRecord> {
    try {
      // Validate that the pixel area is not already occupied
      const existingNFTs = await this.getPixelsInRange(
        nftData.startX, 
        nftData.startY, 
        nftData.endX, 
        nftData.endY
      );

      if (existingNFTs.length > 0) {
        throw new Error('Some pixels in the specified range are already occupied by other NFTs');
      }

      // Convert to database format
      const dbRecord = toDatabaseRecord(nftData);

      const { data, error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .insert([dbRecord])
        .select()
        .single();

      if (error) {
        console.error('Error creating NFT record:', error);
        throw new Error(`Database insert failed: ${error.message}`);
      }

      return fromDatabaseRecord(data);
    } catch (error) {
      console.error('Failed to create NFT record:', error);
      throw error;
    }
  }

  /**
   * Update an existing NFT pixel record
   */
  static async update(id: string, updates: Partial<Omit<PixelNFTRecord, 'id'>>): Promise<PixelNFTRecord> {
    try {
      const dbUpdates = toDatabaseRecord(updates as Omit<PixelNFTRecord, 'id'>);

      const { data, error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .update({ ...dbUpdates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating NFT record:', error);
        throw new Error(`Database update failed: ${error.message}`);
      }

      return fromDatabaseRecord(data);
    } catch (error) {
      console.error('Failed to update NFT record:', error);
      throw error;
    }
  }

  /**
   * Delete an NFT pixel record
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting NFT record:', error);
        throw new Error(`Database delete failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to delete NFT record:', error);
      throw error;
    }
  }

  /**
   * Check if pixels in a given range are available
   */
  static async arePixelsAvailable(startX: number, startY: number, endX: number, endY: number): Promise<boolean> {
    try {
      const existingNFTs = await this.getPixelsInRange(startX, startY, endX, endY);
      return existingNFTs.length === 0;
    } catch (error) {
      console.error('Failed to check pixel availability:', error);
      throw error;
    }
  }

  /**
   * Get all NFTs that overlap with a given pixel range
   */
  static async getPixelsInRange(startX: number, startY: number, endX: number, endY: number): Promise<PixelNFTRecord[]> {
    try {
      // Query for overlapping rectangles using SQL overlap logic
      const { data, error } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('*')
        .not('start_x', 'gt', endX)   // Not (start_x > endX)
        .not('end_x', 'lt', startX)   // Not (end_x < startX)
        .not('start_y', 'gt', endY)   // Not (start_y > endY)
        .not('end_y', 'lt', startY);  // Not (end_y < startY)

      if (error) {
        console.error('Error checking pixel range:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      return data.map((record: PixelNFTDatabase) => fromDatabaseRecord(record));
    } catch (error) {
      console.error('Failed to check pixel range:', error);
      throw error;
    }
  }

  /**
   * Get statistics about the pixel grid
   */
  static async getGridStatistics(): Promise<{
    totalNFTs: number;
    totalPixelsOccupied: number;
    uniqueOwners: number;
  }> {
    try {
      const { data: countData, error: countError } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('id', { count: 'exact' });

      if (countError) {
        throw new Error(`Failed to count NFTs: ${countError.message}`);
      }

      const { data: pixelData, error: pixelError } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('start_x, start_y, end_x, end_y');

      if (pixelError) {
        throw new Error(`Failed to fetch pixel data: ${pixelError.message}`);
      }

      // Get unique owners using a separate query
      const { data: allData, error: allError } = await supabase
        .from(PIXEL_NFT_TABLE)
        .select('owner_wallet');

      if (allError) {
        throw new Error(`Failed to fetch owner data: ${allError.message}`);
      }

      // Count unique owners manually
      const uniqueOwners = new Set(allData?.map(row => row.owner_wallet) || []).size;

      // Calculate total pixels occupied
      const totalPixelsOccupied = pixelData?.reduce((total, nft) => {
        const width = nft.end_x - nft.start_x + 1;
        const height = nft.end_y - nft.start_y + 1;
        return total + (width * height);
      }, 0) || 0;

      return {
        totalNFTs: countData?.length || 0,
        totalPixelsOccupied,
        uniqueOwners
      };
    } catch (error) {
      console.error('Failed to get grid statistics:', error);
      throw error;
    }
  }
} 