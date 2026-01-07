import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";

interface LiveIndicatorProps {
  isLive?: boolean;
  label?: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LiveIndicator({
  isLive = true,
  label = "Live",
  className,
  showIcon = true,
  size = "sm",
}: LiveIndicatorProps) {
  const sizeClasses = {
    sm: "text-xs gap-1.5",
    md: "text-sm gap-2",
    lg: "text-base gap-2",
  };

  const dotSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1",
        isLive
          ? "bg-success/10 text-success border border-success/20"
          : "bg-muted text-muted-foreground border border-border",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        isLive ? (
          <Wifi className={iconSizes[size]} />
        ) : (
          <WifiOff className={iconSizes[size]} />
        )
      )}
      <span
        className={cn(
          "relative rounded-full",
          dotSizes[size],
          isLive ? "bg-success" : "bg-muted-foreground"
        )}
      >
        {isLive && (
          <span
            className={cn(
              "absolute inset-0 rounded-full bg-success animate-ping",
              dotSizes[size]
            )}
          />
        )}
      </span>
      <span className="font-medium">{isLive ? label : "Offline"}</span>
    </div>
  );
}
