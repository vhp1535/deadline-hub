import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LeafletMap, MapMarker } from "@/components/ui/LeafletMap";
import { FilterPanel, FilterGroup } from "@/components/ui/FilterPanel";
import { mapHotspots } from "@/data/mockData";
import { cn } from "@/lib/utils";

const filterGroups: FilterGroup[] = [
  { 
    id: "severity", 
    label: "Severity", 
    options: [
      { id: "critical", label: "Critical", value: "critical" },
      { id: "high", label: "High", value: "high" },
      { id: "medium", label: "Medium", value: "medium" },
      { id: "low", label: "Low", value: "low" },
    ]
  },
  { 
    id: "time", 
    label: "Time Range", 
    multiSelect: false, 
    options: [
      { id: "24h", label: "Last 24h", value: "24h" },
      { id: "7d", label: "Last 7 days", value: "7d" },
      { id: "30d", label: "Last 30 days", value: "30d" },
    ]
  },
  { 
    id: "category", 
    label: "Category", 
    options: [
      { id: "infrastructure", label: "Infrastructure", value: "infrastructure" },
      { id: "utilities", label: "Utilities", value: "utilities" },
      { id: "sanitation", label: "Sanitation", value: "sanitation" },
      { id: "traffic", label: "Traffic", value: "traffic" },
    ]
  },
];

export default function Maps() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  
  // Transform mock data to map markers
  const markers: MapMarker[] = mapHotspots.map(h => ({
    id: h.id,
    lat: h.lat,
    lng: h.lng,
    severity: h.severity,
    count: h.complaintCount,
    label: h.region,
    slaCompliance: h.slaCompliance,
  }));

  // Filter markers based on selected filters
  const filteredMarkers = markers.filter(marker => {
    if (filters.severity?.length && !filters.severity.includes(marker.severity || "")) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [groupId]: values }));
  };

  // Calculate stats
  const totalComplaints = markers.reduce((acc, m) => acc + (m.count || 0), 0);
  const criticalZones = markers.filter(m => m.severity === "critical").length;
  const avgCompliance = Math.round(markers.reduce((acc, m) => acc + (m.slaCompliance || 0), 0) / markers.length);

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Hidden on mobile since TopBar shows it */}
        <div className="hidden sm:block">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Geographic Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time complaint distribution and hotspots across regions</p>
        </div>
        
        {/* Filters */}
        <FilterPanel 
          groups={filterGroups} 
          selectedFilters={filters} 
          onFilterChange={handleFilterChange} 
          onClearAll={() => setFilters({})} 
        />
        
        {/* Map */}
        <LeafletMap 
          markers={filteredMarkers} 
          viewMode="hotspots" 
          className="h-[350px] sm:h-[450px] lg:h-[550px]"
          center={[22.5937, 78.9629]}
          zoom={5}
        />

        {/* Statistics */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <div className="glass-card p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Total Hotspots</p>
            <p className="text-xl font-bold text-foreground sm:text-2xl">{markers.length}</p>
          </div>
          <div className="glass-card p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Critical Zones</p>
            <p className="text-xl font-bold text-destructive sm:text-2xl">{criticalZones}</p>
          </div>
          <div className="glass-card p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Avg SLA Compliance</p>
            <p className={cn(
              "text-xl font-bold sm:text-2xl",
              avgCompliance >= 85 ? "text-success" : avgCompliance >= 75 ? "text-warning" : "text-destructive"
            )}>{avgCompliance}%</p>
          </div>
          <div className="glass-card p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Active Complaints</p>
            <p className="text-xl font-bold text-warning sm:text-2xl">{totalComplaints}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
