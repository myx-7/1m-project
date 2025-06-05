
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
  // Clear the entire canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set a visible background color based on theme
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#1a1a2e' : '#f0f0f0';
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.log('Canvas cleared and background set to:', backgroundColor);

  // Enhanced theme-aware colors
  const availableColor = isDark ? '#2d2d44' : '#ffffff';
  const hoveredColor = isDark ? '#3a3a5a' : '#f8f8f8';
  const selectedColor = isDark ? '#ffffff' : '#000000';
  const borderColor = isDark ? '#4a4a6a' : '#e0e0e0';

  // Calculate visible area - ensure we render something
  const startX = Math.max(0, Math.floor(-pan.x / pixelSize));
  const endX = Math.min(gridWidth, Math.ceil((canvas.width - pan.x) / pixelSize) + 1);
  const startY = Math.max(0, Math.floor(-pan.y / pixelSize));
  const endY = Math.min(gridHeight, Math.ceil((canvas.height - pan.y) / pixelSize) + 1);

  console.log('Calculated render area:', { startX, endX, startY, endY, pan, pixelSize });

  // Fallback rendering to ensure something is always visible
  let renderStartX = startX;
  let renderEndX = endX;
  let renderStartY = startY;
  let renderEndY = endY;

  // If calculated area is empty, render a default area
  if (renderStartX >= renderEndX || renderStartY >= renderEndY) {
    console.log('Empty render area, using fallback');
    renderStartX = 0;
    renderEndX = Math.min(20, gridWidth);
    renderStartY = 0;
    renderEndY = Math.min(20, gridHeight);
  }

  let pixelsRendered = 0;

  // Draw pixels
  for (let x = renderStartX; x < renderEndX; x++) {
    for (let y = renderStartY; y < renderEndY; y++) {
      const pixelKey = `${x},${y}`;
      const isSelected = selectedPixels.has(pixelKey);
      const isHovered = hoveredPixel === pixelKey;
      const isSold = soldPixels.has(pixelKey);

      // Calculate pixel position
      const pixelX = pan.x + (x * pixelSize);
      const pixelY = pan.y + (y * pixelSize);

      let fillStyle = availableColor;

      if (isSold) {
        // Colorful sold pixels
        const colors = isDark 
          ? ['#ff4757', '#3742fa', '#2ed573', '#ffa502', '#ff6348', '#747d8c', '#5f27cd', '#00d2d3']
          : ['#ff3838', '#3742fa', '#2ed573', '#ff9f43', '#ff6b6b', '#70a1ff', '#5f27cd', '#00d2d3'];
        fillStyle = colors[((x * 7 + y * 3) % colors.length)];
      } else if (isSelected) {
        fillStyle = selectedColor;
      } else if (isHovered) {
        fillStyle = hoveredColor;
      }

      // Draw the pixel
      ctx.fillStyle = fillStyle;
      ctx.fillRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);

      // Draw border for larger pixels
      if (pixelSize > 4) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);
      }

      // Enhanced selection indicator
      if (isSelected) {
        ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(pixelX + 1, pixelY + 1, pixelSize - 3, pixelSize - 3);
      }

      // Hover effect
      if (isHovered && !isSelected) {
        ctx.strokeStyle = isDark ? '#ffffff80' : '#00000080';
        ctx.lineWidth = 1;
        ctx.strokeRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);
      }

      pixelsRendered++;
    }
  }

  console.log('Actually rendered', pixelsRendered, 'pixels');
  
  // Draw a visible test indicator in the top-left corner
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(10, 10, 20, 20);
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(40, 10, 20, 20);
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(70, 10, 20, 20);
  console.log('Test indicators drawn at top-left');
};
