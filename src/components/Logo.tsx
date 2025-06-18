import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const Logo = ({ 
  size = "md", 
  showText = true, 
  className 
}: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: "w-6 h-6",
      text: "text-sm",
    },
    md: {
      container: "w-8 h-8 sm:w-10 sm:h-10",
      text: "text-base sm:text-lg",
    },
    lg: {
      container: "w-12 h-12",
      text: "text-xl",
    },
  };

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {/* Logo Image */}
      <div className={cn(
        "rounded-lg flex items-center justify-center overflow-hidden",
        sizeClasses[size].container
      )}>
        <img 
          src="/pixel-logo.png" 
          alt="SolPage Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            "font-bold text-foreground leading-none font-mono tracking-tight",
            sizeClasses[size].text
          )}>
            <span className="hidden sm:inline">SolPage</span>
            <span className="sm:hidden">SP</span>
          </h1>
        </div>
      )}
    </div>
  );
}; 