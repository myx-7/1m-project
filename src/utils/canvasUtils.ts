
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
    theme: string;
    pan?: { x: number; y: number };
    zoom?: number;
    containerDimensions?: { width: number; height: number };
  }
) => {
  // Performance optimization: disable image smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#0a0a0a' : '#fafafa';
  const availableColor = isDark ? '#1a1a1a' : '#ffffff';
  const hoveredColor = isDark ? '#2d2d2d' : '#f0f0f0';
  const selectedColor = isDark ? '#3b82f6' : '#2563eb';
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

  // Batch operations by color for better performance
  const pixelsByColor = new Map<string, Array<{x: number, y: number}>>();
  
  for (let x = visibleStartX; x < visibleEndX; x++) {
    for (let y = visibleStartY; y < visibleEndY; y++) {
      const pixelKey = `${x},${y}`;
      const isSelected = selectedPixels.has(pixelKey);
      const isHovered = hoveredPixel === pixelKey;
      const isSold = soldPixels.has(pixelKey);

      let fillStyle = availableColor;

      if (isSold) {
        const colors = isDark 
          ? ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1']
          : ['#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2', '#ea580c', '#65a30d', '#db2777', '#4f46e5'];
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

  // Draw pixels in batches by color
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
