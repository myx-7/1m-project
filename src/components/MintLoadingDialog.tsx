import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Heart, Zap, Star, CheckCircle, Upload, Save, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface MintingState {
  isLoading: boolean;
  success?: boolean;
  error?: string;
  transactionSignature?: string;
  currentStep?: 'uploading' | 'minting' | 'saving';
}

interface MintLoadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pixelCount: number;
  mintingState?: MintingState;
}

const getStepMessage = (step?: string) => {
  switch (step) {
    case 'uploading':
      return { text: "Uploading to Arweave...", icon: <Upload className="w-4 h-4 sm:w-5 sm:h-5" /> };
    case 'minting':
      return { text: "Minting on Solana...", icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> };
    case 'saving':
      return { text: "Saving to database...", icon: <Save className="w-4 h-4 sm:w-5 sm:h-5" /> };
    default:
      return { text: "Preparing your pixels...", icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> };
  }
};

const loadingMessages = [
  { text: "Preparing your pixels...", icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { text: "Connecting to blockchain...", icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { text: "Publishing your ad...", icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { text: "Almost there...", icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { text: "Success! Welcome to history!", icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

export const MintLoadingDialog = ({ open, onOpenChange, pixelCount, mintingState }: MintLoadingDialogProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Use mintingState if provided, otherwise fall back to automatic progression
  const useMintingState = mintingState && (mintingState.isLoading || mintingState.success || mintingState.error);
  const currentMessage = useMintingState ? getStepMessage(mintingState.currentStep) : loadingMessages[currentMessageIndex];

  useEffect(() => {
    if (open && !useMintingState) {
      setCurrentMessageIndex(0);
      setIsComplete(false);
      
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsComplete(true);
            // Trigger confetti
            setTimeout(() => {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#000000', '#333333', '#666666', '#999999', '#cccccc'],
              });
              
              // Second burst
              setTimeout(() => {
                confetti({
                  particleCount: 50,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0 },
                  colors: ['#000000', '#ffffff', '#666666'],
                });
              }, 250);
              
              // Third burst
              setTimeout(() => {
                confetti({
                  particleCount: 50,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1 },
                  colors: ['#000000', '#ffffff', '#666666'],
                });
              }, 400);
            }, 100);
            
            // Auto close after celebration
            setTimeout(() => {
              onOpenChange(false);
            }, 3000);
            
            return prev;
          }
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [open, onOpenChange, useMintingState]);

  // Handle confetti for successful minting
  useEffect(() => {
    if (mintingState?.success && open) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#000000', '#333333', '#666666', '#999999', '#cccccc'],
        });
        
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#000000', '#ffffff', '#666666'],
          });
        }, 250);
        
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#000000', '#ffffff', '#666666'],
          });
        }, 400);
      }, 100);

      // Auto close after celebration
      setTimeout(() => {
        onOpenChange(false);
      }, 4000);
    }
  }, [mintingState?.success, open, onOpenChange]);

  const getStatusIcon = () => {
    if (mintingState?.error) {
      return <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />;
    }
    if (mintingState?.success) {
      return <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />;
    }
    if (mintingState?.isLoading || !useMintingState) {
      return <Loader2 className="w-8 h-8 sm:w-10 sm:h-10" />;
    }
    return <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />;
  };

  const getTitle = () => {
    if (mintingState?.error) return "Minting Failed";
    if (mintingState?.success) return "Success! 🎉";
    if (mintingState?.isLoading) return `Minting ${pixelCount} pixels...`;
    return isComplete ? "Success! 🎉" : `Minting ${pixelCount} pixels...`;
  };

  const getMessage = () => {
    if (mintingState?.error) return mintingState.error;
    if (mintingState?.success) return "Your ad is now live and driving traffic!";
    return currentMessage.text;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-md border-0 bg-transparent shadow-none p-0">
        <div className="bg-card border border-border rounded-lg p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Icon */}
            <div className={cn(
              "mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center",
              mintingState?.success || isComplete
                ? "bg-foreground text-background" 
                : mintingState?.error
                ? "bg-red-50 text-red-600"
                : "bg-foreground/10 text-foreground"
            )}>
              {getStatusIcon()}
            </div>

            {/* Message */}
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-bold font-pixel text-foreground">
                {getTitle()}
              </h3>
              <p className={cn(
                "text-sm px-2",
                mintingState?.success || isComplete ? "text-foreground font-semibold" : 
                mintingState?.error ? "text-red-600" : "text-muted-foreground"
              )}>
                {getMessage()}
              </p>
            </div>

            {/* Progress dots (only show if not using mintingState) */}
            {!useMintingState && (
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {loadingMessages.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                      index <= currentMessageIndex
                        ? isComplete && index === loadingMessages.length - 1
                          ? "bg-foreground w-2 h-2 sm:w-3 sm:h-3"
                          : "bg-foreground"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Step indicator for minting process */}
            {useMintingState && mintingState.isLoading && (
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {['uploading', 'minting', 'saving'].map((step, index) => (
                  <div
                    key={step}
                    className={cn(
                      "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                      step === mintingState.currentStep
                        ? "bg-foreground w-2 h-2 sm:w-3 sm:h-3"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Emotional messages */}
            {!useMintingState && !isComplete && (
              <div className="text-xs text-muted-foreground px-2">
                {currentMessageIndex === 0 && "Getting everything ready for you... 💫"}
                {currentMessageIndex === 1 && "This is going to be amazing! 🚀"}
                {currentMessageIndex === 2 && "Creating your piece of history... 🎨"}
                {currentMessageIndex === 3 && "Just a moment more... 💝"}
              </div>
            )}

            {/* Success message */}
            {(mintingState?.success || isComplete) && (
              <div className="space-y-2 px-2">
                <p className="text-sm text-muted-foreground">
                  Your ad space is now permanent and driving traffic!
                </p>
                {mintingState?.transactionSignature && (
                  <a 
                    href={`https://explorer.solana.com/tx/${mintingState.transactionSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-foreground font-pixel underline hover:no-underline block"
                  >
                    View on Solana Explorer →
                  </a>
                )}
              </div>
            )}

            {/* Error actions */}
            {mintingState?.error && (
              <div className="space-y-3">
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-xs bg-foreground text-background rounded hover:bg-foreground/90"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 