import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  progress?: number;
  variant?: "default" | "primary" | "warning" | "destructive";
}

function ProgressRing({ progress, variant }: { progress: number; variant: string }) {
  const radius = 28;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClass = {
    default: "stroke-muted-foreground",
    primary: "stroke-primary",
    warning: "stroke-warning",
    destructive: "stroke-destructive",
  }[variant] || "stroke-primary";

  return (
    <svg height={radius * 2} width={radius * 2} className="progress-ring">
      <circle
        className="stroke-muted"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        className={cn("transition-all duration-500", colorClass)}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

export function OverviewCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  progress,
  variant = "default",
}: OverviewCardProps) {
  const iconBgClass = {
    default: "bg-muted",
    primary: "bg-primary/10",
    warning: "bg-warning/10",
    destructive: "bg-destructive/10",
  }[variant];

  const iconColorClass = {
    default: "text-muted-foreground",
    primary: "text-primary",
    warning: "text-warning",
    destructive: "text-destructive",
  }[variant];

  const changeColorClass = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <div className="glass-card p-3 sm:p-5 glow-effect animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
          <div className={cn("flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg flex-shrink-0", iconBgClass)}>
            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", iconColorClass)} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl sm:text-3xl font-semibold text-foreground">{value}</p>
          </div>
          {change && (
            <p className={cn("text-xs sm:text-sm font-medium truncate", changeColorClass)}>
              {change}
            </p>
          )}
        </div>

        {progress !== undefined && (
          <div className="relative flex items-center justify-center flex-shrink-0 scale-75 sm:scale-100 origin-top-right">
            <ProgressRing progress={progress} variant={variant} />
            <span className="absolute text-xs sm:text-sm font-semibold text-foreground">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
