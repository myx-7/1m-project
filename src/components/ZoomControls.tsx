
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
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-2 shadow-lg">
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onZoomIn}
            className="h-8 w-8 p-0 hover:bg-muted/80"
            disabled={zoom >= 10}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onZoomOut}
            className="h-8 w-8 p-0 hover:bg-muted/80"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <div className="h-px bg-border my-1" />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onCenter}
            className="h-8 w-8 p-0 hover:bg-muted/80"
          >
            <Target className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="h-8 w-8 p-0 hover:bg-muted/80"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2 py-1 text-xs font-pixel">
        {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
};
