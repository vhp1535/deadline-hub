import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SLAProgress } from "@/components/ui/SLAProgress";
import type { Complaint } from "@/data/mockData";

interface ComplaintRowProps {
  complaint: Complaint;
  onClick?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

const severityConfig = {
  critical: { color: "bg-destructive text-destructive-foreground", icon: XCircle },
  high: { color: "bg-warning text-warning-foreground", icon: AlertTriangle },
  medium: { color: "bg-primary/20 text-primary", icon: Clock },
  low: { color: "bg-muted text-muted-foreground", icon: CheckCircle2 },
};

const statusConfig = {
  open: "border-muted-foreground text-muted-foreground",
  "in-progress": "border-primary text-primary",
  escalated: "border-warning text-warning",
  resolved: "border-success text-success",
  failed: "border-destructive text-destructive",
};

export function ComplaintRow({
  complaint,
  onClick,
  showActions = true,
  compact = false,
  className,
}: ComplaintRowProps) {
  const SeverityIcon = severityConfig[complaint.severity].icon;
  const isUrgent = complaint.slaProgress >= 80;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-secondary/50 transition-colors cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <Badge className={cn("gap-1 text-xs", severityConfig[complaint.severity].color)}>
            <SeverityIcon className="h-3 w-3" />
          </Badge>
          <div>
            <p className="font-medium text-sm text-foreground">{complaint.id}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {complaint.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SLAProgress
            progress={complaint.slaProgress}
            remaining={complaint.slaRemaining}
            size="sm"
            showIcon={false}
          />
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <tr
      className={cn(
        "group transition-colors hover:bg-secondary/50 cursor-pointer",
        isUrgent && "bg-destructive/5",
        className
      )}
      onClick={onClick}
    >
      <td className="px-5 py-4">
        <div>
          <p className="font-medium text-foreground">{complaint.id}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">{complaint.title}</p>
        </div>
      </td>
      <td className="px-5 py-4">
        <Badge className={cn("gap-1", severityConfig[complaint.severity].color)}>
          <SeverityIcon className="h-3 w-3" />
          {complaint.severity}
        </Badge>
      </td>
      <td className="px-5 py-4">
        <Badge variant="outline" className={cn("capitalize", statusConfig[complaint.status])}>
          {complaint.status.replace("-", " ")}
        </Badge>
      </td>
      <td className="px-5 py-4">
        <SLAProgress
          progress={complaint.slaProgress}
          remaining={complaint.slaRemaining}
          size="sm"
          animated={isUrgent}
        />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border">
            <AvatarFallback className="bg-secondary text-xs">
              {complaint.assignee.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-foreground">{complaint.assignee.name}</span>
        </div>
      </td>
      {showActions && (
        <td className="px-5 py-4">
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </td>
      )}
    </tr>
  );
}
