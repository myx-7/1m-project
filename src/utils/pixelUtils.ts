
export const getPixelFromMouse = (
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  pixelSize: number,
  gridWidth: number,
  gridHeight: number
) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);

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
