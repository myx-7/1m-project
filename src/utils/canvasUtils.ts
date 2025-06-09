import { PixelNFTRecord } from "@/types/nft";

// Image cache for NFT images
const imageCache = new Map<string, HTMLImageElement>();

// Preload NFT images for better performance
export const preloadNFTImage = (imageUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(imageUrl)) {
      resolve(imageCache.get(imageUrl)!);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(imageUrl, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

export const drawPixelGrid = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  {
    gridWidth,
    gridHeight,
    pixelSize,
    selectedPixels,
    hoveredPixel,
    soldPixels,
    nftRecords = [],
    theme,
    pan = { x: 0, y: 0 },
    zoom = 1,
    containerDimensions
  }: {
    gridWidth: number;
    gridHeight: number;
    pixelSize: number;
    selectedPixels: Set<string>;
    hoveredPixel: string | null;
    soldPixels: Set<string>;
    nftRecords?: PixelNFTRecord[];
    theme: string;
    pan?: { x: number; y: number };
    zoom?: number;
    containerDimensions?: { width: number; height: number };
  }
) => {
  // Performance optimization: disable image smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#fafafa';
  const availableColor = isDark ? '#1a1a1a' : '#ffffff';
  const hoveredColor = isDark ? '#333333' : '#e5e5e5';
  const selectedColor = isDark ? '#ffffff' : '#000000';
  const gridLineColor = isDark ? '#ffffff08' : '#00000008';

  // Clear canvas efficiently
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply transform once
  ctx.save();
  ctx.translate(pan.x, pan.y);

  // Calculate visible area for culling (performance optimization)
  const safePixelSize = Math.max(1, pixelSize);
  const visibleStartX = Math.max(0, Math.floor(-pan.x / safePixelSize) - 1);
  const visibleEndX = Math.min(gridWidth, Math.ceil((canvas.width - pan.x) / safePixelSize) + 1);
  const visibleStartY = Math.max(0, Math.floor(-pan.y / safePixelSize) - 1);
  const visibleEndY = Math.min(gridHeight, Math.ceil((canvas.height - pan.y) / safePixelSize) + 1);

  // Create NFT mapping for efficient lookups
  const nftMap = new Map<string, PixelNFTRecord>();
  const nftRects = new Map<string, { startX: number; startY: number; width: number; height: number }>();
  
  nftRecords.forEach(nft => {
    const rectKey = `${nft.startX},${nft.startY}`;
    nftRects.set(rectKey, {
      startX: nft.startX,
      startY: nft.startY,
      width: nft.endX - nft.startX + 1,
      height: nft.endY - nft.startY + 1
    });
    
    for (let x = nft.startX; x <= nft.endX; x++) {
      for (let y = nft.startY; y <= nft.endY; y++) {
        nftMap.set(`${x},${y}`, nft);
      }
    }
  });

  // Batch operations by color for better performance
  const pixelsByColor = new Map<string, Array<{x: number, y: number}>>();
  const nftPixels = new Map<string, Array<{x: number, y: number}>>();
  
  for (let x = visibleStartX; x < visibleEndX; x++) {
    for (let y = visibleStartY; y < visibleEndY; y++) {
      const pixelKey = `${x},${y}`;
      const isSelected = selectedPixels.has(pixelKey);
      const isHovered = hoveredPixel === pixelKey;
      const isSold = soldPixels.has(pixelKey);
      const nft = nftMap.get(pixelKey);

      let fillStyle = availableColor;

      if (nft) {
        // Mark as NFT pixel for later image rendering
        if (!nftPixels.has(nft.id)) {
          nftPixels.set(nft.id, []);
        }
        nftPixels.get(nft.id)!.push({x, y});
        continue; // Skip color batching for NFT pixels
      } else if (isSold) {
        const colors = isDark 
          ? ['#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#1a1a1a', '#0a0a0a', '#050505']
          : ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3'];
        fillStyle = colors[((x * 7 + y * 3) % colors.length)];
      } else if (isSelected) {
        fillStyle = selectedColor;
      } else if (isHovered) {
        fillStyle = hoveredColor;
      }

      if (!pixelsByColor.has(fillStyle)) {
        pixelsByColor.set(fillStyle, []);
      }
      pixelsByColor.get(fillStyle)!.push({x, y});
    }
  }

  // Draw regular pixels in batches by color
  for (const [color, pixels] of pixelsByColor) {
    ctx.fillStyle = color;
    ctx.beginPath();
    
    for (const {x, y} of pixels) {
      const pixelX = x * safePixelSize;
      const pixelY = y * safePixelSize;
      const pixelWidth = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
      const pixelHeight = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
      
      if (safePixelSize > 3) {
        const radius = Math.min(2, safePixelSize / 8);
        ctx.roundRect(pixelX, pixelY, pixelWidth, pixelHeight, radius);
      } else {
        ctx.rect(pixelX, pixelY, pixelWidth, pixelHeight);
      }
    }
    ctx.fill();
  }

  // Draw NFT images
  for (const [nftId, pixels] of nftPixels) {
    const nft = nftRecords.find(n => n.id === nftId);
    if (!nft) continue;

    const cachedImage = imageCache.get(nft.imageUrl);
    if (cachedImage) {
      // Draw the NFT image over the entire rectangle
      const nftX = nft.startX * safePixelSize;
      const nftY = nft.startY * safePixelSize;
      const nftWidth = (nft.endX - nft.startX + 1) * safePixelSize;
      const nftHeight = (nft.endY - nft.startY + 1) * safePixelSize;

      // Save context for clipping
      ctx.save();
      
      // Create clipping path for rounded corners if pixel size is large enough
      if (safePixelSize > 3) {
        const radius = Math.min(2, safePixelSize / 8);
        ctx.beginPath();
        ctx.roundRect(nftX, nftY, nftWidth, nftHeight, radius);
        ctx.clip();
      }

      // Draw the NFT image
      ctx.drawImage(cachedImage, nftX, nftY, nftWidth, nftHeight);
      
      // Add subtle border around NFT area
      ctx.strokeStyle = isDark ? '#ffffff20' : '#00000020';
      ctx.lineWidth = Math.max(0.5, safePixelSize / 20);
      ctx.strokeRect(nftX, nftY, nftWidth, nftHeight);
      
      ctx.restore();
    } else {
      // Fallback: draw colored rectangles for NFT areas without loaded images
      ctx.fillStyle = isDark ? '#444444' : '#dddddd';
      
      for (const {x, y} of pixels) {
        const pixelX = x * safePixelSize;
        const pixelY = y * safePixelSize;
        const pixelWidth = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
        const pixelHeight = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
        
        if (safePixelSize > 3) {
          const radius = Math.min(2, safePixelSize / 8);
          ctx.beginPath();
          ctx.roundRect(pixelX, pixelY, pixelWidth, pixelHeight, radius);
          ctx.fill();
        } else {
          ctx.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
        }
      }

      // Try to preload the image for next frame
      preloadNFTImage(nft.imageUrl).catch(() => {
        // Silently handle image loading errors
      });
    }
  }

  // Draw selection indicators (only for visible selected pixels)
  if (selectedPixels.size > 0 && safePixelSize > 3) {
    ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
    ctx.lineWidth = Math.max(1, safePixelSize / 12);
    
    for (let x = visibleStartX; x < visibleEndX; x++) {
      for (let y = visibleStartY; y < visibleEndY; y++) {
        const pixelKey = `${x},${y}`;
        if (selectedPixels.has(pixelKey)) {
          const pixelX = x * safePixelSize;
          const pixelY = y * safePixelSize;
          const pixelWidth = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
          const pixelHeight = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
          const inset = Math.max(1, Math.floor(safePixelSize / 10));
          
          ctx.strokeRect(pixelX + inset, pixelY + inset, pixelWidth - 2 * inset, pixelHeight - 2 * inset);
        }
      }
    }
  }

  // Draw hover indicator
  if (hoveredPixel && safePixelSize > 2) {
    const [hx, hy] = hoveredPixel.split(',').map(Number);
    if (hx >= visibleStartX && hx < visibleEndX && hy >= visibleStartY && hy < visibleEndY && !selectedPixels.has(hoveredPixel)) {
      ctx.strokeStyle = isDark ? '#ffffff40' : '#00000040';
      ctx.lineWidth = Math.max(0.5, safePixelSize / 16);
      const pixelX = hx * safePixelSize;
      const pixelY = hy * safePixelSize;
      const pixelWidth = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
      const pixelHeight = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
      ctx.strokeRect(pixelX, pixelY, pixelWidth, pixelHeight);
    }
  }

  // Draw grid lines only when very zoomed in (performance optimization)
  if (safePixelSize > 20) {
    ctx.strokeStyle = gridLineColor;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    
    // Vertical lines
    for (let x = visibleStartX; x <= visibleEndX; x++) {
      const lineX = x * safePixelSize;
      ctx.moveTo(lineX, visibleStartY * safePixelSize);
      ctx.lineTo(lineX, visibleEndY * safePixelSize);
    }
    
    // Horizontal lines
    for (let y = visibleStartY; y <= visibleEndY; y++) {
      const lineY = y * safePixelSize;
      ctx.moveTo(visibleStartX * safePixelSize, lineY);
      ctx.lineTo(visibleEndX * safePixelSize, lineY);
    }
    
    ctx.stroke();
  }

  ctx.restore();
};
