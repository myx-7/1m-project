
interface PixelGridLoadingProps {
  width: number;
  height: number;
}

export const PixelGridLoading = ({ width, height }: PixelGridLoadingProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center border border-border/30 rounded-2xl bg-card/50 backdrop-blur-sm shadow-2xl animate-pulse"
      style={{ width: width || 800, height: height || 800 }}
    >
      <div className="text-5xl mb-6 animate-bounce">🚀</div>
      <div className="text-foreground/70 animate-pulse text-lg font-semibold mb-3">Loading the grid...</div>
      <div className="text-base text-foreground/50 mb-4">Preparing your 1000×1000 canvas</div>
      <div className="flex gap-2 mt-4">
        <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <div className="text-sm text-muted-foreground mt-6 px-8 text-center">
        ✨ Enhanced with modern design and improved performance
      </div>
    </div>
  );
};
