
interface PixelTooltipProps {
  hoveredPixel: string;
  soldPixels: Set<string>;
  pixelSize: number;
  dimensions: { width: number; height: number };
}

export const PixelTooltip = ({ hoveredPixel, soldPixels, pixelSize, dimensions }: PixelTooltipProps) => {
  return (
    <div 
      className="absolute pointer-events-none bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 text-sm shadow-2xl z-10 transition-all duration-200 animate-in fade-in-0 zoom-in-95 font-pixel"
      style={{
        left: Math.min(dimensions.width - 240, (parseInt(hoveredPixel.split(',')[0]) * pixelSize) + 20),
        top: Math.max(20, (parseInt(hoveredPixel.split(',')[1]) * pixelSize) - 100)
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
    </div>
  );
};
