
import { useState } from "react";
import { Header } from "@/components/Header";
import { PixelGrid } from "@/components/PixelGrid";
import { StatsBar } from "@/components/StatsBar";
import { SelectionPanel } from "@/components/SelectionPanel";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  const [selectedPixels, setSelectedPixels] = useState<Set<string>>(new Set());
  const [hoveredPixel, setHoveredPixel] = useState<string | null>(null);
  const [gridData, setGridData] = useState<Record<string, any>>({});
  const [isSelecting, setIsSelecting] = useState(false);

  // Mock data for demonstration
  const totalPixels = 10000; // 100x100 grid
  const soldPixels = 234;
  const floorPrice = 0.01;

  return (
    <TooltipProvider>
      <div className="h-screen w-full flex flex-col bg-white text-gray-900 overflow-hidden">
        <Header />
        
        <main className="flex-1 flex">
          <div className="flex-1 relative">
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
          
          {selectedPixels.size > 0 && (
            <SelectionPanel
              selectedCount={selectedPixels.size}
              floorPrice={floorPrice}
              onClearSelection={() => setSelectedPixels(new Set())}
            />
          )}
        </main>

        <StatsBar 
          totalPixels={totalPixels}
          soldPixels={soldPixels}
          floorPrice={floorPrice}
        />
      </div>
    </TooltipProvider>
  );
};

export default Index;
