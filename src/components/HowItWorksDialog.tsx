import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mouse, Link, Image, Sparkles, TrendingUp, Globe } from "lucide-react";

interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HowItWorksDialog = ({ open, onOpenChange }: HowItWorksDialogProps) => {
  const steps = [
    {
      icon: <Mouse className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Select Your Pixels",
      description: "Click and drag to select pixels on the grid. Each pixel is your advertising space."
    },
    {
      icon: <Image className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Upload Your Ad",
      description: "Upload your logo, banner, or any image that represents your brand or project."
    },
    {
      icon: <Link className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Add Your Link",
      description: "Add your website URL to drive traffic directly to your business or project."
    },
    {
      icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Purchase & Go Live",
      description: "Complete your purchase and your ad goes live immediately for everyone to see!"
    },
    {
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Drive Traffic",
      description: "Watch visitors discover and click on your ad, driving traffic to your website."
    },
    {
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Part of History",
      description: "Your ad becomes a permanent part of internet advertising history."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl font-bold font-pixel mb-2">
            How SolPage Works
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground">
            Advertise your brand on the famous pixel grid. Each pixel you buy becomes a permanent advertising space that drives traffic to your website.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="bg-foreground/10 border border-foreground/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong className="font-pixel">solanapage.com</strong> is a modern reimagining of The Million Dollar Homepage, 
              but this time on the blockchain. Each pixel you purchase becomes an NFT that you own forever.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-foreground/10 rounded-full flex items-center justify-center text-foreground">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 font-pixel text-xs sm:text-sm">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground font-pixel">Why solanapage.com?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5 text-xs">•</span>
                <span>Permanent advertising space - your ad stays forever</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5 text-xs">•</span>
                <span>Affordable pricing - just 0.01 SOL per pixel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5 text-xs">•</span>
                <span>Direct traffic to your website with clickable ads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5 text-xs">•</span>
                <span>Part of internet history - following the original 2005 concept</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5 text-xs">•</span>
                <span>Global audience - visitors from around the world</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center sm:justify-end pt-3 sm:pt-4">
            <Button 
              onClick={() => onOpenChange(false)} 
              size="sm" 
              className="font-pixel w-full sm:w-auto px-6 sm:px-8"
            >
              Start Advertising
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 