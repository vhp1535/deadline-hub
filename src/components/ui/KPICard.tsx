import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  changeValue?: number;
  icon: LucideIcon;
  progress?: number;
  progressLabel?: string;
  variant?: "default" | "primary" | "warning" | "destructive" | "success";
  className?: string;
  isLive?: boolean;
}

const variantStyles = {
  default: {
    icon: "bg-secondary text-secondary-foreground",
    progress: "",
    glow: "",
  },
  primary: {
    icon: "bg-primary/15 text-primary",
    progress: "[&>div]:bg-primary",
    glow: "hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]",
  },
  warning: {
    icon: "bg-warning/15 text-warning",
    progress: "[&>div]:bg-warning",
    glow: "hover:shadow-[0_0_30px_hsl(var(--warning)/0.15)]",
  },
  destructive: {
    icon: "bg-destructive/15 text-destructive",
    progress: "[&>div]:bg-destructive",
    glow: "hover:shadow-[0_0_30px_hsl(var(--destructive)/0.15)]",
  },
  success: {
    icon: "bg-success/15 text-success",
    progress: "[&>div]:bg-success",
    glow: "hover:shadow-[0_0_30px_hsl(var(--success)/0.15)]",
  },
};

export function KPICard({
  title,
  value,
  change,
  changeType = "neutral",
  changeValue,
  icon: Icon,
  progress,
  progressLabel,
  variant = "default",
  className,
  isLive = false,
}: KPICardProps) {
  const styles = variantStyles[variant];

  const TrendIcon =
    changeType === "positive"
      ? TrendingUp
      : changeType === "negative"
      ? TrendingDown
      : Minus;

  return (
    <div
      className={cn(
        "glass-card-high p-5 transition-all duration-300",
        styles.glow,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
            )}
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>

        <div className={cn("rounded-xl p-3", styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-2">
          <TrendIcon
            className={cn(
              "h-4 w-4",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {changeValue !== undefined && (
              <span>
                {changeValue > 0 ? "+" : ""}
                {changeValue}%{" "}
              </span>
            )}
            {change}
          </span>
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {progressLabel || "Progress"}
            </span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className={cn("h-1.5 bg-secondary", styles.progress)}
          />
        </div>
      )}
    </div>
  );
}
