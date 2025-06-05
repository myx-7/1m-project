
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Zap, Blocks } from "lucide-react";

interface SelectionPanelProps {
  selectedCount: number;
  floorPrice: number;
  onClearSelection: () => void;
}

export const SelectionPanel = ({ selectedCount, floorPrice, onClearSelection }: SelectionPanelProps) => {
  const totalPrice = selectedCount * floorPrice;

  return (
    <div className="w-80 border-l border-border bg-muted/30 p-6 hidden lg:block transition-colors duration-300">
      <Card className="border-0 shadow-sm bg-card transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Blocks className="w-5 h-5 text-primary" />
              Selection
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Blocks selected</span>
              <span className="font-medium text-foreground">{selectedCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per block</span>
              <span className="font-medium text-foreground">{floorPrice} SOL</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-semibold text-foreground">{totalPrice.toFixed(3)} SOL</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] group"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            Mint {selectedCount} block{selectedCount !== 1 ? 's' : ''} on-chain
          </Button>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Each block becomes an NFT that you own forever</p>
            <p className="text-primary">🔗 Secured on Solana blockchain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
