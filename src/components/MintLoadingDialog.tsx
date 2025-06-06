import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Heart, Zap, Star, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface MintLoadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockCount: number;
}

const loadingMessages = [
  { text: "Preparing your pixels...", icon: <Sparkles className="w-5 h-5" /> },
  { text: "Connecting to blockchain...", icon: <Zap className="w-5 h-5" /> },
  { text: "Minting your NFTs...", icon: <Star className="w-5 h-5" /> },
  { text: "Almost there...", icon: <Heart className="w-5 h-5" /> },
  { text: "Success! Welcome to history!", icon: <CheckCircle className="w-5 h-5" /> },
];

export const MintLoadingDialog = ({ open, onOpenChange, blockCount }: MintLoadingDialogProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (open) {
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
  }, [open, onOpenChange]);

  const currentMessage = loadingMessages[currentMessageIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-0 bg-transparent shadow-none">
        <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6 relative overflow-hidden">
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5 animate-pulse" />
          
          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Icon */}
            <div className={cn(
              "mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
              isComplete 
                ? "bg-foreground text-background scale-110" 
                : "bg-foreground/10 text-foreground"
            )}>
              {isComplete ? (
                <CheckCircle className="w-10 h-10 animate-bounce" />
              ) : (
                <div className="relative">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {currentMessage.icon}
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-pixel text-foreground">
                {isComplete ? "Success! 🎉" : `Minting ${blockCount} blocks...`}
              </h3>
              <p className={cn(
                "text-sm transition-all duration-500",
                isComplete ? "text-foreground font-semibold" : "text-muted-foreground"
              )}>
                {currentMessage.text}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {loadingMessages.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index <= currentMessageIndex
                      ? isComplete && index === loadingMessages.length - 1
                        ? "bg-foreground w-3 h-3"
                        : "bg-foreground"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Emotional messages */}
            {!isComplete && (
              <div className="text-xs text-muted-foreground animate-pulse">
                {currentMessageIndex === 0 && "Getting everything ready for you... 💫"}
                {currentMessageIndex === 1 && "This is going to be amazing! 🚀"}
                {currentMessageIndex === 2 && "Creating your piece of history... 🎨"}
                {currentMessageIndex === 3 && "Just a moment more... 💝"}
              </div>
            )}

            {isComplete && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  Your pixels are now permanently on the blockchain!
                </p>
                <p className="text-xs text-foreground font-pixel">
                  Transaction complete • View on explorer →
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 