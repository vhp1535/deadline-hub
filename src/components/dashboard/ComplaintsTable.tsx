import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
      <div className="border-b border-border p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground sm:text-lg">Priority Complaints</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">Complaints requiring immediate attention</p>
          </div>
          <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
            {complaints.length} Active
          </Badge>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-5">
                Complaint ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-5">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-5">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-5">
                SLA Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-5">
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
                  <td className="px-4 py-4 sm:px-5">
                    <div>
                      <p className="font-medium text-foreground">{complaint.id}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{complaint.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <Badge className={cn("gap-1", severityConfig[complaint.severity].color)}>
                      <SeverityIcon className="h-3 w-3" />
                      <span className="hidden sm:inline">{complaint.severity}</span>
                    </Badge>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <Badge variant="outline" className={cn("capitalize", statusConfig[complaint.status])}>
                      {complaint.status.replace("-", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <div className="w-24 space-y-1 sm:w-32">
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
                  <td className="px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-border sm:h-7 sm:w-7">
                        <AvatarFallback className="bg-secondary text-xs">
                          {complaint.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden text-sm text-foreground lg:inline">{complaint.assignee.name}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-border md:hidden">
        {complaints.map((complaint) => {
          const SeverityIcon = severityConfig[complaint.severity].icon;
          const isUrgent = complaint.slaProgress >= 80;
          
          return (
            <div
              key={complaint.id}
              className="p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground text-sm">{complaint.id}</p>
                    <Badge className={cn("gap-1 text-xs", severityConfig[complaint.severity].color)}>
                      <SeverityIcon className="h-3 w-3" />
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{complaint.title}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3 flex items-center justify-between gap-4">
                <Badge variant="outline" className={cn("capitalize text-xs", statusConfig[complaint.status])}>
                  {complaint.status.replace("-", " ")}
                </Badge>
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5 border border-border">
                    <AvatarFallback className="bg-secondary text-[10px]">
                      {complaint.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    "text-xs font-medium",
                    isUrgent ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {complaint.slaRemaining}
                  </span>
                </div>
              </div>
              
              <Progress 
                value={complaint.slaProgress} 
                className={cn(
                  "h-1 mt-3",
                  isUrgent && "[&>div]:bg-destructive"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
