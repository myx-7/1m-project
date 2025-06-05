
import { useState } from "react";
import { Header } from "@/components/Header";
import { PixelGrid } from "@/components/PixelGrid";
import { StatsBar } from "@/components/StatsBar";
import { SelectionPanel } from "@/components/SelectionPanel";
import { PublicChat } from "@/components/PublicChat";
import { ActivityFeed } from "@/components/ActivityFeed";
import { FOMOCounter } from "@/components/FOMOCounter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Index = () => {
  const [selectedPixels, setSelectedPixels] = useState<Set<string>>(new Set());
  const [hoveredPixel, setHoveredPixel] = useState<string | null>(null);
  const [gridData, setGridData] = useState<Record<string, any>>({});
  const [isSelecting, setIsSelecting] = useState(false);

  // Mock data for demonstration - degen-focused
  const totalPixels = 10000; // 100x100 grid
  const soldPixels = 1337; // More realistic for FOMO
  const floorPrice = 0.069; // Nice

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-300">
          <Header />
          
          <main className="flex-1 flex min-h-0">
            {/* Canvas Area - Takes maximum space */}
            <div className="flex-1 relative min-w-0">
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
            
            {/* Right Sidebar - Dynamic content based on selection */}
            <div className="hidden lg:flex flex-col w-80 border-l border-border bg-muted/30">
              {selectedPixels.size > 0 ? (
                <div className="flex-1">
                  <SelectionPanel
                    selectedCount={selectedPixels.size}
                    floorPrice={floorPrice}
                    onClearSelection={() => setSelectedPixels(new Set())}
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-4 p-4">
                  {/* FOMO Counter at top */}
                  <FOMOCounter />
                  
                  {/* Activity feed in middle */}
                  <div className="flex-1">
                    <ActivityFeed />
                  </div>
                  
                  {/* Chat at bottom */}
                  <div className="h-64">
                    <PublicChat />
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Mobile Selection Panel - Only show when pixels are selected */}
          {selectedPixels.size > 0 && (
            <div className="lg:hidden border-t border-border bg-muted/30">
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
