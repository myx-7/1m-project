import mongoose from 'mongoose';
import { PixelNFTModel } from '@/models/PixelNFT';
import { PixelNFTRecord } from '@/types/nft';

// Type definitions for lean queries
type PixelNFTLean = {
  _id: mongoose.Types.ObjectId;
  id: string;
  pixelIds: number[];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageUrl: string;
  metadataUrl: string;
  nftMintAddress: string;
  ownerWallet: string;
  transactionSignature: string;
  createdAt: Date;
  updatedAt: Date;
};

// This is a legacy MongoDB-based implementation
// The actual implementation now uses Supabase through PixelNFTModel
// Keeping this for backward compatibility and potential future use

// MongoDB connection helper
export async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME || 'million-dollar-homepage'
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// Pixel ownership and availability functions
export class PixelDatabase {
  
  // Check if pixels are available for purchase
  static async arePixelsAvailable(pixelIds: number[]): Promise<boolean> {
    // Use Supabase implementation
    const startX = Math.min(...pixelIds.map(id => id % 1000));
    const startY = Math.min(...pixelIds.map(id => Math.floor(id / 1000)));
    const endX = Math.max(...pixelIds.map(id => id % 1000));
    const endY = Math.max(...pixelIds.map(id => Math.floor(id / 1000)));
    
    return await PixelNFTModel.arePixelsAvailable(startX, startY, endX, endY);
  }

  // Find all pixels owned by a wallet
  static async getPixelsByOwner(ownerWallet: string): Promise<PixelNFTRecord[]> {
    return await PixelNFTModel.getByOwner(ownerWallet);
  }

  // Find pixel by coordinates
  static async getPixelByCoordinates(x: number, y: number): Promise<PixelNFTRecord | null> {
    const pixels = await PixelNFTModel.getByPixelCoordinates(x, y);
    return pixels.length > 0 ? pixels[0] : null;
  }

  // Find overlapping pixels for conflict detection
  static async findOverlappingPixels(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
  ): Promise<PixelNFTRecord[]> {
    return await PixelNFTModel.getPixelsInRange(startX, startY, endX, endY);
  }

  // Get total statistics
  static async getStatistics() {
    return await PixelNFTModel.getGridStatistics();
  }

  // Get recent activities
  static async getRecentActivities(limit: number = 10): Promise<PixelNFTRecord[]> {
    const allPixels = await PixelNFTModel.getAll();
    return allPixels.slice(0, limit);
  }

  // Bulk insert pixels (for data migration or seeding)
  static async bulkInsertPixels(pixels: Omit<PixelNFTRecord, 'id'>[]): Promise<void> {
    try {
      for (const pixel of pixels) {
        await PixelNFTModel.create(pixel);
      }
      console.log(`✅ Bulk inserted ${pixels.length} pixel NFTs`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        console.log(`⚠️ Some duplicates skipped during bulk insert: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // Delete pixel NFT (admin function)
  static async deletePixelNFT(nftMintAddress: string): Promise<boolean> {
    try {
      const pixel = await PixelNFTModel.getByMintAddress(nftMintAddress);
      if (pixel) {
        return await PixelNFTModel.delete(pixel.id);
      }
      return false;
    } catch (error) {
      console.error('Failed to delete pixel NFT:', error);
      return false;
    }
  }

  // Update pixel NFT (for corrections)
  static async updatePixelNFT(
    nftMintAddress: string, 
    updates: Partial<PixelNFTRecord>
  ): Promise<PixelNFTRecord | null> {
    try {
      const pixel = await PixelNFTModel.getByMintAddress(nftMintAddress);
      if (pixel) {
        return await PixelNFTModel.update(pixel.id, updates);
      }
      return null;
    } catch (error) {
      console.error('Failed to update pixel NFT:', error);
      return null;
    }
  }

  // Validate pixel selection before minting
  static async validatePixelSelection(
    pixelIds: number[],
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Promise<{ valid: boolean; error?: string }> {
    // Check coordinate bounds
    if (startX < 0 || startY < 0 || endX >= 1000 || endY >= 1000) {
      return { valid: false, error: 'Coordinates out of bounds' };
    }

    // Check coordinate consistency
    if (startX > endX || startY > endY) {
      return { valid: false, error: 'Invalid coordinate range' };
    }

    // Check pixel count consistency
    const expectedPixelCount = (endX - startX + 1) * (endY - startY + 1);
    if (pixelIds.length !== expectedPixelCount) {
      return { valid: false, error: 'Pixel count mismatch' };
    }

    // Check for conflicts
    const conflicts = await this.findOverlappingPixels(startX, startY, endX, endY);
    if (conflicts.length > 0) {
      return { valid: false, error: 'Some pixels are already owned' };
    }

    return { valid: true };
  }
}

export default PixelDatabase; 