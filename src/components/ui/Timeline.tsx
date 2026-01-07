import { cn } from "@/lib/utils";
import { LucideIcon, Check, Clock, AlertCircle, XCircle } from "lucide-react";

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status: "completed" | "current" | "pending" | "failed";
  icon?: LucideIcon;
}

interface TimelineProps {
  steps: TimelineStep[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  compact?: boolean;
}

const statusConfig = {
  completed: {
    icon: Check,
    nodeClass: "border-success bg-success/10 text-success",
    lineClass: "bg-success",
    contentClass: "border-success/30 bg-success/5",
  },
  current: {
    icon: Clock,
    nodeClass: "border-warning bg-warning/10 text-warning animate-pulse",
    lineClass: "bg-border",
    contentClass: "border-warning/50 bg-warning/5",
  },
  pending: {
    icon: Clock,
    nodeClass: "border-muted bg-muted text-muted-foreground",
    lineClass: "bg-border",
    contentClass: "border-border bg-card/50",
  },
  failed: {
    icon: XCircle,
    nodeClass: "border-destructive bg-destructive/10 text-destructive",
    lineClass: "bg-destructive",
    contentClass: "border-destructive/50 bg-destructive/5",
  },
};

export function Timeline({
  steps,
  orientation = "vertical",
  className,
  compact = false,
}: TimelineProps) {
  if (orientation === "horizontal") {
    return (
      <div className={cn("relative", className)}>
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const config = statusConfig[step.status];
            const Icon = step.icon || config.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "relative flex flex-col items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-4 left-1/2 h-0.5 w-full",
                      statusConfig[steps[index + 1].status === "pending" ? step.status : steps[index + 1].status].lineClass
                    )}
                  />
                )}

                {/* Node */}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                    config.nodeClass
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "font-medium",
                      step.status === "pending"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {!compact && step.description && (
                    <p className="mt-1 text-xs text-muted-foreground max-w-[120px]">
                      {step.description}
                    </p>
                  )}
                  {step.timestamp && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {step.timestamp}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-px bg-border" />

      <div className={cn("space-y-4", compact && "space-y-2")}>
        {steps.map((step) => {
          const config = statusConfig[step.status];
          const Icon = step.icon || config.icon;

          return (
            <div key={step.id} className="relative flex gap-4 pl-10">
              {/* Node */}
              <div
                className={cn(
                  "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2",
                  config.nodeClass
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div
                className={cn(
                  "flex-1 rounded-lg border p-3",
                  config.contentClass,
                  compact && "p-2"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4
                      className={cn(
                        "font-medium",
                        step.status === "pending"
                          ? "text-muted-foreground"
                          : "text-foreground",
                        compact && "text-sm"
                      )}
                    >
                      {step.title}
                    </h4>
                    {!compact && step.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                  {step.status === "current" && (
                    <span className="flex h-2 w-2 rounded-full bg-warning animate-pulse" />
                  )}
                </div>
                {step.timestamp && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {step.timestamp}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
