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

  // Load wallet balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      getWalletBalance(publicKey).then(setWalletBalance);
    }
  }, [connected, publicKey]);

  // Calculate pixel data from selection
  const getPixelData = useCallback(() => {
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
    
    // Generate pixel IDs based on grid position (1000x1000 grid)
    const pixelIds = pixels.map(p => p.y * 1000 + p.x);
    
    return {
      pixels,
      pixelIds,
      startX,
      startY,
      endX,
      endY
    };
  }, [selectedPixels]);

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
        name: `SolanaPage Pixels ${pixelData.startX},${pixelData.startY}`,
        description: `SolanaPage Pixel NFT covering ${selectedCount} pixels from (${pixelData.startX},${pixelData.startY}) to (${pixelData.endX},${pixelData.endY}). Own a piece of internet history on Solana!`,
        image: imageResult.url,
        external_url: linkUrl || undefined,
        attributes: [
          { trait_type: "Pixel Count", value: selectedCount },
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
  }, [connected, publicKey, wallet, selectedCount, selectedImage, linkUrl, totalCostSOL, uploadFile, uploadMetadata, getPixelData]);

  if (isMobile) {
    return (
      <>
        <div className="p-4 bg-background border-t border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Blocks className="w-4 h-4 text-foreground" />
                <h3 className="text-sm font-pixel font-semibold">Selection</h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClearSelection}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-muted-foreground font-pixel block">Pixels</span>
                <span className="font-medium text-foreground font-pixel">{selectedCount}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-pixel block">Price/pixel</span>
                <span className="font-medium text-foreground font-pixel">{floorPrice} SOL</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-pixel block">Total</span>
                <span className="font-semibold text-foreground font-pixel">{totalCostSOL.toFixed(3)} SOL</span>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                connected ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
              )}>
                {connected ? <CheckCircle className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Connect Wallet</div>
                {connected ? (
                  <div className="text-xs text-green-600">Balance: {walletBalance.toFixed(4)} SOL</div>
                ) : (
                  <div className="text-xs text-muted-foreground">Required to mint</div>
                )}
              </div>
            </div>

            {!connected && (
              <WalletMultiButton className="w-full" />
            )}
            
            {connected && (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    selectedCount > 0 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                  )}>
                    {selectedCount > 0 ? <CheckCircle className="w-4 h-4" /> : <Blocks className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Select Pixels</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedCount > 0 ? `${selectedCount} pixels selected` : "Select pixels on grid"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
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

                <ImageUpload 
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                />
              </>
            )}

            <Button
              onClick={handleMint}
              disabled={!canMint || mintingState.isLoading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-pixel text-xs disabled:opacity-50"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              {mintingState.isLoading ? 'Minting...' : `Mint ${selectedCount} pixel${selectedCount !== 1 ? 's' : ''}`}
            </Button>

            {mintingState.error && (
              <div className="text-xs text-red-600 text-center p-2 bg-red-50 rounded">
                {mintingState.error}
              </div>
            )}
          </div>
        </div>

        <MintLoadingDialog 
          open={showMintDialog} 
          onOpenChange={setShowMintDialog}
          pixelCount={selectedCount}
          mintingState={mintingState}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-80 h-full bg-background border-l border-border p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Blocks className="w-4 h-4 text-foreground" />
              <h3 className="text-sm font-pixel font-semibold">Selection</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-pixel">
              <span className="text-muted-foreground">Pixels selected</span>
              <span className="font-medium text-foreground">{selectedCount}</span>
            </div>
            <div className="flex justify-between text-xs font-pixel">
              <span className="text-muted-foreground">Price per pixel</span>
              <span className="font-medium text-foreground">{floorPrice} SOL</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-pixel">
                <span className="font-medium text-foreground text-xs">Total</span>
                <span className="font-semibold text-foreground text-sm">{totalCostSOL.toFixed(3)} SOL</span>
              </div>
            </div>
          </div>

          {/* Wallet Connection - Consistent with mobile */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              connected ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
            )}>
              {connected ? <CheckCircle className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Connect Wallet</div>
              {connected ? (
                <div className="text-xs text-green-600">Balance: {walletBalance.toFixed(4)} SOL</div>
              ) : (
                <div className="text-xs text-muted-foreground">Required to mint</div>
              )}
            </div>
          </div>

          {!connected && (
            <WalletMultiButton className="w-full !h-9 !text-xs" />
          )}

          {connected && (
            <>
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

              <ImageUpload 
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
              />
            </>
          )}

          <Button
            onClick={handleMint}
            disabled={!canMint || mintingState.isLoading}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-pixel text-xs disabled:opacity-50"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            {mintingState.isLoading 
              ? `${mintingState.currentStep === 'uploading' ? 'Uploading...' : 
                  mintingState.currentStep === 'minting' ? 'Minting...' : 
                  'Saving...'}` 
              : `Mint ${selectedCount} pixel${selectedCount !== 1 ? 's' : ''}`
            }
          </Button>

          {mintingState.success && (
            <div className="text-xs text-green-600 text-center p-2 bg-green-50 rounded">
              🎉 NFT minted successfully! 
              <a 
                href={`https://explorer.solana.com/tx/${mintingState.transactionSignature}?cluster=devnet`}
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
            <p>Each pixel becomes a permanent ad space that you own</p>
            <p className="text-foreground">🔗 Secured on Solana blockchain</p>
          </div>
        </div>
      </div>

      <MintLoadingDialog 
        open={showMintDialog} 
        onOpenChange={setShowMintDialog}
        pixelCount={selectedCount}
        mintingState={mintingState}
      />
    </>
  );
};
