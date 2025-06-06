import { useState, useCallback } from "react";
import { getPixelFromMouse } from "@/utils/pixelUtils";

interface UsePixelGridInteractionsProps {
  soldPixels: Set<string>;
  selectedPixels: Set<string>;
  setSelectedPixels: (pixels: Set<string>) => void;
  setHoveredPixel: (pixel: string | null) => void;
  setIsSelecting: (selecting: boolean) => void;
  pixelSize: number;
  gridWidth: number;
  gridHeight: number;
  pan?: { x: number; y: number };
  zoom?: number;
  isPanning?: boolean;
}

export const usePixelGridInteractions = ({
  soldPixels,
  selectedPixels,
  setSelectedPixels,
  setHoveredPixel,
  setIsSelecting,
  pixelSize,
  gridWidth,
  gridHeight,
  pan = { x: 0, y: 0 },
  zoom = 1,
  isPanning = false
}: UsePixelGridInteractionsProps) => {
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);

  const handleMouseMove = useCallback((
    e: React.MouseEvent, 
    canvas: HTMLCanvasElement,
    currentPan: { x: number; y: number },
    currentZoom: number
  ) => {
    if (isPanning) return;
    
    const pixel = getPixelFromMouse(e, canvas, pixelSize, gridWidth, gridHeight, currentPan, currentZoom);
    setHoveredPixel(pixel?.key || null);

    if (dragStart && pixel) {
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
  }, [dragStart, pixelSize, gridWidth, gridHeight, setHoveredPixel, setSelectedPixels, soldPixels, isPanning]);

  const handleMouseDown = useCallback((
    e: React.MouseEvent, 
    canvas: HTMLCanvasElement,
    currentPan: { x: number; y: number },
    currentZoom: number
  ) => {
    if (isPanning) return;
    if (e.button !== 0) return; // Only left mouse button
    
    const pixel = getPixelFromMouse(e, canvas, pixelSize, gridWidth, gridHeight, currentPan, currentZoom);
    if (!pixel) return;

    if (soldPixels.has(pixel.key)) return;

    setDragStart({ x: pixel.x, y: pixel.y });
    setIsSelecting(true);

    if (!e.shiftKey) {
      const newSelection = new Set([pixel.key]);
      setSelectedPixels(newSelection);
    }
  }, [pixelSize, gridWidth, gridHeight, soldPixels, setIsSelecting, setSelectedPixels, isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    setDragStart(null);
  }, [setIsSelecting]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPixel(null);
    setIsSelecting(false);
    setDragStart(null);
  }, [setHoveredPixel, setIsSelecting]);

  // Add touch handlers for mobile selection
  const handleTouchStart = useCallback((
    e: React.TouchEvent,
    canvas: HTMLCanvasElement,
    currentPan: { x: number; y: number },
    currentZoom: number
  ) => {
    if (e.touches.length !== 1) return; // Only single touch for selection
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const mockEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: canvas
    } as unknown as React.MouseEvent;
    
    const pixel = getPixelFromMouse(mockEvent, canvas, pixelSize, gridWidth, gridHeight, currentPan, currentZoom);
    if (!pixel || soldPixels.has(pixel.key)) return;

    setDragStart({ x: pixel.x, y: pixel.y });
    setIsSelecting(true);
    const newSelection = new Set([pixel.key]);
    setSelectedPixels(newSelection);
  }, [pixelSize, gridWidth, gridHeight, soldPixels, setIsSelecting, setSelectedPixels]);

  const handleTouchMove = useCallback((
    e: React.TouchEvent,
    canvas: HTMLCanvasElement,
    currentPan: { x: number; y: number },
    currentZoom: number
  ) => {
    if (!dragStart || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const mockEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: canvas
    } as unknown as React.MouseEvent;
    
    const pixel = getPixelFromMouse(mockEvent, canvas, pixelSize, gridWidth, gridHeight, currentPan, currentZoom);
    if (!pixel) return;

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
  }, [dragStart, pixelSize, gridWidth, gridHeight, soldPixels, setSelectedPixels]);

  const handleTouchEnd = useCallback(() => {
    setIsSelecting(false);
    setDragStart(null);
  }, [setIsSelecting]);

  return {
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
