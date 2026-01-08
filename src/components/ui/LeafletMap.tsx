import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { Layers } from "lucide-react";

// Fix default marker icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  severity?: "critical" | "high" | "medium" | "low";
  label?: string;
  count?: number;
  slaCompliance?: number;
}

interface LeafletMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  viewMode?: "heatmap" | "hotspots" | "coverage";
  showControls?: boolean;
  showLiveIndicator?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#00d2a9",
  low: "#6b7280",
};

export function LeafletMap({
  markers = [],
  center = [28.6139, 77.2090], // Default to Delhi, India
  zoom = 5,
  viewMode = "hotspots",
  showLiveIndicator = true,
  onMarkerClick,
  className,
}: LeafletMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(mapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when data or view mode changes
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const color = severityColors[marker.severity || "medium"];
      const size = currentViewMode === "heatmap" 
        ? Math.max(20, (marker.count || 10) * 1.5) 
        : 24;

      // Create custom div icon
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div class="relative flex items-center justify-center">
            ${currentViewMode === "hotspots" && (marker.severity === "critical" || marker.severity === "high") ? `
              <div class="absolute animate-ping rounded-full opacity-50" 
                   style="background: ${color}; width: ${size + 16}px; height: ${size + 16}px;"></div>
            ` : ""}
            <div class="relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110"
                 style="background: ${color}; width: ${size}px; height: ${size}px;">
              ${marker.count && marker.count > 1 ? `
                <span class="text-[10px] font-bold text-white">${marker.count > 99 ? "99+" : marker.count}</span>
              ` : ""}
            </div>
          </div>
        `,
        iconSize: [size + 20, size + 20],
        iconAnchor: [(size + 20) / 2, (size + 20) / 2],
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .addTo(markersLayerRef.current!);

      // Popup content
      const popupContent = `
        <div class="p-2 min-w-[150px]">
          <p class="font-semibold text-sm">${marker.label || "Location"}</p>
          ${marker.count ? `<p class="text-xs text-gray-400">${marker.count} complaints</p>` : ""}
          ${marker.slaCompliance !== undefined ? `
            <p class="text-xs font-medium" style="color: ${marker.slaCompliance >= 90 ? "#22c55e" : marker.slaCompliance >= 80 ? "#f59e0b" : "#ef4444"}">
              ${marker.slaCompliance}% SLA Compliance
            </p>
          ` : ""}
          <p class="text-xs capitalize mt-1" style="color: ${color}">
            ${marker.severity || "medium"} severity
          </p>
        </div>
      `;

      leafletMarker.bindPopup(popupContent, {
        className: "dark-popup",
      });

      leafletMarker.on("click", () => {
        onMarkerClick?.(marker);
      });
    });

    // Add heatmap-like circles for heatmap view
    if (currentViewMode === "heatmap") {
      markers.forEach((marker) => {
        const color = severityColors[marker.severity || "medium"];
        const radius = Math.max(15000, (marker.count || 10) * 3000);

        L.circle([marker.lat, marker.lng], {
          radius: radius,
          color: "transparent",
          fillColor: color,
          fillOpacity: 0.3,
        }).addTo(markersLayerRef.current!);
      });
    }

    // Add coverage regions for coverage view
    if (currentViewMode === "coverage") {
      const regions = [
        { name: "North Region", bounds: [[28.5, 76.5], [29.5, 78]] as L.LatLngBoundsExpression, compliance: 92, color: "#22c55e" },
        { name: "South Region", bounds: [[12.5, 76.5], [14, 78.5]] as L.LatLngBoundsExpression, compliance: 78, color: "#f59e0b" },
        { name: "East Region", bounds: [[22, 87], [23.5, 89]] as L.LatLngBoundsExpression, compliance: 85, color: "#00d2a9" },
        { name: "West Region", bounds: [[18.5, 72], [20, 74]] as L.LatLngBoundsExpression, compliance: 95, color: "#22c55e" },
      ];

      regions.forEach((region) => {
        L.rectangle(region.bounds, {
          color: region.color,
          weight: 2,
          fillColor: region.color,
          fillOpacity: 0.15,
        }).addTo(markersLayerRef.current!).bindPopup(`
          <div class="p-2">
            <p class="font-semibold">${region.name}</p>
            <p class="text-sm" style="color: ${region.color}">${region.compliance}% SLA Compliance</p>
          </div>
        `);
      });
    }
  }, [markers, currentViewMode, onMarkerClick]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card", className)}>
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between p-4 bg-gradient-to-b from-background/95 to-transparent">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Geographic Overview</h3>
          {showLiveIndicator && <LiveIndicator size="sm" />}
        </div>
        
        <div className="flex items-center gap-1 rounded-lg bg-card/90 backdrop-blur-sm border border-border p-1">
          <Button
            variant={currentViewMode === "heatmap" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setCurrentViewMode("heatmap")}
          >
            Heatmap
          </Button>
          <Button
            variant={currentViewMode === "hotspots" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setCurrentViewMode("hotspots")}
          >
            Hotspots
          </Button>
          <Button
            variant={currentViewMode === "coverage" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setCurrentViewMode("coverage")}
          >
            Coverage
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full" style={{ minHeight: "400px" }} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-card/90 backdrop-blur-sm border border-border p-3">
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

      {/* Layer toggle */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <Button variant="secondary" size="icon" className="h-9 w-9 bg-card/90 backdrop-blur-sm">
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Custom styles for dark popups */}
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: hsl(222 47% 8%);
          color: #e2e8f0;
          border: 1px solid hsl(215 20% 20%);
          border-radius: 8px;
        }
        .dark-popup .leaflet-popup-tip {
          background: hsl(222 47% 8%);
          border: 1px solid hsl(215 20% 20%);
        }
        .leaflet-control-zoom a {
          background: hsl(222 47% 8%) !important;
          color: #e2e8f0 !important;
          border-color: hsl(215 20% 20%) !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(215 20% 15%) !important;
        }
        .leaflet-control-attribution {
          background: hsl(222 47% 8% / 0.8) !important;
          color: #6b7280 !important;
        }
        .leaflet-control-attribution a {
          color: #00d2a9 !important;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
