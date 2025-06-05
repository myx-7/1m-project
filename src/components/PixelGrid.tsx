
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

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
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const gridWidth = 100;
  const gridHeight = 100;

  // Mock some sold blocks for demonstration
  const soldPixels = new Set([
    "10,10", "11,10", "12,10", "13,10",
    "25,25", "26,25", "25,26", "26,26",
    "50,50", "51,50", "52,50", "50,51", "51,51", "52,51",
    "75,30", "76,30", "77,30", "75,31", "76,31", "77,31"
  ]);

  // Loading animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

    // Theme-aware colors
    const isDark = theme === 'dark';
    const availableColor = isDark ? '#1f2937' : '#f8f9fa';
    const hoveredColor = isDark ? '#374151' : '#e5e7eb';
    const selectedColor = isDark ? '#ffffff' : '#000000';
    const borderColor = isDark ? '#4b5563' : '#d1d5db';

    // Draw blocks with smooth animations
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        const pixelKey = `${x},${y}`;
        const isSelected = selectedPixels.has(pixelKey);
        const isHovered = hoveredPixel === pixelKey;
        const isSold = soldPixels.has(pixelKey);

        let fillStyle = availableColor;

        if (isSold) {
          // Themed colors for sold blocks
          const colors = isDark 
            ? ['#1e3a8a', '#7c3aed', '#059669', '#d97706', '#dc2626']
            : ['#dbeafe', '#ede9fe', '#d1fae5', '#fed7aa', '#fecaca'];
          fillStyle = colors[((x * y) % colors.length)];
        } else if (isSelected) {
          fillStyle = selectedColor;
        } else if (isHovered) {
          fillStyle = hoveredColor;
        }

        // Draw block with rounded corners for better aesthetics
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 1, pixelSize - 1);

        // Add subtle border for better definition
        if (pixelSize > 6) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize - 1, pixelSize - 1);
        }

        // Enhanced selection indicator
        if (isSelected) {
          ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(x * pixelSize + 1, y * pixelSize + 1, pixelSize - 3, pixelSize - 3);
        }
      }
    }
  }, [pixelSize, selectedPixels, hoveredPixel, soldPixels, theme]);

  useEffect(() => {
    if (!isLoading) {
      drawGrid();
    }
  }, [drawGrid, isLoading]);

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
      className="flex-1 flex items-center justify-center p-4 bg-background transition-colors duration-300"
    >
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center border border-border rounded-lg bg-card shadow-sm animate-pulse"
               style={{ width: dimensions.width || 400, height: dimensions.height || 400 }}>
            <div className="text-muted-foreground">Loading blocks...</div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="border border-border rounded-lg shadow-sm cursor-crosshair bg-card transition-all duration-300 hover:shadow-md"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ imageRendering: 'pixelated' }}
          />
        )}
        
        {/* Enhanced tooltip */}
        {hoveredPixel && !isLoading && (
          <div className="absolute pointer-events-none bg-card border border-border rounded-lg p-3 text-sm shadow-lg z-10 transition-all duration-200 animate-in fade-in-0 zoom-in-95"
               style={{
                 left: Math.min(dimensions.width - 200, (parseInt(hoveredPixel.split(',')[0]) * pixelSize) + 20),
                 top: Math.max(20, (parseInt(hoveredPixel.split(',')[1]) * pixelSize) - 60)
               }}>
            <div className="font-medium text-foreground">Block {hoveredPixel}</div>
            <div className="text-muted-foreground text-xs mt-1">
              {soldPixels.has(hoveredPixel) ? '🔗 Owned on-chain' : '✨ Available to mint'}
            </div>
            {!soldPixels.has(hoveredPixel) && (
              <div className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                <span>💰</span> 0.01 SOL
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
