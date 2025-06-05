
interface PixelTooltipProps {
  hoveredPixel: string;
  soldPixels: Set<string>;
  pixelSize: number;
  dimensions: { width: number; height: number };
  pan?: { x: number; y: number };
  zoom?: number;
}

export const PixelTooltip = ({ 
  hoveredPixel, 
  soldPixels, 
  pixelSize, 
  dimensions,
  pan = { x: 0, y: 0 },
  zoom = 1
}: PixelTooltipProps) => {
  const [x, y] = hoveredPixel.split(',').map(Number);
  
  // Calculate position with pan and zoom
  const pixelScreenX = x * pixelSize + pan.x;
  const pixelScreenY = y * pixelSize + pan.y;
  
  // Position tooltip next to the pixel
  const tooltipX = Math.min(dimensions.width - 240, Math.max(20, pixelScreenX + 20));
  const tooltipY = Math.max(20, Math.min(dimensions.height - 120, pixelScreenY - 50));
  
  return (
    <div 
      className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 text-sm shadow-2xl z-20 transition-all duration-200 animate-in fade-in-0 zoom-in-95 font-pixel"
      style={{
        left: tooltipX,
        top: tooltipY
      }}
    >
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
      <div className="text-[9px] text-muted-foreground mt-2 border-t border-border pt-2">
        Zoom: {(zoom * 100).toFixed(0)}% • Use scroll to zoom • Ctrl+click to pan
      </div>
    </div>
  );
};
