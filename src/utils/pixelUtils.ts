
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

export const generateMockSoldPixels = () => {
  return new Set([
    "10,10", "11,10", "12,10", "13,10", "14,10", "15,10",
    "25,25", "26,25", "25,26", "26,26", "27,25", "27,26",
    "50,50", "51,50", "52,50", "50,51", "51,51", "52,51", "53,51", "53,50",
    "75,30", "76,30", "77,30", "75,31", "76,31", "77,31",
    "20,70", "21,70", "22,70", "20,71", "21,71", "22,71",
    "80,80", "81,80", "82,80", "80,81", "81,81", "82,81"
  ]);
};
