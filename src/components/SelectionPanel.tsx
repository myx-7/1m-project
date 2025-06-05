
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Heart, Blocks, Sparkles } from "lucide-react";

interface SelectionPanelProps {
  selectedCount: number;
  floorPrice: number;
  onClearSelection: () => void;
}

export const SelectionPanel = ({ selectedCount, onClearSelection }: Omit<SelectionPanelProps, 'floorPrice'>) => {
  return (
    <div className="w-80 border-l border-border bg-muted/30 p-4 hidden lg:block transition-colors duration-300">
      <Card className="border-0 shadow-sm bg-card transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 font-pixel">
              <Blocks className="w-4 h-4 text-primary" />
              Seçim
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 hover:rotate-90"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-pixel">
              <span className="text-muted-foreground">Seçilen alan</span>
              <span className="font-medium text-foreground">{selectedCount} piksel</span>
            </div>
            <div className="flex justify-between text-xs font-pixel">
              <span className="text-muted-foreground">Hatıra türü</span>
              <span className="font-medium text-foreground">Özel mesaj</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-pixel">
                <span className="font-medium text-foreground text-xs">Durum</span>
                <span className="font-semibold text-green-600 text-sm">Hazır ✨</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] group font-pixel text-xs"
            size="lg"
          >
            <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            {selectedCount} piksel için hatıra bırak 💫
          </Button>

          <div className="text-[10px] text-muted-foreground text-center space-y-1 font-pixel">
            <p>Her piksel bir hatıra, sonsuza kadar burada kalacak</p>
            <p className="text-primary flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Dijital hatıra duvarı
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
