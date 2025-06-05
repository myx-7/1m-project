
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Zap, Blocks, Link } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface SelectionPanelProps {
  selectedCount: number;
  floorPrice: number;
  onClearSelection: () => void;
}

export const SelectionPanel = ({ selectedCount, floorPrice, onClearSelection }: SelectionPanelProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const totalPrice = selectedCount * floorPrice;

  const handleMint = () => {
    console.log("Minting with:", {
      selectedCount,
      linkUrl,
      selectedImage: selectedImage?.name
    });
    // TODO: Implement actual minting logic
  };

  return (
    <div className="w-80 border-l border-border bg-muted/30 p-4 hidden lg:block transition-colors duration-300">
      <Card className="border-0 shadow-sm bg-card transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 font-pixel">
              <Blocks className="w-4 h-4 text-primary" />
              Selection
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
              <span className="text-muted-foreground">Blocks selected</span>
              <span className="font-medium text-foreground">{selectedCount}</span>
            </div>
            <div className="flex justify-between text-xs font-pixel">
              <span className="text-muted-foreground">Price per block</span>
              <span className="font-medium text-foreground">{floorPrice} SOL</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-pixel">
                <span className="font-medium text-foreground text-xs">Total</span>
                <span className="font-semibold text-foreground text-sm">{totalPrice.toFixed(3)} SOL</span>
              </div>
            </div>
          </div>

          {/* Link Input */}
          <div className="space-y-2">
            <label className="text-xs font-pixel text-muted-foreground">Link (Optional)</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="pl-10 text-xs font-pixel"
              />
            </div>
          </div>

          {/* Image Upload */}
          <ImageUpload 
            onImageSelect={setSelectedImage}
            selectedImage={selectedImage}
          />

          <Button
            onClick={handleMint}
            className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] group font-pixel text-xs"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            Mint {selectedCount} block{selectedCount !== 1 ? 's' : ''} 🚀
          </Button>

          <div className="text-[10px] text-muted-foreground text-center space-y-1 font-pixel">
            <p>Each block becomes an NFT that you own forever</p>
            <p className="text-primary">🔗 Secured on Solana blockchain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
