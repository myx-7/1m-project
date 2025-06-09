import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PixelNFTRecord } from "@/types/nft";

interface PixelTooltipProps {
  hoveredPixel: string;
  soldPixels: Set<string>;
  nftImageMap?: Map<string, { nft: PixelNFTRecord; imageLoaded: boolean }>;
  pixelSize: number;
  dimensions: { width: number; height: number };
  pan?: { x: number; y: number };
  zoom?: number;
}

export const PixelTooltip = ({ 
  hoveredPixel, 
  soldPixels,
  nftImageMap,
  pixelSize, 
  dimensions,
  pan = { x: 0, y: 0 },
  zoom = 1
}: PixelTooltipProps) => {
  const [x, y] = hoveredPixel.split(',').map(Number);
  const isSold = soldPixels.has(hoveredPixel);
  const nftData = nftImageMap?.get(hoveredPixel);
  
  // Calculate position with pan and zoom
  const pixelScreenX = x * pixelSize + pan.x;
  const pixelScreenY = y * pixelSize + pan.y;
  
  // Smart positioning - show tooltip where there's space
  const tooltipWidth = 240;
  const tooltipHeight = nftData ? 120 : 80;
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

  // Format wallet address for display
  const formatWallet = (wallet: string) => {
    if (wallet.length <= 8) return wallet;
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };
  
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
      
      {/* NFT or price info */}
      {nftData ? (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-pixel">
            <div className="flex items-center gap-1 mb-1">
              <span>Owner:</span>
              <span className="text-foreground font-medium">
                {formatWallet(nftData.nft.ownerWallet)}
              </span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <span>NFT:</span>
              <span className="text-foreground font-medium truncate">
                {formatWallet(nftData.nft.nftMintAddress)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Size:</span>
              <span className="text-foreground font-medium">
                {nftData.nft.endX - nftData.nft.startX + 1}×{nftData.nft.endY - nftData.nft.startY + 1}px
              </span>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};
