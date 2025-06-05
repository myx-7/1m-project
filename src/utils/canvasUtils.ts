
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
  // Enhanced theme-aware colors
  const isDark = theme === 'dark';
  const availableColor = isDark ? '#1a1a1a' : '#f8f8f8';
  const hoveredColor = isDark ? '#2a2a2a' : '#e8e8e8';
  const selectedColor = isDark ? '#ffffff' : '#000000';
  const borderColor = isDark ? '#333333' : '#d0d0d0';

  // Apply pan transformation
  ctx.save();
  ctx.translate(pan.x, pan.y);

  // Calculate visible area for performance optimization
  const visibleStartX = Math.max(0, Math.floor(-pan.x / pixelSize));
  const visibleEndX = Math.min(gridWidth, Math.ceil((canvas.width - pan.x) / pixelSize) + 1);
  const visibleStartY = Math.max(0, Math.floor(-pan.y / pixelSize));
  const visibleEndY = Math.min(gridHeight, Math.ceil((canvas.height - pan.y) / pixelSize) + 1);

  // Draw pixels
  for (let x = visibleStartX; x < visibleEndX; x++) {
    for (let y = visibleStartY; y < visibleEndY; y++) {
      const pixelKey = `${x},${y}`;
      const isSelected = selectedPixels.has(pixelKey);
      const isHovered = hoveredPixel === pixelKey;
      const isSold = soldPixels.has(pixelKey);

      let fillStyle = availableColor;

      if (isSold) {
        // Vibrant colors for sold pixels
        const colors = isDark 
          ? ['#ff4757', '#3742fa', '#2ed573', '#ffa502', '#ff6348', '#747d8c', '#5f27cd', '#00d2d3', '#ff9ff3', '#54a0ff']
          : ['#ff3838', '#3742fa', '#2ed573', '#ff9f43', '#ff6b6b', '#70a1ff', '#5f27cd', '#00d2d3', '#ff9ff3', '#54a0ff'];
        fillStyle = colors[((x * 7 + y * 3) % colors.length)];
      } else if (isSelected) {
        fillStyle = selectedColor;
      } else if (isHovered) {
        fillStyle = hoveredColor;
      }

      const pixelX = x * pixelSize;
      const pixelY = y * pixelSize;

      // Draw pixel
      ctx.fillStyle = fillStyle;
      ctx.fillRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);

      // Draw border
      if (pixelSize > 2) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);
      }

      // Enhanced selection indicator
      if (isSelected) {
        ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
        ctx.lineWidth = Math.max(1, pixelSize / 8);
        ctx.strokeRect(pixelX + 1, pixelY + 1, pixelSize - 3, pixelSize - 3);
      }

      // Enhanced hover effect
      if (isHovered && !isSelected) {
        ctx.strokeStyle = isDark ? '#ffffff80' : '#00000080';
        ctx.lineWidth = Math.max(1, pixelSize / 10);
        ctx.strokeRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);
      }
    }
  }

  // Draw grid lines when zoomed in
  if (pixelSize > 8) {
    ctx.strokeStyle = isDark ? '#ffffff20' : '#00000020';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = visibleStartX; x <= visibleEndX; x++) {
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, visibleStartY * pixelSize);
      ctx.lineTo(x * pixelSize, visibleEndY * pixelSize);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = visibleStartY; y <= visibleEndY; y++) {
      ctx.beginPath();
      ctx.moveTo(visibleStartX * pixelSize, y * pixelSize);
      ctx.lineTo(visibleEndX * pixelSize, y * pixelSize);
      ctx.stroke();
    }
  }

  ctx.restore();
};
