// Pixel data interface
export interface PixelData {
  id: string;
  x: number;
  y: number;
  linkUrl?: string;
}

// NFT metadata interface for Solana/Metaplex
export interface PixelNFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
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

// Pixel pricing constant
export const PIXEL_PRICE_SOL = 0.01; // 0.01 SOL per pixel

// Grid selection interface
export interface GridSelection {
  pixels: PixelData[];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Minting state interface
export interface MintingState {
  isLoading: boolean;
  success?: boolean;
  error?: string;
  transactionSignature?: string;
  currentStep?: 'uploading' | 'minting' | 'saving';
}

// API response for saving pixel NFT
export interface SavePixelResponse {
  success: boolean;
  record?: Record<string, unknown>;
  error?: string;
} 