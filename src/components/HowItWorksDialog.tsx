import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mouse, Link, Image, Zap, TrendingUp, Clock } from "lucide-react";

interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HowItWorksDialog = ({ open, onOpenChange }: HowItWorksDialogProps) => {
  const steps = [
    {
      icon: <Mouse className="w-5 h-5" />,
      title: "Select Pixels",
      description: "Click and drag to select pixels on the 100x100 grid. Each pixel is your advertising space."
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: "Upload Your Ad",
      description: "Upload your logo, banner, or image that represents your brand. Images are stored on Arweave."
    },
    {
      icon: <Link className="w-5 h-5" />,
      title: "Add Website Link",
      description: "Add your website URL. When users click your pixels, they'll be redirected to your site."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Mint & Pay",
      description: "Pay 0.01 SOL per pixel and mint your NFT ad. Your pixels go live immediately."
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Drive Traffic",
      description: "Your ad is now permanent and clickable. Watch traffic flow to your website."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Forever Yours",
      description: "Your pixels are yours permanently. No recurring fees, no expiration dates."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-pixel">
            How SolPage Works
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Buy pixels to advertise your brand permanently on our pixel grid. 
            Inspired by the legendary Million Dollar Homepage from 2005.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/30">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1 font-pixel">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground font-pixel">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Permanent advertising - no expiration</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Just 0.01 SOL per pixel</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Direct traffic to your website</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Stored on Solana blockchain</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Global audience reach</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Part of internet history</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => onOpenChange(false)} 
              className="font-pixel px-8"
            >
              Start Advertising
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 