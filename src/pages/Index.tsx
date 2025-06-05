
import { useState } from "react";
import { Header } from "@/components/Header";
import { PixelGrid } from "@/components/PixelGrid";
import { StatsBar } from "@/components/StatsBar";
import { SelectionPanel } from "@/components/SelectionPanel";
import { PublicChat } from "@/components/PublicChat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Index = () => {
  const [selectedPixels, setSelectedPixels] = useState<Set<string>>(new Set());
  const [hoveredPixel, setHoveredPixel] = useState<string | null>(null);
  const [gridData, setGridData] = useState<Record<string, any>>({});
  const [isSelecting, setIsSelecting] = useState(false);

  // Updated for 1000x1000 grid
  const totalPixels = 1000000; // 1000x1000 grid
  const soldPixels = 2847;
  const floorPrice = 0.01;

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-300">
          <Header />
          
          <main className="flex-1 flex min-h-0 p-4 gap-4">
            {/* Canvas Area - Takes maximum space with improved styling */}
            <div className="flex-1 relative min-w-0 bg-gradient-to-br from-card/50 to-muted/30 rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              <PixelGrid
                selectedPixels={selectedPixels}
                setSelectedPixels={setSelectedPixels}
                hoveredPixel={hoveredPixel}
                setHoveredPixel={setHoveredPixel}
                gridData={gridData}
                isSelecting={isSelecting}
                setIsSelecting={setIsSelecting}
              />
            </div>
            
            {/* Right Sidebar - Selection Panel or Chat - Hidden on mobile */}
            <div className="hidden lg:flex flex-col w-80 border border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
              {selectedPixels.size > 0 ? (
                <div className="flex-1 p-6">
                  <SelectionPanel
                    selectedCount={selectedPixels.size}
                    floorPrice={floorPrice}
                    onClearSelection={() => setSelectedPixels(new Set())}
                  />
                </div>
              ) : (
                <div className="flex-1 p-6">
                  <PublicChat />
                </div>
              )}
            </div>
          </main>

          {/* Mobile Selection Panel - Only show when pixels are selected */}
          {selectedPixels.size > 0 && (
            <div className="lg:hidden border-t border-border/50 bg-card/50 backdrop-blur-sm p-4 m-4 rounded-2xl shadow-xl">
              <SelectionPanel
                selectedCount={selectedPixels.size}
                floorPrice={floorPrice}
                onClearSelection={() => setSelectedPixels(new Set())}
              />
            </div>
          )}

          <StatsBar 
            totalPixels={totalPixels}
            soldPixels={soldPixels}
            floorPrice={floorPrice}
          />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default Index;
