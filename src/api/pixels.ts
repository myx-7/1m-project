import { PixelNFTRecord, FetchPixelsResponse } from "@/types/nft";
import { PixelNFTModel } from "@/models/PixelNFT";
import { checkDatabaseConnection } from "@/db/database";

// API Response types
export interface CreatePixelNFTRequest {
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
}

export interface CreatePixelNFTResponse {
  success: boolean;
  nft?: PixelNFTRecord;
  error?: string;
}

export interface GridStatisticsResponse {
  success: boolean;
  statistics?: {
    totalNFTs: number;
    totalPixelsOccupied: number;
    uniqueOwners: number;
  };
  error?: string;
}

// Environment flag to enable/disable database
const USE_DATABASE = import.meta.env.VITE_USE_DATABASE === 'true';

// Simulate API delay
const simulateNetworkDelay = (ms: number = 200): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * GET /api/pixels - Fetch all NFT pixel records
 */
export const fetchPixelsAPI = async (): Promise<FetchPixelsResponse> => {
  try {
    console.log('🔄 Fetching NFT pixel records...');
    
    if (USE_DATABASE) {
      // Check database connection first
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected) {
        console.warn('⚠️ Database connection failed, falling back to mock data');
        await simulateNetworkDelay(300);
        return {
          success: true,
          pixels: []
        };
      }

      // Fetch from database
      const pixels = await PixelNFTModel.getAll();
      console.log(`✅ Fetched ${pixels.length} NFT records from database`);
      
      return {
        success: true,
        pixels
      };
    } else {
      // Use mock data
      console.log('🎭 Using mock data (database disabled)');
      await simulateNetworkDelay(300);
      
      // Simulate occasional API failures (5% chance)
      if (Math.random() < 0.05) {
        throw new Error("Simulated network error");
      }
      
      return {
        success: true,
        pixels: []
      };
    }
  } catch (error) {
    console.error("❌ API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * POST /api/pixels - Create a new NFT pixel record
 */
export const createPixelNFTAPI = async (nftData: CreatePixelNFTRequest): Promise<CreatePixelNFTResponse> => {
  try {
    console.log('🔄 Creating new NFT pixel record...');
    
    // Validate input data
    if (!nftData.nftMintAddress || !nftData.ownerWallet || !nftData.transactionSignature) {
      throw new Error('Missing required fields: nftMintAddress, ownerWallet, or transactionSignature');
    }

    if (nftData.startX < 0 || nftData.startY < 0 || nftData.endX >= 100 || nftData.endY >= 100) {
      throw new Error('Invalid pixel coordinates: must be within 100x100 grid');
    }

    if (nftData.startX > nftData.endX || nftData.startY > nftData.endY) {
      throw new Error('Invalid pixel range: start coordinates must be less than or equal to end coordinates');
    }

    if (USE_DATABASE) {
      // Check database connection
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      // Create the NFT record with current timestamp
      const newNFT = await PixelNFTModel.create({
        ...nftData,
        createdAt: new Date().toISOString()
      });

      console.log(`✅ Created NFT record with ID: ${newNFT.id}`);
      
      return {
        success: true,
        nft: newNFT
      };
    } else {
      // Simulate creation with mock data
      console.log('🎭 Simulating NFT creation (database disabled)');
      await simulateNetworkDelay(500);
      
      const mockNFT: PixelNFTRecord = {
        id: `mock_${Date.now()}`,
        ...nftData,
        createdAt: new Date().toISOString()
      };
      
      return {
        success: true,
        nft: mockNFT
      };
    }
  } catch (error) {
    console.error("❌ Failed to create NFT:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * GET /api/pixels/statistics - Get grid statistics
 */
export const getGridStatisticsAPI = async (): Promise<GridStatisticsResponse> => {
  try {
    console.log('🔄 Fetching grid statistics...');
    
    if (USE_DATABASE) {
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected) {
        console.warn('⚠️ Database connection failed, using mock statistics');
        await simulateNetworkDelay(200);
        return {
          success: true,
          statistics: {
            totalNFTs: 0,
            totalPixelsOccupied: 0,
            uniqueOwners: 0
          }
        };
      }

      const statistics = await PixelNFTModel.getGridStatistics();
      console.log('✅ Fetched grid statistics from database');
      
      return {
        success: true,
        statistics
      };
    } else {
      // Mock statistics
      await simulateNetworkDelay(200);
      return {
        success: true,
        statistics: {
          totalNFTs: 0,
          totalPixelsOccupied: 0,
          uniqueOwners: 0
        }
      };
    }
  } catch (error) {
    console.error("❌ Failed to get statistics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * GET /api/pixels/owner/:wallet - Get NFTs by owner wallet
 */
export const getPixelsByOwnerAPI = async (ownerWallet: string): Promise<FetchPixelsResponse> => {
  try {
    console.log(`🔄 Fetching NFTs for owner: ${ownerWallet}`);
    
    if (USE_DATABASE) {
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected) {
        // Filter mock data by owner
        return {
          success: true,
          pixels: []
        };
      }

      const pixels = await PixelNFTModel.getByOwner(ownerWallet);
      console.log(`✅ Found ${pixels.length} NFTs for owner`);
      
      return {
        success: true,
        pixels
      };
    } else {
      // Filter mock data
      await simulateNetworkDelay(200);
      
      return {
        success: true,
        pixels: []
      };
    }
  } catch (error) {
    console.error("❌ Failed to fetch NFTs by owner:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * POST /api/pixels/availability - Check if pixels are available
 */
export const checkPixelAvailabilityAPI = async (
  startX: number, 
  startY: number, 
  endX: number, 
  endY: number
): Promise<{ success: boolean; available?: boolean; error?: string }> => {
  try {
    console.log(`🔄 Checking availability for pixels (${startX},${startY}) to (${endX},${endY})`);
    
    if (USE_DATABASE) {
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected) {
        // Check against mock data
        return {
          success: true,
          available: false
        };
      }

      const available = await PixelNFTModel.arePixelsAvailable(startX, startY, endX, endY);
      console.log(`✅ Pixel availability check: ${available ? 'Available' : 'Occupied'}`);
      
      return {
        success: true,
        available
      };
    } else {
      // Check against mock data
      await simulateNetworkDelay(100);
      
      return {
        success: true,
        available: false
      };
    }
  } catch (error) {
    console.error("❌ Failed to check pixel availability:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}; 