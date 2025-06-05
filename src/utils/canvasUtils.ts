
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
  console.log('Drawing pixel grid with:', { gridWidth, gridHeight, pixelSize, pan, zoom });

  // Modern theme-aware colors with better contrast
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#0a0a0a' : '#fafafa';
  const availableColor = isDark ? '#1a1a1a' : '#ffffff';
  const hoveredColor = isDark ? '#2d2d2d' : '#f0f0f0';
  const selectedColor = isDark ? '#3b82f6' : '#2563eb';
  const borderColor = isDark ? '#333333' : '#e5e5e5';
  const gridLineColor = isDark ? '#ffffff08' : '#00000008';

  // Clear canvas with modern background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply pan transformation
  ctx.save();
  ctx.translate(pan.x, pan.y);

  // Calculate visible area for performance
  const safePixelSize = Math.max(1, pixelSize);
  const visibleStartX = Math.max(0, Math.floor(-pan.x / safePixelSize));
  const visibleEndX = Math.min(gridWidth, Math.ceil((canvas.width - pan.x) / safePixelSize) + 1);
  const visibleStartY = Math.max(0, Math.floor(-pan.y / safePixelSize));
  const visibleEndY = Math.min(gridHeight, Math.ceil((canvas.height - pan.y) / safePixelSize) + 1);

  console.log('Visible area:', { visibleStartX, visibleEndX, visibleStartY, visibleEndY });

  // Draw pixels with modern styling
  for (let x = visibleStartX; x < visibleEndX; x++) {
    for (let y = visibleStartY; y < visibleEndY; y++) {
      const pixelKey = `${x},${y}`;
      const isSelected = selectedPixels.has(pixelKey);
      const isHovered = hoveredPixel === pixelKey;
      const isSold = soldPixels.has(pixelKey);

      let fillStyle = availableColor;

      if (isSold) {
        // Modern vibrant colors for sold pixels
        const colors = isDark 
          ? ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1']
          : ['#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2', '#ea580c', '#65a30d', '#db2777', '#4f46e5'];
        fillStyle = colors[((x * 7 + y * 3) % colors.length)];
      } else if (isSelected) {
        fillStyle = selectedColor;
      } else if (isHovered) {
        fillStyle = hoveredColor;
      }

      const pixelX = x * safePixelSize;
      const pixelY = y * safePixelSize;
      const pixelWidth = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));
      const pixelHeight = Math.max(1, safePixelSize - (safePixelSize > 4 ? 1 : 0));

      // Draw pixel with rounded corners for modern look
      if (safePixelSize > 3) {
        const radius = Math.min(2, safePixelSize / 8);
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.roundRect(pixelX, pixelY, pixelWidth, pixelHeight, radius);
        ctx.fill();
      } else {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
      }

      // Modern selection indicator with glow effect
      if (isSelected && safePixelSize > 3) {
        ctx.shadowColor = selectedColor;
        ctx.shadowBlur = safePixelSize / 4;
        ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
        ctx.lineWidth = Math.max(1, safePixelSize / 12);
        const inset = Math.max(1, Math.floor(safePixelSize / 10));
        ctx.strokeRect(pixelX + inset, pixelY + inset, pixelWidth - 2 * inset, pixelHeight - 2 * inset);
        ctx.shadowBlur = 0;
      }

      // Subtle hover effect
      if (isHovered && !isSelected && safePixelSize > 2) {
        ctx.strokeStyle = isDark ? '#ffffff40' : '#00000040';
        ctx.lineWidth = Math.max(0.5, safePixelSize / 16);
        ctx.strokeRect(pixelX, pixelY, pixelWidth, pixelHeight);
      }
    }
  }

  // Draw subtle grid lines when zoomed in
  if (safePixelSize > 12) {
    ctx.strokeStyle = gridLineColor;
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = visibleStartX; x <= visibleEndX; x++) {
      ctx.beginPath();
      ctx.moveTo(x * safePixelSize, visibleStartY * safePixelSize);
      ctx.lineTo(x * safePixelSize, visibleEndY * safePixelSize);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = visibleStartY; y <= visibleEndY; y++) {
      ctx.beginPath();
      ctx.moveTo(visibleStartX * safePixelSize, y * safePixelSize);
      ctx.lineTo(visibleEndX * safePixelSize, y * safePixelSize);
      ctx.stroke();
    }
  }

  ctx.restore();
  
  console.log('Grid drawing completed');
};
