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

  // Mock some sold blocks for demonstration with vibrant meme colors
  const soldPixels = new Set([
    "10,10", "11,10", "12,10", "13,10", "14,10", "15,10",
    "25,25", "26,25", "25,26", "26,26", "27,25", "27,26",
    "50,50", "51,50", "52,50", "50,51", "51,51", "52,51", "53,51", "53,50",
    "75,30", "76,30", "77,30", "75,31", "76,31", "77,31",
    "20,70", "21,70", "22,70", "20,71", "21,71", "22,71",
    "80,80", "81,80", "82,80", "80,81", "81,81", "82,81"
  ]);

  // Loading animation effect with meme flair
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Use almost all available space, leaving small padding
      const maxWidth = rect.width - 10;
      const maxHeight = rect.height - 10;
      
      const maxPixelWidth = Math.floor(maxWidth / gridWidth);
      const maxPixelHeight = Math.floor(maxHeight / gridHeight);
      const newPixelSize = Math.max(4, Math.min(maxPixelWidth, maxPixelHeight, 20));
      
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

    // Enhanced theme-aware colors with more vibrant web3/meme colors
    const isDark = theme === 'dark';
    const availableColor = isDark ? '#0f0f23' : '#fefefe';
    const hoveredColor = isDark ? '#1a1a3a' : '#f8f8f8';
    const selectedColor = isDark ? '#ffffff' : '#000000';
    const borderColor = isDark ? '#2a2a3a' : '#e8e8e8';

    // Draw blocks with enhanced playful animations and colors
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        const pixelKey = `${x},${y}`;
        const isSelected = selectedPixels.has(pixelKey);
        const isHovered = hoveredPixel === pixelKey;
        const isSold = soldPixels.has(pixelKey);

        let fillStyle = availableColor;

        if (isSold) {
          // Enhanced meme/web3 colors with better vibrancy
          const colors = isDark 
            ? ['#ff4757', '#3742fa', '#2ed573', '#ffa502', '#ff6348', '#747d8c', '#5f27cd', '#00d2d3', '#ff9ff3', '#54a0ff']
            : ['#ff3838', '#3742fa', '#2ed573', '#ff9f43', '#ff6b6b', '#70a1ff', '#5f27cd', '#00d2d3', '#ff9ff3', '#54a0ff'];
          fillStyle = colors[((x * 7 + y * 3) % colors.length)];
        } else if (isSelected) {
          fillStyle = selectedColor;
        } else if (isHovered) {
          fillStyle = hoveredColor;
        }

        // Draw block with enhanced styling
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);

        // Enhanced border with better visibility
        if (pixelSize > 4) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 0.2;
          ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
        }

        // Enhanced selection indicator with glow effect
        if (isSelected) {
          ctx.strokeStyle = isDark ? '#000000' : '#ffffff';
          ctx.lineWidth = Math.max(1, pixelSize / 8);
          ctx.strokeRect(x * pixelSize + 1, y * pixelSize + 1, pixelSize - 3, pixelSize - 3);
          
          // Add inner glow effect for selected blocks
          if (pixelSize > 6) {
            ctx.strokeStyle = isDark ? '#ffffff60' : '#00000060';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * pixelSize + 2, y * pixelSize + 2, pixelSize - 5, pixelSize - 5);
          }
        }

        // Enhanced hover effect
        if (isHovered && !isSelected) {
          ctx.strokeStyle = isDark ? '#ffffff80' : '#00000080';
          ctx.lineWidth = Math.max(1, pixelSize / 10);
          ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
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
      className="flex-1 flex items-center justify-center p-2 bg-background transition-colors duration-300 min-h-0"
    >
      <div className="relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center border border-border rounded-xl bg-card shadow-sm animate-pulse font-pixel"
               style={{ width: dimensions.width || 800, height: dimensions.height || 800 }}>
            <div className="text-3xl mb-3 animate-bounce">🚀</div>
            <div className="text-muted-foreground animate-pulse text-sm">Loading the grid...</div>
            <div className="text-xs text-muted-foreground mt-2">Preparing your canvas 🎨</div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="border border-border rounded-xl shadow-2xl cursor-crosshair bg-card transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ imageRendering: 'pixelated' }}
          />
        )}
        
        {/* Enhanced playful tooltip */}
        {hoveredPixel && !isLoading && (
          <div className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 text-sm shadow-2xl z-10 transition-all duration-200 animate-in fade-in-0 zoom-in-95 font-pixel"
               style={{
                 left: Math.min(dimensions.width - 240, (parseInt(hoveredPixel.split(',')[0]) * pixelSize) + 20),
                 top: Math.max(20, (parseInt(hoveredPixel.split(',')[1]) * pixelSize) - 100)
               }}>
            <div className="font-medium text-foreground flex items-center gap-2 text-xs">
              <span className="text-lg animate-pulse">🎯</span>
              Block #{hoveredPixel}
            </div>
            <div className="text-muted-foreground text-[10px] mt-2">
              {soldPixels.has(hoveredPixel) ? '🔗 Already minted on-chain' : '✨ Ready to mint'}
            </div>
            {!soldPixels.has(hoveredPixel) && (
              <div className="text-green-600 dark:text-green-400 text-[10px] flex items-center gap-1 mt-2">
                <span>💰</span> 0.01 SOL
                <span className="ml-2">🚀</span>
              </div>
            )}
            {soldPixels.has(hoveredPixel) && (
              <div className="text-blue-600 dark:text-blue-400 text-[10px] flex items-center gap-1 mt-2">
                <span>👑</span> Owned by anon
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
