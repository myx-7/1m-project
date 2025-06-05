import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { PixelGridLoading } from "./PixelGridLoading";
import { PixelTooltip } from "./PixelTooltip";
import { ZoomControls } from "./ZoomControls";
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
  const [basePixelSize, setBasePixelSize] = useState(8);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const gridWidth = 100;
  const gridHeight = 100;
  const soldPixels = generateMockSoldPixels();
  const pixelSize = basePixelSize * zoom;

  console.log('PixelGrid render - dimensions:', dimensions, 'isLoading:', isLoading, 'canvas:', canvasRef.current);

  // Loading animation effect with meme flair
  useEffect(() => {
    console.log('Setting loading timer...');
    const timer = setTimeout(() => {
      console.log('Loading finished!');
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newBasePixelSize = calculatePixelSize(rect.width, rect.height, gridWidth, gridHeight);
      
      console.log('Updating dimensions:', rect.width, 'x', rect.height, 'pixelSize:', newBasePixelSize);
      
      setBasePixelSize(newBasePixelSize);
      setDimensions({
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  useEffect(() => {
    console.log('Setting up resize listeners...');
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('No canvas ref available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('No canvas context available');
      return;
    }

    console.log('Drawing grid with dimensions:', dimensions, 'pixelSize:', pixelSize, 'canvas size:', canvas.width, 'x', canvas.height, 'pan:', pan);

    // Set canvas size to container size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas with background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme === 'dark' ? '#0f0f23' : '#fefefe';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);

    drawPixelGrid(ctx, canvas, {
      gridWidth,
      gridHeight,
      pixelSize,
      selectedPixels,
      hoveredPixel,
      soldPixels,
      theme,
      pan,
      zoom,
      containerDimensions: dimensions
    });

    ctx.restore();
    console.log('Grid drawing completed - canvas visible:', canvas.offsetWidth, 'x', canvas.offsetHeight);
  }, [pixelSize, selectedPixels, hoveredPixel, soldPixels, theme, pan, zoom, dimensions]);

  useEffect(() => {
    console.log('Drawing effect triggered - isLoading:', isLoading, 'dimensions:', dimensions);
    if (!isLoading && dimensions.width > 0 && dimensions.height > 0) {
      console.log('Calling drawGrid...');
      drawGrid();
    }
  }, [drawGrid, isLoading, dimensions]);

  // Zoom handlers
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    const zoomSpeed = 0.1;
    const minZoom = 0.5;
    const maxZoom = 10;
    
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta * zoomSpeed));
    
    if (centerX !== undefined && centerY !== undefined) {
      // Zoom towards point
      const zoomRatio = newZoom / zoom;
      setPan(prev => ({
        x: centerX - (centerX - prev.x) * zoomRatio,
        y: centerY - (centerY - prev.y) * zoomRatio
      }));
    }
    
    setZoom(newZoom);
  }, [zoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    
    handleZoom(-e.deltaY / 100, centerX, centerY);
  }, [handleZoom]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.ctrlKey || e.metaKey) { // Middle mouse or Ctrl+click for panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
      return;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Touch helper functions updated to work with React.TouchList
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const x = (touches[0].clientX + touches[1].clientX) / 2;
    const y = (touches[0].clientY + touches[1].clientY) / 2;
    return { x, y };
  };

  // Touch handlers for mobile
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    } else if (e.touches.length === 1) {
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setIsPanning(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (lastTouchDistance > 0) {
        const zoomDelta = (distance - lastTouchDistance) / 100;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = center.x - rect.left;
          const centerY = center.y - rect.top;
          handleZoom(zoomDelta, centerX, centerY);
        }
      }
      
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    } else if (e.touches.length === 1 && isPanning) {
      // Pan
      const deltaX = e.touches[0].clientX - lastPanPoint.x;
      const deltaY = e.touches[0].clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, [lastTouchDistance, isPanning, lastPanPoint, handleZoom]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    setLastTouchDistance(0);
  }, []);

  const interactions = usePixelGridInteractions({
    soldPixels,
    selectedPixels,
    setSelectedPixels,
    setHoveredPixel,
    setIsSelecting,
    pixelSize,
    gridWidth,
    gridHeight,
    pan,
    zoom,
    isPanning
  });

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const centerGrid = useCallback(() => {
    if (dimensions.width === 0 || dimensions.height === 0) {
      console.log('Cannot center grid - dimensions not ready:', dimensions);
      return;
    }
    
    // Calculate center position to show grid in the middle of the canvas
    const totalGridWidth = gridWidth * basePixelSize;
    const totalGridHeight = gridHeight * basePixelSize;
    const centerX = (dimensions.width - totalGridWidth) / 2;
    const centerY = (dimensions.height - totalGridHeight) / 2;
    
    console.log('Centering grid at:', centerX, centerY, 'total grid size:', totalGridWidth, 'x', totalGridHeight);
    setPan({ x: centerX, y: centerY });
  }, [dimensions, gridWidth, gridHeight, basePixelSize]);

  // Center grid when dimensions are available and not loading
  useEffect(() => {
    if (!isLoading && dimensions.width > 0 && dimensions.height > 0 && basePixelSize > 0) {
      console.log('Auto-centering grid...');
      centerGrid();
    }
  }, [isLoading, dimensions.width, dimensions.height, basePixelSize, centerGrid]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-background transition-colors duration-300"
    >
      {isLoading ? (
        <PixelGridLoading width={dimensions.width} height={dimensions.height} />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 cursor-crosshair bg-card block"
            style={{ 
              imageRendering: 'pixelated',
              cursor: isPanning ? 'grabbing' : 'crosshair',
              display: 'block',
              width: dimensions.width,
              height: dimensions.height
            }}
            onWheel={handleWheel}
            onMouseMove={(e) => {
              handleMouseMove(e);
              if (!isPanning) {
                interactions.handleMouseMove(e, canvasRef.current!, pan, zoom);
              }
            }}
            onMouseDown={(e) => {
              handleMouseDown(e);
              if (!isPanning) {
                interactions.handleMouseDown(e, canvasRef.current!, pan, zoom);
              }
            }}
            onMouseUp={() => {
              handleMouseUp();
              interactions.handleMouseUp();
            }}
            onMouseLeave={() => {
              handleMouseUp();
              interactions.handleMouseLeave();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          <ZoomControls
            zoom={zoom}
            onZoomIn={() => handleZoom(1)}
            onZoomOut={() => handleZoom(-1)}
            onReset={resetView}
            onCenter={centerGrid}
          />
          
          {hoveredPixel && (
            <PixelTooltip
              hoveredPixel={hoveredPixel}
              soldPixels={soldPixels}
              pixelSize={pixelSize}
              dimensions={dimensions}
              pan={pan}
              zoom={zoom}
            />
          )}
        </>
      )}
    </div>
  );
};
