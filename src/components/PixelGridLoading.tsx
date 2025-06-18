export const PixelGridLoading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="flex flex-col items-center justify-center border border-border rounded-xl bg-card shadow-sm font-pixel"
        style={{ width: 400, height: 400 }}
      >
        <div className="text-3xl mb-3">🚀</div>
        <div className="text-muted-foreground text-sm">Loading the grid...</div>
        <div className="text-xs text-muted-foreground mt-2">
          Preparing 10,000 pixels for you
        </div>
      </div>
    </div>
  );
};
