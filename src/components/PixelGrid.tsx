
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { PixelGridLoading } from "./PixelGridLoading";
import { PixelTooltip } from "./PixelTooltip";
import { usePixelGridInteractions } from "@/hooks/usePixelGridInteractions";
import { calculatePixelSize, generateMockSoldPixels } from "@/utils/pixelUtils";
import { drawPixelGrid } from "@/utils/canvasUtils";

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
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const gridWidth = 100;
  const gridHeight = 100;
  const soldPixels = generateMockSoldPixels();

  // Loading animation effect with meme flair
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newPixelSize = calculatePixelSize(rect.width, rect.height, gridWidth, gridHeight);
      
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

    drawPixelGrid(ctx, canvas, {
      gridWidth,
      gridHeight,
      pixelSize,
      selectedPixels,
      hoveredPixel,
      soldPixels,
      theme
    });
  }, [pixelSize, selectedPixels, hoveredPixel, soldPixels, theme]);

  useEffect(() => {
    if (!isLoading) {
      drawGrid();
    }
  }, [drawGrid, isLoading]);

  const interactions = usePixelGridInteractions({
    soldPixels,
    selectedPixels,
    setSelectedPixels,
    setHoveredPixel,
    setIsSelecting,
    pixelSize,
    gridWidth,
    gridHeight
  });

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-2 bg-background transition-colors duration-300 min-h-0"
    >
      <div className="relative">
        {isLoading ? (
          <PixelGridLoading width={dimensions.width} height={dimensions.height} />
        ) : (
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="border border-border rounded-xl shadow-2xl cursor-crosshair bg-card transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
            onMouseMove={(e) => interactions.handleMouseMove(e, canvasRef.current!)}
            onMouseDown={(e) => interactions.handleMouseDown(e, canvasRef.current!)}
            onMouseUp={interactions.handleMouseUp}
            onMouseLeave={interactions.handleMouseLeave}
            style={{ imageRendering: 'pixelated' }}
          />
        )}
        
        {hoveredPixel && !isLoading && (
          <PixelTooltip
            hoveredPixel={hoveredPixel}
            soldPixels={soldPixels}
            pixelSize={pixelSize}
            dimensions={dimensions}
          />
        )}
      </div>
    </div>
  );
};
