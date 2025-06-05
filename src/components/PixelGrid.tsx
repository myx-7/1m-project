import { useEffect, useRef, useState, useCallback } from "react";

interface PixelGridProps {
  selectedPixels: Set<string>;
  setSelectedPixels: (pixels: Set<string>) => void;
  hoveredPixel: string | null;
  setHoveredPixel: (pixel: string | null) => void;
  gridData: Record<string, any>;
  isSelecting: boolean;
  setIsSelecting: (selecting: boolean) => void;
}

export const PixelGrid = ({
  selectedPixels,
  setSelectedPixels,
  hoveredPixel,
  setHoveredPixel,
  gridData,
  isSelecting,
  setIsSelecting
}: PixelGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pixelSize, setPixelSize] = useState(8);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);

  const gridWidth = 100;
  const gridHeight = 100;

  // Mock some sold pixels for demonstration
  const soldPixels = new Set([
    "10,10", "11,10", "12,10", "13,10",
    "25,25", "26,25", "25,26", "26,26",
    "50,50", "51,50", "52,50", "50,51", "51,51", "52,51",
    "75,30", "76,30", "77,30", "75,31", "76,31", "77,31"
  ]);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const maxWidth = rect.width - 40;
      const maxHeight = rect.height - 40;
      
      const maxPixelWidth = Math.floor(maxWidth / gridWidth);
      const maxPixelHeight = Math.floor(maxHeight / gridHeight);
      const newPixelSize = Math.max(4, Math.min(maxPixelWidth, maxPixelHeight, 12));
      
      setPixelSize(newPixelSize);
      setDimensions({
        width: gridWidth * newPixelSize,
        height: gridHeight * newPixelSize
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        const pixelKey = `${x},${y}`;
        const isSelected = selectedPixels.has(pixelKey);
        const isHovered = hoveredPixel === pixelKey;
        const isSold = soldPixels.has(pixelKey);

        let fillStyle = '#f8f9fa'; // Light gray for available

        if (isSold) {
          // Subtle colors for sold pixels
          const colors = ['#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec'];
          fillStyle = colors[((x * y) % colors.length)];
        } else if (isSelected) {
          fillStyle = '#000000'; // Black for selected
        } else if (isHovered) {
          fillStyle = '#e5e7eb'; // Gray for hover
        }

        ctx.fillStyle = fillStyle;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 1, pixelSize - 1);

        // Add border for selected pixels
        if (isSelected) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize - 1, pixelSize - 1);
        }
      }
    }
  }, [pixelSize, selectedPixels, hoveredPixel, soldPixels]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const getPixelFromMouse = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);

    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      return { x, y, key: `${x},${y}` };
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pixel = getPixelFromMouse(e);
    setHoveredPixel(pixel?.key || null);

    if (isSelecting && dragStart && pixel) {
      const newSelection = new Set<string>();
      const startX = Math.min(dragStart.x, pixel.x);
      const endX = Math.max(dragStart.x, pixel.x);
      const startY = Math.min(dragStart.y, pixel.y);
      const endY = Math.max(dragStart.y, pixel.y);

      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          if (!soldPixels.has(`${x},${y}`)) {
            newSelection.add(`${x},${y}`);
          }
        }
      }
      setSelectedPixels(newSelection);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pixel = getPixelFromMouse(e);
    if (!pixel) return;

    if (soldPixels.has(pixel.key)) return;

    setDragStart({ x: pixel.x, y: pixel.y });
    setIsSelecting(true);

    if (!e.shiftKey) {
      const newSelection = new Set([pixel.key]);
      setSelectedPixels(newSelection);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setDragStart(null);
  };

  const handleMouseLeave = () => {
    setHoveredPixel(null);
    setIsSelecting(false);
    setDragStart(null);
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-4 bg-gray-50"
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="border border-gray-300 rounded-lg shadow-sm cursor-crosshair bg-white"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Pixel info tooltip */}
        {hoveredPixel && (
          <div className="absolute pointer-events-none bg-white border border-gray-200 rounded-lg p-3 text-sm shadow-lg z-10"
               style={{
                 left: Math.min(dimensions.width - 200, (parseInt(hoveredPixel.split(',')[0]) * pixelSize) + 20),
                 top: Math.max(20, (parseInt(hoveredPixel.split(',')[1]) * pixelSize) - 60)
               }}>
            <div className="font-medium text-gray-900">Pixel {hoveredPixel}</div>
            <div className="text-gray-500 text-xs mt-1">
              {soldPixels.has(hoveredPixel) ? 'Owned' : 'Available'}
            </div>
            {!soldPixels.has(hoveredPixel) && (
              <div className="text-green-600 text-xs">💰 0.01 SOL</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
