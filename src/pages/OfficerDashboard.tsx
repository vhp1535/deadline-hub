import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth, DEMO_ACCOUNTS } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/ui/KPICard";
import { SLAProgress } from "@/components/ui/SLAProgress";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { Complaint } from "@/data/mockData";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  User,
  Filter,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  "open": { label: "Open", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  "in-progress": { label: "In Progress", color: "bg-warning/20 text-warning border-warning/30" },
  "escalated": { label: "Escalated", color: "bg-destructive/20 text-destructive border-destructive/30" },
  "resolved": { label: "Resolved", color: "bg-success/20 text-success border-success/30" },
  "failed": { label: "Failed", color: "bg-destructive/20 text-destructive border-destructive/30" },
};

const SEVERITY_COLORS = {
  critical: "text-destructive",
  high: "text-warning",
  medium: "text-success",
  low: "text-muted-foreground",
};

export default function OfficerDashboard() {
  const { user, switchRole } = useAuth();
  const { complaints } = useComplaints();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter to assigned complaints for this officer
  const assignedIds = user?.assignedComplaints || ["CMP-001", "CMP-003", "CMP-005"];
  const assignedComplaints = complaints.filter(c => assignedIds.includes(c.id));

  const filteredComplaints = statusFilter === "all" 
    ? assignedComplaints 
    : assignedComplaints.filter(c => c.status === statusFilter);

  const stats = {
    total: assignedComplaints.length,
    open: assignedComplaints.filter(c => c.status === "open").length,
    inProgress: assignedComplaints.filter(c => c.status === "in-progress").length,
    escalated: assignedComplaints.filter(c => c.status === "escalated").length,
    resolved: assignedComplaints.filter(c => c.status === "resolved").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Demo Mode Banner */}
        <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{user?.name || "Officer Demo"}</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  Demo Mode
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Officer Dashboard - Assigned Complaints</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.filter(a => a.role !== "officer").map((account) => (
              <Button
                key={account.role}
                variant="outline"
                size="sm"
                onClick={() => switchRole(account.role)}
                className="text-xs"
              >
                Switch to {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Assigned Cases"
            value={stats.total}
            icon={FileText}
          />
          <KPICard
            title="Open"
            value={stats.open}
            icon={Clock}
            variant="warning"
          />
          <KPICard
            title="In Progress"
            value={stats.inProgress}
            icon={RefreshCw}
          />
          <KPICard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Complaints Table */}
        <div className="glass-card">
          <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">My Assigned Complaints</h2>
              <LiveIndicator isLive size="sm" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {["all", "open", "in-progress", "escalated", "resolved"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="flex-shrink-0"
                >
                  {status === "all" ? "All" : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}
                </Button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No complaints found</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <div className="p-4 sm:p-6 hover:bg-secondary/20 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-sm text-primary">{complaint.id}</span>
            <Badge className={cn("text-xs", STATUS_CONFIG[complaint.status].color)}>
              {STATUS_CONFIG[complaint.status].label}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", SEVERITY_COLORS[complaint.severity])}>
              {complaint.severity}
            </Badge>
          </div>
          <h3 className="font-medium mb-1 truncate">{complaint.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{complaint.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>{complaint.category}</span>
            <span>•</span>
            <span>{complaint.location.region}</span>
            <span>•</span>
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SLAProgress 
            progress={complaint.slaProgress} 
            remaining={complaint.slaRemaining}
            size="sm"
          />
          <Link to={`/track?id=${complaint.id}`}>
            <Button variant="ghost" size="sm">
              View
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
