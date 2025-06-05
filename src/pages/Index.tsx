
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { PixelGrid } from "@/components/PixelGrid";
import { StatsFooter } from "@/components/StatsFooter";
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
      <div className="h-screen w-full flex flex-col bg-gray-950 text-white overflow-hidden">
        <Header 
          selectedCount={selectedPixels.size}
          onClearSelection={() => setSelectedPixels(new Set())}
        />
        
        <main className="flex-1 relative overflow-hidden">
          <PixelGrid
            selectedPixels={selectedPixels}
            setSelectedPixels={setSelectedPixels}
            hoveredPixel={hoveredPixel}
            setHoveredPixel={setHoveredPixel}
            gridData={gridData}
            isSelecting={isSelecting}
            setIsSelecting={setIsSelecting}
          />
        </main>

        <StatsFooter 
          totalPixels={totalPixels}
          soldPixels={soldPixels}
          floorPrice={floorPrice}
          selectedCount={selectedPixels.size}
        />
      </div>
    </TooltipProvider>
  );
};

export default Index;
