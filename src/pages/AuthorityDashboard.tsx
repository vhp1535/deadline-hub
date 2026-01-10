import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "@/components/auth/ProfileHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/ui/KPICard";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { LeafletMap } from "@/components/ui/LeafletMap";
import { escalations, mapHotspots } from "@/data/mockData";
import { 
  AlertTriangle, 
  TrendingUp, 
  MapPin,
  Clock,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const ESCALATION_STATUS = {
  pending: { label: "Pending", color: "bg-warning/20 text-warning border-warning/30" },
  active: { label: "Active", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  resolved: { label: "Resolved", color: "bg-success/20 text-success border-success/30" },
  failed: { label: "Failed", color: "bg-destructive/20 text-destructive border-destructive/30" },
};

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  // Filter escalations for authority view
  const activeEscalations = escalations.filter(e => e.status === "active" || e.status === "pending");

  const stats = {
    totalEscalations: escalations.length,
    active: escalations.filter(e => e.status === "active").length,
    pending: escalations.filter(e => e.status === "pending").length,
    failed: escalations.filter(e => e.status === "failed").length,
  };

  // Convert hotspots to map markers
  const hotspotMarkers = mapHotspots.map(h => ({
    id: h.id,
    lat: h.lat,
    lng: h.lng,
    label: `${h.region}: ${h.complaintCount} complaints`,
    severity: h.severity,
    count: h.complaintCount,
    slaCompliance: h.slaCompliance,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader 
          title="Authority Dashboard" 
          subtitle="Escalations & Hotspots" 
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Escalations"
            value={stats.totalEscalations}
            icon={AlertTriangle}
            variant="warning"
          />
          <KPICard
            title="Active"
            value={stats.active}
            icon={RefreshCw}
            isLive
          />
          <KPICard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
          />
          <KPICard
            title="Failed"
            value={stats.failed}
            icon={XCircle}
            variant="destructive"
          />
        </div>

        {/* Map & Escalations Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Hotspot Map */}
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Escalation Hotspots
              </h2>
              <LiveIndicator isLive size="sm" />
            </div>
            <div className="h-[300px] sm:h-[400px] rounded-xl overflow-hidden border border-border">
              <LeafletMap
                markers={hotspotMarkers}
                center={[22.5, 82.5]}
                zoom={5}
                viewMode="heatmap"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mapHotspots.slice(0, 4).map((hotspot) => (
                <div
                  key={hotspot.id}
                  className={cn(
                    "p-3 rounded-lg border border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors",
                    selectedHotspot === hotspot.id && "border-primary bg-primary/10"
                  )}
                  onClick={() => setSelectedHotspot(hotspot.id)}
                >
                  <p className="font-medium text-sm truncate">{hotspot.region}</p>
                  <p className="text-xs text-muted-foreground">{hotspot.complaintCount} complaints</p>
                  <div className={cn(
                    "text-xs mt-1",
                    hotspot.slaCompliance >= 90 ? "text-success" :
                    hotspot.slaCompliance >= 80 ? "text-warning" : "text-destructive"
                  )}>
                    {hotspot.slaCompliance}% SLA
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escalations Queue */}
          <div className="glass-card">
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Escalation Queue
              </h2>
              <Badge variant="outline" className="bg-warning/10 text-warning">
                {activeEscalations.length} Active
              </Badge>
            </div>
            <div className="divide-y divide-border max-h-[500px] overflow-y-auto scrollbar-thin">
              {activeEscalations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No active escalations</p>
                </div>
              ) : (
                activeEscalations.map((escalation) => (
                  <div key={escalation.id} className="p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-primary">{escalation.complaintId}</span>
                          <Badge className={cn("text-xs", ESCALATION_STATUS[escalation.status].color)}>
                            Level {escalation.level}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm truncate">{escalation.complaintTitle}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{escalation.department}</span>
                          <span>•</span>
                          <span>{escalation.assignedTo}</span>
                        </div>
                        {escalation.retryCount > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-warning">
                            <RefreshCw className="w-3 h-3" />
                            Retry {escalation.retryCount}/{escalation.maxRetries}
                          </div>
                        )}
                      </div>
                      <Link to={`/track?id=${escalation.complaintId}`}>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Regional Summary */}
        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Regional Performance Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mapHotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="p-4 rounded-xl border border-border bg-secondary/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{hotspot.region}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      hotspot.severity === "critical" ? "text-destructive" :
                      hotspot.severity === "high" ? "text-warning" :
                      hotspot.severity === "medium" ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {hotspot.severity}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Complaints</span>
                    <span>{hotspot.complaintCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SLA Compliance</span>
                    <span className={cn(
                      hotspot.slaCompliance >= 90 ? "text-success" :
                      hotspot.slaCompliance >= 80 ? "text-warning" : "text-destructive"
                    )}>
                      {hotspot.slaCompliance}%
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      hotspot.slaCompliance >= 90 ? "bg-success" :
                      hotspot.slaCompliance >= 80 ? "bg-warning" : "bg-destructive"
                    )}
                    style={{ width: `${hotspot.slaCompliance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
