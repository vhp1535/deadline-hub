import { cn } from "@/lib/utils";
import { User, ArrowUpCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface TimelineEvent {
  id: string;
  level: number;
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "current" | "pending";
  icon: "user" | "escalate" | "alert" | "resolved";
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    level: 1,
    title: "Level 1: Agent Assigned",
    description: "Complaint assigned to front-line support agent",
    timestamp: "Jan 5, 2026 • 09:15 AM",
    status: "completed",
    icon: "user",
  },
  {
    id: "2",
    level: 2,
    title: "Level 2: Supervisor Review",
    description: "Escalated to supervisor after SLA breach warning",
    timestamp: "Jan 5, 2026 • 02:30 PM",
    status: "completed",
    icon: "escalate",
  },
  {
    id: "3",
    level: 3,
    title: "Level 3: Department Head",
    description: "Critical priority - requires department head attention",
    timestamp: "Jan 6, 2026 • 10:00 AM",
    status: "current",
    icon: "alert",
  },
  {
    id: "4",
    level: 4,
    title: "Level 4: Executive Review",
    description: "Pending executive team review if unresolved",
    timestamp: "Pending",
    status: "pending",
    icon: "resolved",
  },
];

const iconMap = {
  user: User,
  escalate: ArrowUpCircle,
  alert: AlertTriangle,
  resolved: CheckCircle,
};

export function EscalationTimeline() {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">Escalation Timeline</h3>
        <p className="text-sm text-muted-foreground">CMP-001: Payment gateway timeout</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 h-full w-px bg-border" />

        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            const Icon = iconMap[event.icon];
            
            return (
              <div key={event.id} className="relative flex gap-4 pl-10">
                {/* Node */}
                <div
                  className={cn(
                    "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                    event.status === "completed" && "border-success bg-success/10",
                    event.status === "current" && "border-warning bg-warning/10 animate-pulse",
                    event.status === "pending" && "border-muted bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      event.status === "completed" && "text-success",
                      event.status === "current" && "text-warning",
                      event.status === "pending" && "text-muted-foreground"
                    )}
                  />
                </div>

                {/* Content */}
                <div className={cn(
                  "flex-1 rounded-lg border p-4 transition-all",
                  event.status === "current" 
                    ? "border-warning/50 bg-warning/5" 
                    : "border-border bg-card/50"
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={cn(
                        "font-medium",
                        event.status === "pending" 
                          ? "text-muted-foreground" 
                          : "text-foreground"
                      )}>
                        {event.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    {event.status === "current" && (
                      <span className="flex h-2 w-2 rounded-full bg-warning animate-pulse" />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {event.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
