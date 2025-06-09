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

// Mock NFT data for fallback when database is not available
const mockNFTData: PixelNFTRecord[] = [
  {
    id: "nft_001",
    pixelIds: [1010, 1011, 1110, 1111],
    startX: 10,
    startY: 10,
    endX: 11,
    endY: 11,
    imageUrl: "https://picsum.photos/400/400?random=1",
    metadataUrl: "https://api.example.com/metadata/nft_001",
    nftMintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    ownerWallet: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    transactionSignature: "5VfN7Q8KqPb79RkJ4yq5rNX2YW9JrZ3C8H4A1xV2B6uE9T3M7L",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "nft_002",
    pixelIds: [2525, 2526, 2527, 2625, 2626, 2627],
    startX: 25,
    startY: 25,
    endX: 27,
    endY: 26,
    imageUrl: "https://picsum.photos/400/400?random=2",
    metadataUrl: "https://api.example.com/metadata/nft_002",
    nftMintAddress: "8yLXvh3DW98e86TYJTEqbE6kBkheTqA83TZRuJpthBtV",
    ownerWallet: "AdzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtBXXN",
    transactionSignature: "6WgO8R9LrQc89SjK5zr6sOY3ZX0KsA4D9I5B2yW3C7vF0U4N8M",
    createdAt: "2024-01-16T14:45:00Z"
  },
  {
    id: "nft_003",
    pixelIds: [5050, 5051, 5052, 5150, 5151, 5152, 5250, 5251, 5252],
    startX: 50,
    startY: 50,
    endX: 52,
    endY: 52,
    imageUrl: "https://picsum.photos/400/400?random=3",
    metadataUrl: "https://api.example.com/metadata/nft_003",
    nftMintAddress: "9zMYwi4EX09f97UKJUFrcF7lCkheTqA83TZRuJosgAsU",
    ownerWallet: "BezDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtCYYO",
    transactionSignature: "7XhP9S0MsRd90TkL6As7tPZ4aY1LtB5E0J6C3zX4D8wG1V5O9N",
    createdAt: "2024-01-17T09:15:00Z"
  },
  {
    id: "nft_004",
    pixelIds: [7530, 7531, 7630, 7631],
    startX: 75,
    startY: 30,
    endX: 76,
    endY: 31,
    imageUrl: "https://picsum.photos/400/400?random=4",
    metadataUrl: "https://api.example.com/metadata/nft_004",
    nftMintAddress: "AzNZxj5FY10g08VLKVGsdG8mDkheTqA83TZRuLrukDuX",
    ownerWallet: "CfzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtDZZP",
    transactionSignature: "8YiQ0T1NtSe01UmM7Bt8uQa5bZ2MuC6F1K7D4AY5E9xH2W6P0O",
    createdAt: "2024-01-18T16:20:00Z"
  },
  {
    id: "nft_005",
    pixelIds: [2070, 2071, 2072, 2170, 2171, 2172],
    startX: 20,
    startY: 70,
    endX: 22,
    endY: 71,
    imageUrl: "https://picsum.photos/400/400?random=5",
    metadataUrl: "https://api.example.com/metadata/nft_005",
    nftMintAddress: "BzOayj6GZ21h19WMKWHteH9nEkheTqA83TZRuMsvlEvY",
    ownerWallet: "DgzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtEAAQ",
    transactionSignature: "9ZjR1U2OuTf12VnN8Cu9vRb6ca3NvD7G2L8E5BZ6F0yI3X7Q1P",
    createdAt: "2024-01-19T11:10:00Z"
  },
  {
    id: "nft_006",
    pixelIds: [8080, 8081, 8082, 8180, 8181, 8182],
    startX: 80,
    startY: 80,
    endX: 82,
    endY: 81,
    imageUrl: "https://picsum.photos/400/400?random=6",
    metadataUrl: "https://api.example.com/metadata/nft_006",
    nftMintAddress: "CzPbzk7HaA32i20XLXIufI0oFkheTqA83TZRuNtwmFwZ",
    ownerWallet: "EhzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtFBBR",
    transactionSignature: "AajS2V3PvUg23WoO9Dv0wSc7db4OwE8H3M9F6Ca7G1zJ4Y8R2Q",
    createdAt: "2024-01-20T13:25:00Z"
  }
];

// Simulate API delay
const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
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
          pixels: mockNFTData
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
        pixels: mockNFTData
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
            totalNFTs: mockNFTData.length,
            totalPixelsOccupied: 42,
            uniqueOwners: 3
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
          totalNFTs: mockNFTData.length,
          totalPixelsOccupied: 42,
          uniqueOwners: 3
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
        const ownerNFTs = mockNFTData.filter(nft => nft.ownerWallet === ownerWallet);
        return {
          success: true,
          pixels: ownerNFTs
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
      const ownerNFTs = mockNFTData.filter(nft => nft.ownerWallet === ownerWallet);
      
      return {
        success: true,
        pixels: ownerNFTs
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
        const available = !mockNFTData.some(nft => 
          !(startX > nft.endX || endX < nft.startX || startY > nft.endY || endY < nft.startY)
        );
        return {
          success: true,
          available
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
      const available = !mockNFTData.some(nft => 
        !(startX > nft.endX || endX < nft.startX || startY > nft.endY || endY < nft.startY)
      );
      
      return {
        success: true,
        available
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