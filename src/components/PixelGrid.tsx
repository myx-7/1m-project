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
  const [pan, setPan] = useState({ x: 0, y: 0 }); // Start at origin
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const gridWidth = 100;
  const gridHeight = 100;
  const soldPixels = generateMockSoldPixels();
  const pixelSize = basePixelSize * zoom;

  console.log('PixelGrid render - dimensions:', dimensions, 'pixelSize:', pixelSize, 'pan:', pan);

  // Loading animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newBasePixelSize = Math.max(6, Math.min(12, Math.floor(rect.width / gridWidth)));
      
      console.log('Container dimensions:', rect.width, 'x', rect.height);
      console.log('Calculated pixelSize:', newBasePixelSize);
      
      setBasePixelSize(newBasePixelSize);
      setDimensions({
        width: rect.width,
        height: rect.height
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
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) {
      console.log('Canvas not ready:', !!canvas, dimensions);
      return;
    }

    console.log('Drawing grid - canvas:', canvas.width, 'x', canvas.height, 'pan:', pan, 'pixelSize:', pixelSize);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('No canvas context');
      return;
    }

    // Ensure canvas has the right dimensions
    if (canvas.width !== dimensions.width || canvas.height !== dimensions.height) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      console.log('Updated canvas size to:', canvas.width, 'x', canvas.height);
    }

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
  }, [pixelSize, selectedPixels, hoveredPixel, soldPixels, theme, pan, zoom, dimensions]);

  useEffect(() => {
    if (!isLoading && dimensions.width > 0 && dimensions.height > 0) {
      console.log('Triggering grid draw...');
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
    if (e.button === 1 || e.ctrlKey || e.metaKey) {
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
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    // Center the grid properly in the container
    const totalGridWidth = gridWidth * basePixelSize;
    const totalGridHeight = gridHeight * basePixelSize;
    const centerX = (dimensions.width - totalGridWidth) / 2;
    const centerY = (dimensions.height - totalGridHeight) / 2;
    
    console.log('Centering grid at:', centerX, centerY);
    setPan({ x: centerX, y: centerY });
  }, [dimensions, gridWidth, gridHeight, basePixelSize]);

  // Center grid when ready
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
            className="absolute inset-0 cursor-crosshair block"
            style={{ 
              imageRendering: 'pixelated',
              cursor: isPanning ? 'grabbing' : 'crosshair',
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              backgroundColor: theme === 'dark' ? '#1a1a2e' : '#f0f0f0'
            }}
            onWheel={(e) => {
              e.preventDefault();
              const rect = canvasRef.current?.getBoundingClientRect();
              if (!rect) return;
              
              const centerX = e.clientX - rect.left;
              const centerY = e.clientY - rect.top;
              
              const zoomSpeed = 0.1;
              const minZoom = 0.5;
              const maxZoom = 10;
              const delta = -e.deltaY / 100;
              
              const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta * zoomSpeed));
              
              const zoomRatio = newZoom / zoom;
              setPan(prev => ({
                x: centerX - (centerX - prev.x) * zoomRatio,
                y: centerY - (centerY - prev.y) * zoomRatio
              }));
              
              setZoom(newZoom);
            }}
            onMouseMove={(e) => {
              if (isPanning) {
                const deltaX = e.clientX - lastPanPoint.x;
                const deltaY = e.clientY - lastPanPoint.y;
                
                setPan(prev => ({
                  x: prev.x + deltaX,
                  y: prev.y + deltaY
                }));
                
                setLastPanPoint({ x: e.clientX, y: e.clientY });
              } else {
                interactions.handleMouseMove(e, canvasRef.current!, pan, zoom);
              }
            }}
            onMouseDown={(e) => {
              if (e.button === 1 || e.ctrlKey || e.metaKey) {
                setIsPanning(true);
                setLastPanPoint({ x: e.clientX, y: e.clientY });
                e.preventDefault();
              } else if (!isPanning) {
                interactions.handleMouseDown(e, canvasRef.current!, pan, zoom);
              }
            }}
            onMouseUp={() => {
              setIsPanning(false);
              interactions.handleMouseUp();
            }}
            onMouseLeave={() => {
              setIsPanning(false);
              interactions.handleMouseLeave();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          <ZoomControls
            zoom={zoom}
            onZoomIn={() => {
              const newZoom = Math.min(10, zoom + 0.1);
              setZoom(newZoom);
            }}
            onZoomOut={() => {
              const newZoom = Math.max(0.5, zoom - 0.1);
              setZoom(newZoom);
            }}
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
