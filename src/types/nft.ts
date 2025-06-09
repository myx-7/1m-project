export interface PixelNFTRecord {
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
  createdAt: string;
}

export interface FetchPixelsResponse {
  success: boolean;
  pixels?: PixelNFTRecord[];
  error?: string;
}

export const GRID_SIZE = 1000; 


export interface PixelNFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
  };
}

export const PIXEL_PRICE_SOL = 0.001; // 0.001 SOL per pixel
