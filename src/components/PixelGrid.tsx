import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { PixelGridLoading } from "./PixelGridLoading";
import { PixelTooltip } from "./PixelTooltip";
import { ZoomControls } from "./ZoomControls";
import { usePixelGridInteractions } from "@/hooks/usePixelGridInteractions";
import { calculatePixelSize, fetchNFTRecords, convertNFTsToSoldPixels, createNFTImageMap } from "@/utils/pixelUtils";
import { drawPixelGrid, preloadNFTImage } from "@/utils/canvasUtils";
import { PixelNFTRecord } from "@/types/nft";

interface PixelGridProps {
  selectedPixels: Set<string>;
  setSelectedPixels: (pixels: Set<string>) => void;
  hoveredPixel: string | null;
  setHoveredPixel: (pixel: string | null) => void;
  gridData: Record<string, unknown>;
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
  const animationFrameRef = useRef<number>();
  const lastDrawParamsRef = useRef<string>("");
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [basePixelSize, setBasePixelSize] = useState(8);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [nftRecords, setNftRecords] = useState<PixelNFTRecord[]>([]);
  const [soldPixels, setSoldPixels] = useState<Set<string>>(new Set());
  const { theme } = useTheme();

  const gridWidth = 100;
  const gridHeight = 100;
  const pixelSize = basePixelSize * zoom;

  // Create NFT image mapping for efficient lookups
  const nftImageMap = useMemo(() => createNFTImageMap(nftRecords), [nftRecords]);

  // Fetch NFT records on component mount
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetchNFTRecords();
        
        if (response.success && response.pixels) {
          setNftRecords(response.pixels);
          
          // Convert NFT records to sold pixels set
          const soldPixelsSet = convertNFTsToSoldPixels(response.pixels);
          setSoldPixels(soldPixelsSet);
          
          console.log('📊 Loaded NFT records:', response.pixels.length);
          
          // Preload NFT images for better performance
          response.pixels.forEach(nft => {
            if (nft.imageUrl) {
              preloadNFTImage(nft.imageUrl).catch((error) => {
                console.warn(`Failed to preload image ${nft.imageUrl}:`, error);
              });
            }
          });
        } else {
          console.error('❌ Failed to fetch NFT records:', response.error);
          // Set empty data on error
          setNftRecords([]);
          setSoldPixels(new Set());
        }
      } catch (error) {
        console.error('❌ Failed to fetch NFT records:', error);
        setNftRecords([]);
        setSoldPixels(new Set());
      } finally {
        // Loading complete immediately for better performance
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newBasePixelSize = calculatePixelSize(rect.width, rect.height, gridWidth, gridHeight);
      
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
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Performance optimization - skip redraw if nothing changed
      const drawParams = JSON.stringify({
        pixelSize,
        selectedPixels: Array.from(selectedPixels).sort(),
        hoveredPixel,
        theme,
        pan,
        zoom,
        dimensions,
        nftRecordsLength: nftRecords.length
      });

      if (lastDrawParamsRef.current === drawParams) {
        return; // Skip redraw if nothing changed
      }
      lastDrawParamsRef.current = drawParams;

      // Set canvas size only when needed
      if (canvas.width !== dimensions.width || canvas.height !== dimensions.height) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
      }

      drawPixelGrid(ctx, canvas, {
        gridWidth,
        gridHeight,
        pixelSize,
        selectedPixels,
        hoveredPixel,
        soldPixels,
        nftRecords, // Pass NFT records for image rendering
        theme,
        pan,
        zoom,
        containerDimensions: dimensions
      });
    });
  }, [pixelSize, selectedPixels, hoveredPixel, soldPixels, nftRecords, theme, pan, zoom, dimensions]);

  useEffect(() => {
    if (!isLoading && dimensions.width > 0 && dimensions.height > 0) {
      drawGrid();
    }
  }, [drawGrid, isLoading, dimensions]);

  // Center the grid when it loads (only once)
  useEffect(() => {
    if (!isLoading && dimensions.width > 0 && dimensions.height > 0 && pan.x === 0 && pan.y === 0) {
      const totalGridWidth = gridWidth * pixelSize;
      const totalGridHeight = gridHeight * pixelSize;
      
      const centerX = (dimensions.width - totalGridWidth) / 2;
      const centerY = (dimensions.height - totalGridHeight) / 2;
      
      setPan({ x: centerX, y: centerY });
    }
  }, [isLoading, dimensions, pixelSize, pan.x, pan.y]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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

  // Initialize interactions hook with NFT data
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
    isPanning,
    nftImageMap // Pass NFT mapping for enhanced tooltips
  });

  // Touch helper functions
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

  // Touch handlers for mobile support
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });
  const [isTouchSelecting, setIsTouchSelecting] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
      setIsTouchSelecting(false);
    } else if (e.touches.length === 1) {
      // Single touch for selection or panning
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        interactions.handleTouchStart(e, canvasRef.current!, pan, zoom);
        setIsTouchSelecting(true);
      }
    }
  }, [interactions, pan, zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch zoom
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
      setIsTouchSelecting(false);
    } else if (e.touches.length === 1 && isTouchSelecting) {
      // Handle selection dragging
      interactions.handleTouchMove(e, canvasRef.current!, pan, zoom);
    } else if (e.touches.length === 1 && !isTouchSelecting) {
      // Handle panning
      const deltaX = e.touches[0].clientX - lastPanPoint.x;
      const deltaY = e.touches[0].clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, [lastTouchDistance, isTouchSelecting, lastPanPoint, handleZoom, interactions, pan, zoom]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    setLastTouchDistance(0);
    setIsTouchSelecting(false);
    interactions.handleTouchEnd();
  }, [interactions]);

  const resetView = useCallback(() => {
    setZoom(1);
    const totalGridWidth = gridWidth * basePixelSize;
    const totalGridHeight = gridHeight * basePixelSize;
    const centerX = (dimensions.width - totalGridWidth) / 2;
    const centerY = (dimensions.height - totalGridHeight) / 2;
    setPan({ x: centerX, y: centerY });
  }, [dimensions, gridWidth, gridHeight, basePixelSize]);

  const centerGrid = useCallback(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const totalGridWidth = gridWidth * pixelSize;
    const totalGridHeight = gridHeight * pixelSize;
    
    const centerX = (dimensions.width - totalGridWidth) / 2;
    const centerY = (dimensions.height - totalGridHeight) / 2;
    
    setPan({ x: centerX, y: centerY });
  }, [dimensions, gridWidth, gridHeight, pixelSize]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-background overflow-hidden"
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <PixelGridLoading width={400} height={300} />
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            style={{ 
              imageRendering: 'pixelated',
              cursor: isPanning ? 'grabbing' : 'crosshair',
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
              nftImageMap={nftImageMap}
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
