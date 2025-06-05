
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Zap } from "lucide-react";

interface SelectionPanelProps {
  selectedCount: number;
  floorPrice: number;
  onClearSelection: () => void;
}

export const SelectionPanel = ({ selectedCount, floorPrice, onClearSelection }: SelectionPanelProps) => {
  const totalPrice = selectedCount * floorPrice;

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 hidden lg:block">
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Selection</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pixels selected</span>
              <span className="font-medium">{selectedCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price per pixel</span>
              <span className="font-medium">{floorPrice} SOL</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-semibold">{totalPrice.toFixed(3)} SOL</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-black text-white hover:bg-gray-800"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Mint {selectedCount} pixel{selectedCount !== 1 ? 's' : ''}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Each pixel becomes an NFT that you own forever
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
