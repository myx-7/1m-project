import { useState } from "react";
import { Header } from "@/components/Header";
import { PixelGrid } from "@/components/PixelGrid";
import { StatsBar } from "@/components/StatsBar";
import { SelectionPanel } from "@/components/SelectionPanel";
import { PublicChat } from "@/components/PublicChat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [selectedPixels, setSelectedPixels] = useState<Set<string>>(new Set());
  const [hoveredPixel, setHoveredPixel] = useState<string | null>(null);
  const [gridData, setGridData] = useState<Record<string, unknown>>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showDesktopChat, setShowDesktopChat] = useState(true);

  // Mock data for demonstration
  const totalPixels = 10000; // 100x100 grid
  const soldPixels = 234;
  const floorPrice = 0.01;

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-300">
          <Header />

          <main className="flex-1 flex min-h-0 relative">
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

            {/* Right Sidebar - Selection Panel or Chat - Hidden on mobile */}
            <div
              className={cn(
                "hidden lg:flex flex-col border-l border-border bg-muted/20 backdrop-blur-sm transition-all duration-300",
                selectedPixels.size > 0
                  ? "w-80"
                  : showDesktopChat
                  ? "w-80"
                  : "w-0"
              )}
            >
              {selectedPixels.size > 0 ? (
                <SelectionPanel
                  selectedCount={selectedPixels.size}
                  floorPrice={floorPrice}
                  onClearSelection={() => setSelectedPixels(new Set())}
                />
              ) : (
                showDesktopChat && (
                  <PublicChat
                    onClose={() => setShowDesktopChat(false)}
                    isDesktop={true}
                  />
                )
              )}
            </div>

            {/* Floating Chat Toggle for Desktop when chat is hidden */}
            {!showDesktopChat && selectedPixels.size === 0 && (
              <Button
                onClick={() => setShowDesktopChat(true)}
                className="hidden lg:flex absolute right-4 top-4 rounded-full w-12 h-12 p-0 shadow-lg hover:scale-110 transition-all duration-200 bg-primary hover:bg-primary/90"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            )}

            {/* Mobile Floating Action Button for Chat */}
            <Button
              onClick={() => setShowMobileChat(!showMobileChat)}
              className={cn(
                "lg:hidden fixed bottom-20 right-4 rounded-full w-14 h-14 p-0 shadow-xl hover:scale-110 transition-all duration-300 z-40",
                showMobileChat
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90 animate-bounce"
              )}
            >
              {showMobileChat ? (
                <X className="w-6 h-6" />
              ) : (
                <MessageSquare className="w-6 h-6" />
              )}
            </Button>

            {/* Mobile Chat Overlay */}
            {showMobileChat && (
              <div className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
                <div className="h-full pt-16">
                  <PublicChat
                    onClose={() => setShowMobileChat(false)}
                    isDesktop={false}
                  />
                </div>
              </div>
            )}
          </main>

          {/* Mobile Selection Panel - Bottom Sheet Style */}
          {selectedPixels.size > 0 && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 animate-in slide-in-from-bottom duration-300">
              <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
                <SelectionPanel
                  selectedCount={selectedPixels.size}
                  floorPrice={floorPrice}
                  onClearSelection={() => setSelectedPixels(new Set())}
                  isMobile={true}
                />
              </div>
            </div>
          )}

          <StatsBar
            totalPixels={totalPixels}
            soldPixels={soldPixels}
            floorPrice={floorPrice}
            selectedCount={selectedPixels.size}
          />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default Index;
