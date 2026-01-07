import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Complaint {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "escalated" | "resolved";
  slaProgress: number;
  slaRemaining: string;
  assignee: {
    name: string;
    initials: string;
  };
}

const complaints: Complaint[] = [
  {
    id: "CMP-001",
    title: "Payment gateway timeout issues",
    severity: "critical",
    status: "escalated",
    slaProgress: 85,
    slaRemaining: "2h 15m",
    assignee: { name: "Sarah Chen", initials: "SC" },
  },
  {
    id: "CMP-002",
    title: "User authentication failures",
    severity: "high",
    status: "in-progress",
    slaProgress: 45,
    slaRemaining: "8h 30m",
    assignee: { name: "Mike Ross", initials: "MR" },
  },
  {
    id: "CMP-003",
    title: "Dashboard loading slowly",
    severity: "medium",
    status: "open",
    slaProgress: 20,
    slaRemaining: "22h 45m",
    assignee: { name: "Emma Wilson", initials: "EW" },
  },
  {
    id: "CMP-004",
    title: "Email notifications delayed",
    severity: "low",
    status: "in-progress",
    slaProgress: 60,
    slaRemaining: "5h 00m",
    assignee: { name: "James Lee", initials: "JL" },
  },
  {
    id: "CMP-005",
    title: "API rate limiting errors",
    severity: "high",
    status: "escalated",
    slaProgress: 92,
    slaRemaining: "45m",
    assignee: { name: "Sarah Chen", initials: "SC" },
  },
];

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
};

export function ComplaintsTable() {
  return (
    <div className="glass-card animate-fade-in">
      <div className="border-b border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Priority Complaints</h3>
            <p className="text-sm text-muted-foreground">Complaints requiring immediate attention</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {complaints.length} Active
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Complaint ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Severity
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                SLA Progress
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {complaints.map((complaint) => {
              const SeverityIcon = severityConfig[complaint.severity].icon;
              const isUrgent = complaint.slaProgress >= 80;
              
              return (
                <tr
                  key={complaint.id}
                  className="group transition-colors hover:bg-secondary/50"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-foreground">{complaint.id}</p>
                      <p className="text-sm text-muted-foreground">{complaint.title}</p>
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
                    <div className="w-32 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn(
                          "font-medium",
                          isUrgent ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {complaint.slaRemaining}
                        </span>
                        <span className="text-muted-foreground">{complaint.slaProgress}%</span>
                      </div>
                      <Progress 
                        value={complaint.slaProgress} 
                        className={cn(
                          "h-1.5",
                          isUrgent && "[&>div]:bg-destructive"
                        )}
                      />
                    </div>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
