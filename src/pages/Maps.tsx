import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MapContainer } from "@/components/ui/MapContainer";
import { FilterPanel, FilterGroup } from "@/components/ui/FilterPanel";
import { mapHotspots } from "@/data/mockData";

const filterGroups: FilterGroup[] = [
  { id: "severity", label: "Severity", options: [
    { id: "critical", label: "Critical", value: "critical" },
    { id: "high", label: "High", value: "high" },
    { id: "medium", label: "Medium", value: "medium" },
    { id: "low", label: "Low", value: "low" },
  ]},
  { id: "time", label: "Time Range", multiSelect: false, options: [
    { id: "24h", label: "Last 24h", value: "24h" },
    { id: "7d", label: "Last 7 days", value: "7d" },
    { id: "30d", label: "Last 30 days", value: "30d" },
  ]},
];

export default function Maps() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const markers = mapHotspots.map(h => ({
    id: h.id, lat: h.lat, lng: h.lng, severity: h.severity, count: h.complaintCount, label: h.region, slaCompliance: h.slaCompliance,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Geographic Overview</h2>
            <p className="text-muted-foreground">Complaint distribution and hotspots</p>
          </div>
        </div>
        <FilterPanel groups={filterGroups} selectedFilters={filters} onFilterChange={(g, v) => setFilters(p => ({ ...p, [g]: v }))} onClearAll={() => setFilters({})} />
        <MapContainer markers={markers} viewMode="hotspots" className="h-[600px]" />
      </div>
    </DashboardLayout>
  );
}
