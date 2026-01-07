import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { escalations } from "@/data/mockData";
import { RefreshCw, ArrowUp, ArrowDown, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const statusConfig = {
  pending: { color: "border-warning text-warning", icon: AlertTriangle },
  active: { color: "border-primary text-primary", icon: RefreshCw },
  resolved: { color: "border-success text-success", icon: CheckCircle },
  failed: { color: "border-destructive text-destructive", icon: XCircle },
};

export default function Escalations() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Escalation Management</h2>
            <p className="text-muted-foreground">Monitor and manage active escalations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Bulk De-escalate</Button>
            <Button size="sm">Retry All Failed</Button>
          </div>
        </div>
        <div className="glass-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Complaint</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Level</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Retries</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {escalations.map((esc) => {
                const StatusIcon = statusConfig[esc.status].icon;
                return (
                  <tr key={esc.id} className="hover:bg-secondary/50">
                    <td className="px-5 py-4 font-medium text-foreground">{esc.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-foreground">{esc.complaintTitle}</p>
                      <p className="text-xs text-muted-foreground">{esc.complaintId}</p>
                    </td>
                    <td className="px-5 py-4"><Badge variant="secondary">L{esc.level}</Badge></td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={statusConfig[esc.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />{esc.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4"><span className={esc.retryCount >= esc.maxRetries ? "text-destructive" : "text-muted-foreground"}>{esc.retryCount}/{esc.maxRetries}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowUp className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowDown className="h-4 w-4" /></Button>
                        {esc.status === "failed" && <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="h-4 w-4" /></Button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
