import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/ui/LiveIndicator";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type?: "default" | "hotspot" | "department";
  severity?: "critical" | "high" | "medium" | "low";
  label?: string;
  count?: number;
  slaCompliance?: number;
}

interface MapContainerProps {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  viewMode?: "heatmap" | "hotspots" | "coverage";
  showControls?: boolean;
  showLiveIndicator?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

const severityColors = {
  critical: "bg-destructive",
  high: "bg-warning",
  medium: "bg-primary",
  low: "bg-muted-foreground",
};

export function MapContainer({
  markers = [],
  center = { lat: 39.8283, lng: -98.5795 }, // US center
  zoom = 4,
  viewMode = "heatmap",
  showControls = true,
  showLiveIndicator = true,
  onMarkerClick,
  className,
}: MapContainerProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Simulate pulse animation for hotspots
  useEffect(() => {
    if (viewMode === "hotspots") {
      const interval = setInterval(() => {
        setPulsePhase((prev) => (prev + 1) % 3);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [viewMode]);

  // Convert lat/lng to percentage position (simplified for demo)
  const getMarkerPosition = (lat: number, lng: number) => {
    // Simplified US-centric projection
    const x = ((lng + 125) / 60) * 100;
    const y = ((50 - lat) / 25) * 100;
    return { x: Math.min(95, Math.max(5, x)), y: Math.min(95, Math.max(5, y)) };
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card", className)}>
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Geographic Overview</h3>
          {showLiveIndicator && <LiveIndicator size="sm" />}
        </div>
        
        <div className="flex items-center gap-1 rounded-lg bg-card/80 backdrop-blur-sm border border-border p-1">
          <Button
            variant={viewMode === "heatmap" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
          >
            Heatmap
          </Button>
          <Button
            variant={viewMode === "hotspots" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
          >
            Hotspots
          </Button>
          <Button
            variant={viewMode === "coverage" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
          >
            Coverage
          </Button>
        </div>
      </div>

      {/* Map Placeholder - Simulated Map */}
      <div className="relative h-[400px] bg-gradient-to-br from-secondary/30 via-background to-secondary/20">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Simplified US Map outline */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg viewBox="0 0 959 593" className="h-4/5 w-4/5 text-muted-foreground">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M158,100 L200,80 L300,60 L400,55 L500,60 L600,80 L700,100 L800,130 L850,180 L870,250 L860,320 L840,380 L800,420 L750,450 L680,470 L600,480 L500,485 L400,480 L300,460 L200,420 L150,360 L120,280 L130,200 L158,100"
            />
          </svg>
        </div>

        {/* Markers */}
        {markers.map((marker) => {
          const pos = getMarkerPosition(marker.lat, marker.lng);
          const isHotspot = marker.type === "hotspot" || (marker.severity && ["critical", "high"].includes(marker.severity));
          
          return (
            <div
              key={marker.id}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => {
                setActiveMarker(marker.id);
                onMarkerClick?.(marker);
              }}
            >
              {/* Pulse ring for hotspots */}
              {viewMode === "hotspots" && isHotspot && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-full opacity-60",
                    severityColors[marker.severity || "high"],
                    "marker-pulse"
                  )}
                  style={{
                    width: (marker.count || 10) * 2,
                    height: (marker.count || 10) * 2,
                    marginLeft: -((marker.count || 10)),
                    marginTop: -((marker.count || 10)),
                  }}
                />
              )}

              {/* Marker dot */}
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full border-2 border-background shadow-lg transition-all",
                  severityColors[marker.severity || "medium"],
                  viewMode === "hotspots" && isHotspot && "hotspot-glow",
                  activeMarker === marker.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  "h-6 w-6 group-hover:scale-125"
                )}
              >
                {marker.count && marker.count > 1 && (
                  <span className="text-[10px] font-bold text-white">
                    {marker.count > 99 ? "99+" : marker.count}
                  </span>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl text-xs whitespace-nowrap">
                  {marker.label && <p className="font-medium text-foreground">{marker.label}</p>}
                  {marker.count && (
                    <p className="text-muted-foreground">{marker.count} complaints</p>
                  )}
                  {marker.slaCompliance !== undefined && (
                    <p className={cn(
                      "font-medium",
                      marker.slaCompliance >= 90 ? "text-success" :
                      marker.slaCompliance >= 80 ? "text-warning" :
                      "text-destructive"
                    )}>
                      {marker.slaCompliance}% SLA
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Heatmap overlay (simulated) */}
        {viewMode === "heatmap" && (
          <div className="absolute inset-0 pointer-events-none">
            {markers.map((marker) => {
              const pos = getMarkerPosition(marker.lat, marker.lng);
              const intensity = (marker.count || 10) / 60;
              
              return (
                <div
                  key={`heat-${marker.id}`}
                  className={cn(
                    "absolute rounded-full blur-xl",
                    marker.severity === "critical" ? "bg-destructive" :
                    marker.severity === "high" ? "bg-warning" :
                    "bg-primary"
                  )}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: `${Math.max(60, (marker.count || 20) * 3)}px`,
                    height: `${Math.max(60, (marker.count || 20) * 3)}px`,
                    opacity: Math.min(0.5, intensity + 0.2),
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Coverage overlay (simulated regions) */}
        {viewMode === "coverage" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[30%] h-[40%] border-2 border-primary/30 bg-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium text-primary">West</p>
                <p className="text-lg font-bold text-foreground">78%</p>
              </div>
            </div>
            <div className="absolute top-[15%] left-[35%] w-[30%] h-[35%] border-2 border-success/30 bg-success/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium text-success">Midwest</p>
                <p className="text-lg font-bold text-foreground">92%</p>
              </div>
            </div>
            <div className="absolute top-[10%] right-[5%] w-[25%] h-[40%] border-2 border-warning/30 bg-warning/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium text-warning">Northeast</p>
                <p className="text-lg font-bold text-foreground">85%</p>
              </div>
            </div>
            <div className="absolute bottom-[15%] left-[30%] w-[40%] h-[35%] border-2 border-success/30 bg-success/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium text-success">South</p>
                <p className="text-lg font-bold text-foreground">95%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1 rounded-lg bg-card/80 backdrop-blur-sm border border-border p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-card/80 backdrop-blur-sm border border-border p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Severity</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
