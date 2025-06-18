import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Blocks, Wallet, Link, Image, Sparkles, TrendingUp } from "lucide-react";

interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HowItWorksDialog = ({ open, onOpenChange }: HowItWorksDialogProps) => {
  const steps = [
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Connect Your Wallet",
      description: "Connect your Solana wallet to start purchasing pixels on the grid."
    },
    {
      icon: <Blocks className="w-5 h-5" />,
      title: "Select Your Pixels",
      description: "Click and drag to select the pixels you want to own. Each pixel is unique and becomes your NFT."
    },
    {
      icon: <Link className="w-5 h-5" />,
      title: "Add Your Link",
      description: "Add a link to your website, project, or social media to drive traffic to your content."
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: "Upload Your Image",
      description: "Upload an image that will be displayed on your pixels. Make it memorable!"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Mint Your NFTs",
      description: "Complete the purchase and mint your pixels as NFTs on the Solana blockchain."
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Own Forever",
      description: "Your pixels are yours forever! Trade them, keep them, or update the content anytime."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-pixel">
            How It Works
          </DialogTitle>
          <DialogDescription className="text-base">
            Own a piece of internet history on the blockchain
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="bg-foreground/10 border border-foreground/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong className="font-pixel">millionsolpage.com</strong> is a modern reimagining of The Million Dollar Homepage, 
              but this time on the blockchain. Each pixel you purchase becomes an NFT that you own forever.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center text-foreground">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1 font-pixel text-sm">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground font-pixel">Why millionsolpage.com?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>True ownership through NFTs on Solana blockchain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Low transaction fees and instant confirmations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Update your pixel content anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Trade your pixels on secondary markets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground mt-0.5">•</span>
                <span>Be part of internet history, permanently on-chain</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)} size="lg" className="font-pixel">
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 