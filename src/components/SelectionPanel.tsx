import { useState, useCallback, useEffect } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Zap, Blocks, Link, Wallet, Upload, CheckCircle } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { MintLoadingDialog } from "./MintLoadingDialog";
import { cn } from "@/lib/utils";
import { useArweaveUpload } from "@/hooks/useArweaveUpload";
import { createPixelNFTAPI } from "@/api/pixels";
import { 
  getMetaplex, 
  mintPixelNFT, 
  calculatePixelCost,
  validateWalletBalance,
  getWalletBalance
} from "@/lib/solana";

interface SelectionPanelProps {
  selectedCount: number;
  floorPrice: number;
  onClearSelection: () => void;
  isMobile?: boolean;
  selectedPixels: Set<string>;
}

interface MintingState {
  isLoading: boolean;
  success?: boolean;
  error?: string;
  transactionSignature?: string;
  currentStep?: 'uploading' | 'minting' | 'saving';
}

export const SelectionPanel = ({ selectedCount, floorPrice, onClearSelection, isMobile = false, selectedPixels }: SelectionPanelProps) => {
  const { connected, publicKey, wallet } = useWallet();
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showMintDialog, setShowMintDialog] = useState(false);
  const [mintingState, setMintingState] = useState<MintingState>({ isLoading: false });
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const { uploadFile, uploadMetadata } = useArweaveUpload();

  const totalPrice = selectedCount * floorPrice;
  const totalCostSOL = calculatePixelCost(selectedCount);
  const canMint = connected && selectedCount > 0 && selectedImage && walletBalance >= (totalCostSOL + 0.01);

  // Convert selected pixels to coordinate data
  const getPixelData = () => {
    if (selectedPixels.size === 0) return null;
    
    const pixels = Array.from(selectedPixels).map(pixelKey => {
      const [x, y] = pixelKey.split(',').map(Number);
      return { x, y, key: pixelKey };
    });
    
    const xCoords = pixels.map(p => p.x);
    const yCoords = pixels.map(p => p.y);
    
    const startX = Math.min(...xCoords);
    const startY = Math.min(...yCoords);
    const endX = Math.max(...xCoords);
    const endY = Math.max(...yCoords);
    
    // Generate pixel IDs based on grid position (100x100 grid)
    const pixelIds = pixels.map(p => p.y * 100 + p.x);
    
    return {
      pixels,
      pixelIds,
      startX,
      startY,
      endX,
      endY
    };
  };

  // Load wallet balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      getWalletBalance(publicKey).then(setWalletBalance);
    }
  }, [connected, publicKey]);

  // Handle minting process
  const handleMint = useCallback(async () => {
    if (!connected || !publicKey || !wallet || !selectedImage || selectedCount === 0) {
      return;
    }

    const pixelData = getPixelData();
    if (!pixelData) {
      setMintingState({
        isLoading: false,
        error: 'No pixels selected'
      });
      return;
    }

    // Validate wallet balance
    const hasBalance = await validateWalletBalance(publicKey, totalCostSOL + 0.01);
    if (!hasBalance) {
      setMintingState({
        isLoading: false,
        error: `Insufficient balance. Need ${(totalCostSOL + 0.01).toFixed(3)} SOL total`
      });
      return;
    }

    setMintingState({ isLoading: true, currentStep: 'uploading' });
    setShowMintDialog(true);

    try {
      console.log('🚀 Starting NFT minting process...');
      console.log('📁 Selected pixels:', selectedCount);
      console.log('📍 Pixel coordinates:', pixelData);
      console.log('🖼️ Image file:', selectedImage.name);
      
      // Step 1: Upload image to Arweave
      setMintingState(prev => ({ ...prev, currentStep: 'uploading' }));
      const imageResult = await uploadFile(selectedImage);
      if (!imageResult.success) {
        throw new Error(`Image upload failed: ${imageResult.error}`);
      }
      
      // Step 2: Create and upload metadata
      const metadata = {
        name: `MDP Pixels ${pixelData.startX},${pixelData.startY}`,
        description: `Million Dollar Pixel NFT covering ${selectedCount} pixels from (${pixelData.startX},${pixelData.startY}) to (${pixelData.endX},${pixelData.endY}). Own a piece of internet history!`,
        image: imageResult.url,
        external_url: linkUrl || undefined,
        attributes: [
          { trait_type: "Block Count", value: selectedCount },
          { trait_type: "Start X", value: pixelData.startX },
          { trait_type: "Start Y", value: pixelData.startY },
          { trait_type: "End X", value: pixelData.endX },
          { trait_type: "End Y", value: pixelData.endY },
          { trait_type: "Width", value: pixelData.endX - pixelData.startX + 1 },
          { trait_type: "Height", value: pixelData.endY - pixelData.startY + 1 }
        ],
        properties: {
          files: [
            {
              uri: imageResult.url,
              type: selectedImage.type
            }
          ],
          category: "image"
        }
      };

      const metadataResult = await uploadMetadata(metadata);
      if (!metadataResult.success) {
        throw new Error(`Metadata upload failed: ${metadataResult.error}`);
      }

      // Step 3: Mint NFT on Solana
      setMintingState(prev => ({ ...prev, currentStep: 'minting' }));
      const metaplex = getMetaplex(wallet.adapter);
      
      // Create pixel data for minting with actual coordinates
      const mintPixelData = {
        id: `pixel-${pixelData.startX}-${pixelData.startY}-${Date.now()}`,
        x: pixelData.startX,
        y: pixelData.startY,
        linkUrl: linkUrl
      };

      const mintResult = await mintPixelNFT(
        metaplex,
        mintPixelData,
        selectedImage,
        publicKey
      );

      // Step 4: Save to database
      setMintingState(prev => ({ ...prev, currentStep: 'saving' }));
      const dbResult = await createPixelNFTAPI({
        pixelIds: pixelData.pixelIds,
        startX: pixelData.startX,
        startY: pixelData.startY,
        endX: pixelData.endX,
        endY: pixelData.endY,
        imageUrl: imageResult.url!,
        metadataUrl: metadataResult.url!,
        nftMintAddress: mintResult.mint.toString(),
        ownerWallet: publicKey.toString(),
        transactionSignature: mintResult.transactionSignature
      });

      if (!dbResult.success) {
        console.warn('❌ Failed to save NFT data to database:', dbResult.error);
        // NFT was minted successfully, just database save failed
      }

      console.log('✅ NFT minted successfully!', mintResult);
      setMintingState({
        isLoading: false,
        success: true,
        transactionSignature: mintResult.transactionSignature
      });

      // Reset form
      setSelectedImage(null);
      setLinkUrl("");
      
    } catch (error) {
      console.error('❌ Minting error:', error);
      
      let errorMessage = 'Minting failed';
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction was cancelled by user';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient SOL balance';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMintingState({
        isLoading: false,
        error: errorMessage
      });
    }
  }, [connected, publicKey, wallet, selectedCount, selectedImage, linkUrl, totalCostSOL, uploadFile, uploadMetadata, selectedPixels]);

  const MintingSteps = () => (
    <div className="space-y-3">
      {/* Step 1: Connect Wallet */}
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        connected ? "bg-green-50 border-green-200" : "bg-muted/50 border-border"
      )}>
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          connected ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
        )}>
          {connected ? <CheckCircle className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Connect Wallet</div>
          {connected ? (
            <div className="text-xs text-green-600">
              Balance: {walletBalance.toFixed(4)} SOL
            </div>
          ) : (
            <WalletMultiButton className="!h-8 !text-xs mt-1" />
          )}
        </div>
      </div>

      {/* Step 2: Select Pixels */}
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        selectedCount > 0 ? "bg-green-50 border-green-200" : "bg-muted/50 border-border"
      )}>
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          selectedCount > 0 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
        )}>
          {selectedCount > 0 ? <CheckCircle className="w-4 h-4" /> : <Blocks className="w-4 h-4" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Select Pixels</div>
          <div className="text-xs text-muted-foreground">
            {selectedCount > 0 ? `${selectedCount} blocks selected` : "Select pixels on grid"}
          </div>
        </div>
      </div>

      {/* Step 3: Upload Image */}
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        selectedImage ? "bg-green-50 border-green-200" : "bg-muted/50 border-border"
      )}>
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          selectedImage ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
        )}>
          {selectedImage ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Upload Image</div>
          <div className="text-xs text-muted-foreground">
            {selectedImage ? selectedImage.name : "Required for NFT"}
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="p-4">
          <Card className="border-0 shadow-sm bg-card transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 font-pixel">
                  <Blocks className="w-4 h-4 text-foreground" />
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
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-xs text-muted-foreground font-pixel block">Blocks</span>
                  <span className="font-medium text-foreground font-pixel">{selectedCount}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-pixel block">Price/block</span>
                  <span className="font-medium text-foreground font-pixel">{floorPrice} SOL</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-pixel block">Total</span>
                  <span className="font-semibold text-foreground font-pixel">{totalCostSOL.toFixed(3)} SOL</span>
                </div>
              </div>

              {!connected && <WalletMultiButton className="w-full" />}
              
              {connected && (
                <>
                  <MintingSteps />
                  <ImageUpload 
                    onImageSelect={setSelectedImage}
                    selectedImage={selectedImage}
                  />
                </>
              )}

              <Button
                onClick={handleMint}
                disabled={!canMint || mintingState.isLoading}
                className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] group font-pixel text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                {mintingState.isLoading ? 'Minting...' : `Mint ${selectedCount} block${selectedCount !== 1 ? 's' : ''} 🚀`}
              </Button>

              {mintingState.error && (
                <div className="text-xs text-red-600 text-center p-2 bg-red-50 rounded">
                  {mintingState.error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <MintLoadingDialog 
          open={showMintDialog} 
          onOpenChange={setShowMintDialog}
          blockCount={selectedCount}
          mintingState={mintingState}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-80 border-l border-border bg-muted/30 p-4 hidden lg:block transition-colors duration-300">
        <Card className="border-0 shadow-sm bg-card transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 font-pixel">
                <Blocks className="w-4 h-4 text-foreground" />
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
                  <span className="font-semibold text-foreground text-sm">{totalCostSOL.toFixed(3)} SOL</span>
                </div>
              </div>
            </div>

            {/* Wallet Connection */}
            {!connected ? (
              <div className="space-y-2">
                <label className="text-xs font-pixel text-muted-foreground">Step 1: Connect Wallet</label>
                <WalletMultiButton className="w-full !h-9 !text-xs" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Wallet Connected</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Balance: {walletBalance.toFixed(4)} SOL
                </div>
              </div>
            )}

            {/* Link Input */}
            {connected && (
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
            )}

            {/* Image Upload */}
            {connected && (
              <ImageUpload 
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
              />
            )}

            {/* Mint Button */}
            <Button
              onClick={handleMint}
              disabled={!canMint || mintingState.isLoading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-[1.02] group font-pixel text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              {mintingState.isLoading 
                ? `${mintingState.currentStep === 'uploading' ? 'Uploading...' : 
                    mintingState.currentStep === 'minting' ? 'Minting...' : 
                    'Saving...'}` 
                : `Mint ${selectedCount} block${selectedCount !== 1 ? 's' : ''} 🚀`
              }
            </Button>

            {/* Status Messages */}
            {mintingState.success && (
              <div className="text-xs text-green-600 text-center p-2 bg-green-50 rounded">
                🎉 NFT minted successfully! 
                <a 
                  href={`https://explorer.solana.com/tx/${mintingState.transactionSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block underline hover:no-underline mt-1"
                >
                  View on Explorer
                </a>
              </div>
            )}

            {mintingState.error && (
              <div className="text-xs text-red-600 text-center p-2 bg-red-50 rounded">
                {mintingState.error}
              </div>
            )}

            {!canMint && connected && selectedCount > 0 && (
              <div className="text-xs text-muted-foreground text-center">
                {!selectedImage && 'Upload an image to continue'}
                {selectedImage && walletBalance < (totalCostSOL + 0.01) && 'Insufficient SOL balance'}
              </div>
            )}

            <div className="text-[10px] text-muted-foreground text-center space-y-1 font-pixel">
              <p>Each block becomes an NFT that you own forever</p>
              <p className="text-foreground">🔗 Secured on Solana blockchain</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <MintLoadingDialog 
        open={showMintDialog} 
        onOpenChange={setShowMintDialog}
        blockCount={selectedCount}
        mintingState={mintingState}
      />
    </>
  );
};
