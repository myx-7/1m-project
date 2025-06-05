
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
  const maxWidth = containerWidth - 40; // More padding for better UX
  const maxHeight = containerHeight - 40;
  
  const maxPixelWidth = Math.floor(maxWidth / gridWidth);
  const maxPixelHeight = Math.floor(maxHeight / gridHeight);
  return Math.max(2, Math.min(maxPixelWidth, maxPixelHeight, 15)); // Adjusted for 1000x1000
};

export const generateMockSoldPixels = () => {
  // Enhanced mock data for 1000x1000 grid with more interesting patterns
  const pixels = new Set<string>();
  
  // Add some scattered patterns across the larger grid
  for (let i = 0; i < 50; i++) {
    const x = Math.floor(Math.random() * 1000);
    const y = Math.floor(Math.random() * 1000);
    // Create small clusters
    for (let dx = 0; dx < 3; dx++) {
      for (let dy = 0; dy < 3; dy++) {
        if (x + dx < 1000 && y + dy < 1000) {
          pixels.add(`${x + dx},${y + dy}`);
        }
      }
    }
  }
  
  // Add some specific patterns for visual appeal
  const patterns = [
    [100, 100], [500, 500], [750, 250], [200, 800], [850, 150]
  ];
  
  patterns.forEach(([startX, startY]) => {
    for (let x = startX; x < startX + 20 && x < 1000; x++) {
      for (let y = startY; y < startY + 20 && y < 1000; y++) {
        pixels.add(`${x},${y}`);
      }
    }
  });
  
  return pixels;
};
