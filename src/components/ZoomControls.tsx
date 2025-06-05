
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Target } from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenter: () => void;
}

export const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset, onCenter }: ZoomControlsProps) => {
  return (
    <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-3 shadow-2xl">
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onZoomIn}
            className="h-10 w-10 p-0 hover:bg-muted/80 transition-all duration-200 hover:scale-105"
            disabled={zoom >= 20}
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onZoomOut}
            className="h-10 w-10 p-0 hover:bg-muted/80 transition-all duration-200 hover:scale-105"
            disabled={zoom <= 0.1}
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          
          <div className="h-px bg-border/50 my-1" />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onCenter}
            className="h-10 w-10 p-0 hover:bg-muted/80 transition-all duration-200 hover:scale-105"
            title="Center Grid"
          >
            <Target className="w-5 h-5" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="h-10 w-10 p-0 hover:bg-muted/80 transition-all duration-200 hover:scale-105"
            title="Reset View"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-xl px-4 py-2 text-sm font-semibold text-foreground/80 shadow-lg">
        {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
};
