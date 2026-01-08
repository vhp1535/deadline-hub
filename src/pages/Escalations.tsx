import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { escalations } from "@/data/mockData";
import { RefreshCw, ArrowUp, ArrowDown, AlertTriangle, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { color: "border-warning text-warning", icon: AlertTriangle, bg: "bg-warning/10" },
  active: { color: "border-primary text-primary", icon: RefreshCw, bg: "bg-primary/10" },
  resolved: { color: "border-success text-success", icon: CheckCircle, bg: "bg-success/10" },
  failed: { color: "border-destructive text-destructive", icon: XCircle, bg: "bg-destructive/10" },
};

export default function Escalations() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Escalation Management</h2>
            <p className="text-sm text-muted-foreground">Monitor and manage active escalations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <ArrowDown className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Bulk</span> De-escalate
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
              Retry All
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="glass-card hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Complaint</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Level</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Retries</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Assigned To</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {escalations.map((esc) => {
                  const StatusIcon = statusConfig[esc.status].icon;
                  return (
                    <tr key={esc.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-foreground">{esc.id}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-foreground">{esc.complaintTitle}</p>
                        <p className="text-xs text-muted-foreground">{esc.complaintId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="secondary">L{esc.level}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className={cn("gap-1", statusConfig[esc.status].color)}>
                          <StatusIcon className="h-3 w-3" />
                          {esc.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <span className={esc.retryCount >= esc.maxRetries ? "text-destructive font-medium" : "text-muted-foreground"}>
                          {esc.retryCount}/{esc.maxRetries}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-foreground">{esc.assignedTo}</p>
                        <p className="text-xs text-muted-foreground">{esc.department}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Escalate">
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="De-escalate">
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          {esc.status === "failed" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Retry">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="space-y-3 lg:hidden">
          {escalations.map((esc) => {
            const StatusIcon = statusConfig[esc.status].icon;
            const config = statusConfig[esc.status];
            
            return (
              <div key={esc.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{esc.id}</span>
                      <Badge variant="secondary" className="text-xs">L{esc.level}</Badge>
                    </div>
                    <p className="text-sm text-foreground truncate">{esc.complaintTitle}</p>
                    <p className="text-xs text-muted-foreground">{esc.complaintId}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn("gap-1", config.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {esc.status}
                  </Badge>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    esc.retryCount >= esc.maxRetries ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                  )}>
                    {esc.retryCount}/{esc.maxRetries} retries
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className="text-xs">
                    <p className="text-foreground">{esc.assignedTo}</p>
                    <p className="text-muted-foreground">{esc.department}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    {esc.status === "failed" && (
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
