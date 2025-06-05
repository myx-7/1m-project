
interface PixelGridLoadingProps {
  width: number;
  height: number;
}

export const PixelGridLoading = ({ width, height }: PixelGridLoadingProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center border border-border rounded-xl bg-card shadow-sm animate-pulse font-pixel"
      style={{ width: width || 800, height: height || 800 }}
    >
      <div className="text-3xl mb-3 animate-bounce">🚀</div>
      <div className="text-muted-foreground animate-pulse text-sm">Loading the grid...</div>
      <div className="text-xs text-muted-foreground mt-2">Preparing your canvas 🎨</div>
    </div>
  );
};
