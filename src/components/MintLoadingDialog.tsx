import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle, Upload, Save, XCircle, Zap } from "lucide-react";
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
      return { text: "Uploading to Arweave...", icon: <Upload className="w-5 h-5" /> };
    case 'minting':
      return { text: "Minting on Solana...", icon: <Zap className="w-5 h-5" /> };
    case 'saving':
      return { text: "Saving to database...", icon: <Save className="w-5 h-5" /> };
    default:
      return { text: "Preparing your pixels...", icon: <Loader2 className="w-5 h-5 animate-spin" /> };
  }
};

export const MintLoadingDialog = ({ open, onOpenChange, pixelCount, mintingState }: MintLoadingDialogProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = useCallback(() => {
    if (mintingState?.success && !showSuccess) {
      setShowSuccess(true);
      // Auto close after showing success
      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
      }, 3000);
    }
  }, [mintingState?.success, showSuccess, onOpenChange]);

  useEffect(() => {
    handleSuccess();
  }, [handleSuccess]);

  // Reset success state when dialog closes
  useEffect(() => {
    if (!open) {
      setShowSuccess(false);
    }
  }, [open]);

  const currentMessage = mintingState ? getStepMessage(mintingState.currentStep) : getStepMessage();

  const getStatusIcon = () => {
    if (mintingState?.error) {
      return <XCircle className="w-10 h-10 text-red-500" />;
    }
    if (mintingState?.success || showSuccess) {
      return <CheckCircle className="w-10 h-10 text-green-500" />;
    }
    return <Loader2 className="w-10 h-10 animate-spin" />;
  };

  const getTitle = () => {
    if (mintingState?.error) return "Minting Failed";
    if (mintingState?.success || showSuccess) return "Success! 🎉";
    return `Minting ${pixelCount} pixels...`;
  };

  const getMessage = () => {
    if (mintingState?.error) return mintingState.error;
    if (mintingState?.success || showSuccess) return "Your ad is now live and driving traffic!";
    return currentMessage.text;
  };

  const isSuccess = mintingState?.success || showSuccess;
  const isError = !!mintingState?.error;
  const isLoading = mintingState?.isLoading || (!mintingState && !isSuccess && !isError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-0 bg-transparent shadow-none p-0">
        <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
          {/* Icon */}
          <div className={cn(
            "mx-auto w-20 h-20 rounded-full flex items-center justify-center",
            isSuccess ? "bg-green-50 text-green-600" :
            isError ? "bg-red-50 text-red-600" :
            "bg-muted text-foreground"
          )}>
            {getStatusIcon()}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-pixel text-foreground">
              {getTitle()}
            </h3>
            <p className={cn(
              "text-sm",
              isSuccess ? "text-green-600 font-semibold" :
              isError ? "text-red-600" :
              "text-muted-foreground"
            )}>
              {getMessage()}
            </p>
          </div>

          {/* Step indicators for minting process */}
          {isLoading && mintingState && (
            <div className="flex justify-center gap-2">
              {['uploading', 'minting', 'saving'].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    step === mintingState.currentStep
                      ? "bg-primary w-3 h-3"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          )}

          {/* Success details */}
          {isSuccess && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your pixels are now permanent and driving traffic!
              </p>
              {mintingState?.transactionSignature && (
                <a 
                  href={`https://explorer.solana.com/tx/${mintingState.transactionSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-pixel underline hover:no-underline block"
                >
                  View on Solana Explorer →
                </a>
              )}
            </div>
          )}

          {/* Error actions */}
          {isError && (
            <div className="space-y-3">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 font-pixel"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 