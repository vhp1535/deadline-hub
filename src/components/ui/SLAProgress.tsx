import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface SLAProgressProps {
  progress: number;
  remaining: string;
  total?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

export function SLAProgress({
  progress,
  remaining,
  total,
  showIcon = true,
  size = "md",
  className,
  animated = false,
}: SLAProgressProps) {
  const isUrgent = progress >= 80;
  const isCritical = progress >= 95;
  const isCompleted = progress <= 0;

  const sizeClasses = {
    sm: {
      container: "w-24",
      text: "text-xs",
      progress: "h-1",
      icon: "h-3 w-3",
    },
    md: {
      container: "w-32",
      text: "text-sm",
      progress: "h-1.5",
      icon: "h-4 w-4",
    },
    lg: {
      container: "w-40",
      text: "text-base",
      progress: "h-2",
      icon: "h-5 w-5",
    },
  };

  const sizes = sizeClasses[size];

  const getStatusColor = () => {
    if (isCompleted) return "text-success";
    if (isCritical) return "text-destructive";
    if (isUrgent) return "text-warning";
    return "text-muted-foreground";
  };

  const getProgressColor = () => {
    if (isCompleted) return "[&>div]:bg-success";
    if (isCritical) return "[&>div]:bg-destructive";
    if (isUrgent) return "[&>div]:bg-warning";
    return "[&>div]:bg-primary";
  };

  const StatusIcon = isCompleted
    ? CheckCircle
    : isCritical
    ? AlertTriangle
    : Clock;

  return (
    <div className={cn(sizes.container, "space-y-1.5", className)}>
      <div className={cn("flex items-center justify-between", sizes.text)}>
        <div className={cn("flex items-center gap-1.5 font-medium", getStatusColor())}>
          {showIcon && (
            <StatusIcon
              className={cn(
                sizes.icon,
                isCritical && animated && "animate-pulse"
              )}
            />
          )}
          <span>{remaining}</span>
        </div>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      
      <Progress
        value={progress}
        className={cn(
          sizes.progress,
          "bg-secondary",
          getProgressColor(),
          isCritical && animated && "animate-pulse"
        )}
      />
      
      {total && (
        <p className={cn("text-muted-foreground", sizes.text)}>
          of {total}
        </p>
      )}
    </div>
  );
}
