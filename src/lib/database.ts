import mongoose from 'mongoose';
import PixelNFT, { IPixelNFT } from '@/models/PixelNFT';

// Type for lean query results
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
    await connectToDatabase();
    
    const existingPixels = await PixelNFT.find({
      pixelIds: { $in: pixelIds }
    }).lean();
    
    return existingPixels.length === 0;
  }

  // Find all pixels owned by a wallet
  static async getPixelsByOwner(ownerWallet: string): Promise<PixelNFTLean[]> {
    await connectToDatabase();
    
    return await PixelNFT.find({ ownerWallet })
      .sort({ createdAt: -1 })
      .lean() as unknown as PixelNFTLean[];
  }

  // Find pixel by coordinates
  static async getPixelByCoordinates(x: number, y: number): Promise<PixelNFTLean | null> {
    await connectToDatabase();
    
    return await PixelNFT.findOne({
      startX: { $lte: x },
      endX: { $gte: x },
      startY: { $lte: y },
      endY: { $gte: y }
    }).lean() as unknown as PixelNFTLean | null;
  }

  // Find overlapping pixels for conflict detection
  static async findOverlappingPixels(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
  ): Promise<PixelNFTLean[]> {
    await connectToDatabase();
    
    return await PixelNFT.find({
      $or: [
        {
          startX: { $lte: endX },
          endX: { $gte: startX },
          startY: { $lte: endY },
          endY: { $gte: startY }
        }
      ]
    }).lean() as unknown as PixelNFTLean[];
  }

  // Get total statistics
  static async getStatistics() {
    await connectToDatabase();
    
    const stats = await PixelNFT.aggregate([
      {
        $group: {
          _id: null,
          totalNFTs: { $sum: 1 },
          totalPixels: { $sum: { $size: '$pixelIds' } },
          uniqueOwners: { $addToSet: '$ownerWallet' },
          totalValueSOL: { $sum: { $multiply: [{ $size: '$pixelIds' }, 0.001] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalNFTs: 1,
          totalPixels: 1,
          uniqueOwners: { $size: '$uniqueOwners' },
          totalValueSOL: 1,
          averagePixelsPerNFT: { $divide: ['$totalPixels', '$totalNFTs'] }
        }
      }
    ]);

    return stats[0] || {
      totalNFTs: 0,
      totalPixels: 0,
      uniqueOwners: 0,
      totalValueSOL: 0,
      averagePixelsPerNFT: 0
    };
  }

  // Get recent activities
  static async getRecentActivities(limit: number = 10): Promise<PixelNFTLean[]> {
    await connectToDatabase();
    
    return await PixelNFT.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as unknown as PixelNFTLean[];
  }

  // Bulk insert pixels (for data migration or seeding)
  static async bulkInsertPixels(pixels: Omit<IPixelNFT, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    await connectToDatabase();
    
    try {
      await PixelNFT.insertMany(pixels, { ordered: false });
      console.log(`✅ Bulk inserted ${pixels.length} pixel NFTs`);
    } catch (error: any) {
      if (error.code === 11000) {
        console.log(`⚠️ Some duplicates skipped during bulk insert`);
      } else {
        throw error;
      }
    }
  }

  // Delete pixel NFT (admin function)
  static async deletePixelNFT(nftMintAddress: string): Promise<boolean> {
    await connectToDatabase();
    
    const result = await PixelNFT.deleteOne({ nftMintAddress });
    return result.deletedCount > 0;
  }

  // Update pixel NFT (for corrections)
  static async updatePixelNFT(
    nftMintAddress: string, 
    updates: Partial<IPixelNFT>
  ): Promise<PixelNFTLean | null> {
    await connectToDatabase();
    
    return await PixelNFT.findOneAndUpdate(
      { nftMintAddress },
      updates,
      { new: true, runValidators: true }
    ).lean() as unknown as PixelNFTLean | null;
  }

  // Validate pixel selection before minting
  static async validatePixelSelection(
    pixelIds: number[],
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Promise<{ valid: boolean; error?: string }> {
    await connectToDatabase();

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