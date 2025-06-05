
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

  // Enhanced theme-aware colors
  const isDark = theme === 'dark';
  const availableColor = isDark ? '#2a2a2a' : '#f0f0f0';
  const hoveredColor = isDark ? '#3a3a3a' : '#e0e0e0';
  const selectedColor = isDark ? '#ffffff' : '#000000';
  const borderColor = isDark ? '#444444' : '#cccccc';

  // Apply pan transformation
  ctx.save();
  ctx.translate(pan.x, pan.y);

  // Calculate visible area for performance - with safety checks
  const safePixelSize = Math.max(1, pixelSize);
  const visibleStartX = Math.max(0, Math.floor(-pan.x / safePixelSize));
  const visibleEndX = Math.min(gridWidth, Math.ceil((canvas.width - pan.x) / safePixelSize) + 1);
  const visibleStartY = Math.max(0, Math.floor(-pan.y / safePixelSize));
  const visibleEndY = Math.min(gridHeight, Math.ceil((canvas.height - pan.y) / safePixelSize) + 1);

  console.log('Visible area:', { visibleStartX, visibleEndX, visibleStartY, visibleEndY });

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

      const pixelX = x * safePixelSize;
      const pixelY = y * safePixelSize;
      const pixelWidth = Math.max(1, safePixelSize - 1);
      const pixelHeight = Math.max(1, safePixelSize - 1);

      // Draw pixel
      ctx.fillStyle = fillStyle;
      ctx.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);

      // Draw border for larger pixels
      if (safePixelSize > 4) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(pixelX, pixelY, pixelWidth, pixelHeight);
      }

      // Enhanced selection indicator
      if (isSelected && safePixelSize > 2) {
        ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
        ctx.lineWidth = Math.max(1, safePixelSize / 8);
        const inset = Math.max(1, Math.floor(safePixelSize / 8));
        ctx.strokeRect(pixelX + inset, pixelY + inset, pixelWidth - 2 * inset, pixelHeight - 2 * inset);
      }

      // Enhanced hover effect
      if (isHovered && !isSelected && safePixelSize > 2) {
        ctx.strokeStyle = isDark ? '#ffffff80' : '#00000080';
        ctx.lineWidth = Math.max(1, safePixelSize / 10);
        ctx.strokeRect(pixelX, pixelY, pixelWidth, pixelHeight);
      }
    }
  }

  // Draw grid lines when zoomed in
  if (safePixelSize > 8) {
    ctx.strokeStyle = isDark ? '#ffffff20' : '#00000020';
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
