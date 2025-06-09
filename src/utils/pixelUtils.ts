import { PixelNFTRecord, FetchPixelsResponse } from "@/types/nft";
import { fetchPixelsAPI } from "@/api/pixels";

export const getPixelFromMouse = (
  e: React.MouseEvent | React.TouchEvent,
  canvas: HTMLCanvasElement,
  pixelSize: number,
  gridWidth: number,
  gridHeight: number,
  pan: { x: number; y: number } = { x: 0, y: 0 },
  zoom: number = 1
) => {
  const rect = canvas.getBoundingClientRect();
  
  // Get mouse/touch coordinates
  let clientX: number, clientY: number;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  } else {
    return null;
  }
  
  // Transform coordinates accounting for pan and zoom
  const canvasX = clientX - rect.left;
  const canvasY = clientY - rect.top;
  
  const worldX = (canvasX - pan.x) / pixelSize;
  const worldY = (canvasY - pan.y) / pixelSize;
  
  const x = Math.floor(worldX);
  const y = Math.floor(worldY);

  if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
    return { x, y, key: `${x},${y}` };
  }
  return null;
};

export const calculatePixelSize = (
  containerWidth: number,
  containerHeight: number,
  gridWidth: number,
  gridHeight: number
) => {
  const maxWidth = containerWidth - 10;
  const maxHeight = containerHeight - 10;
  
  const maxPixelWidth = Math.floor(maxWidth / gridWidth);
  const maxPixelHeight = Math.floor(maxHeight / gridHeight);
  return Math.max(4, Math.min(maxPixelWidth, maxPixelHeight, 20));
};

// API fetch function for NFT records using mock API
export const fetchNFTRecords = async (): Promise<FetchPixelsResponse> => {
  try {
    const response = await fetchPixelsAPI();
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch NFT records:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Convert NFT records to sold pixels set
export const convertNFTsToSoldPixels = (nftRecords: PixelNFTRecord[]): Set<string> => {
  const soldPixelsSet = new Set<string>();
  
  nftRecords.forEach(nft => {
    for (let x = nft.startX; x <= nft.endX; x++) {
      for (let y = nft.startY; y <= nft.endY; y++) {
        soldPixelsSet.add(`${x},${y}`);
      }
    }
  });
  
  return soldPixelsSet;
};

// Create NFT-to-coordinate mapping for efficient lookups
export const createNFTImageMap = (nftRecords: PixelNFTRecord[]): Map<string, { nft: PixelNFTRecord; imageLoaded: boolean }> => {
  const map = new Map<string, { nft: PixelNFTRecord; imageLoaded: boolean }>();
  
  nftRecords.forEach(nft => {
    for (let x = nft.startX; x <= nft.endX; x++) {
      for (let y = nft.startY; y <= nft.endY; y++) {
        map.set(`${x},${y}`, { nft, imageLoaded: false });
      }
    }
  });
  
  return map;
};
