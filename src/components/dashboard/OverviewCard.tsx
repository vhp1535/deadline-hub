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
    <div className="glass-card p-5 glow-effect animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconBgClass)}>
            <Icon className={cn("h-5 w-5", iconColorClass)} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold text-foreground">{value}</p>
          </div>
          {change && (
            <p className={cn("text-sm font-medium", changeColorClass)}>
              {change}
            </p>
          )}
        </div>

        {progress !== undefined && (
          <div className="relative flex items-center justify-center">
            <ProgressRing progress={progress} variant={variant} />
            <span className="absolute text-sm font-semibold text-foreground">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
