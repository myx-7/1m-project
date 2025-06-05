import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const isSold = soldPixels.has(hoveredPixel);
  
  // Calculate position with pan and zoom
  const pixelScreenX = x * pixelSize + pan.x;
  const pixelScreenY = y * pixelSize + pan.y;
  
  // Smart positioning - show tooltip where there's space
  const tooltipWidth = 200;
  const tooltipHeight = 80;
  const padding = 20;
  
  let tooltipX = pixelScreenX + pixelSize + 10; // Default: right of pixel
  let tooltipY = pixelScreenY;
  
  // Adjust if tooltip would go off-screen
  if (tooltipX + tooltipWidth > dimensions.width - padding) {
    tooltipX = pixelScreenX - tooltipWidth - 10; // Show on left instead
  }
  
  if (tooltipY + tooltipHeight > dimensions.height - padding) {
    tooltipY = dimensions.height - tooltipHeight - padding;
  }
  
  if (tooltipY < padding) {
    tooltipY = padding;
  }
  
  return (
    <div 
      className={cn(
        "absolute pointer-events-none z-20",
        "bg-background/95 backdrop-blur-xl",
        "border border-border rounded-lg",
        "px-3 py-2 shadow-xl",
        "transition-all duration-200",
        "animate-in fade-in-0 zoom-in-95"
      )}
      style={{
        left: Math.max(padding, tooltipX),
        top: tooltipY,
        minWidth: tooltipWidth
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-4 h-4 rounded border",
            isSold 
              ? "bg-primary border-primary animate-pulse" 
              : "bg-muted border-border"
          )} />
          <span className="font-semibold text-sm font-pixel">
            #{x},{y}
          </span>
      </div>
        <Badge 
          variant={isSold ? "secondary" : "default"}
          className={cn(
            "text-[9px] font-pixel px-2 py-0",
            isSold 
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" 
              : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
          )}
        >
          {isSold ? "OWNED" : "AVAILABLE"}
        </Badge>
      </div>
      
      {/* Price or owner info */}
      <div className="text-xs text-muted-foreground font-pixel">
        {isSold ? (
          <div className="flex items-center gap-1">
            <span>Owner:</span>
            <span className="text-foreground font-medium">anon...7x9f</span>
        </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>Price:</span>
            <span className="text-foreground font-semibold">0.01 SOL</span>
        </div>
      )}
      </div>
    </div>
  );
};
