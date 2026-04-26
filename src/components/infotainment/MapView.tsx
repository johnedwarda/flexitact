import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const mapCenter: L.LatLngExpression = [48.8566, 2.3522];

const MapView = () => {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: mapCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    const marker = L.circleMarker(mapCenter, {
      radius: 8,
      color: "hsl(205 100% 55%)",
      weight: 2,
      fillColor: "hsl(205 100% 55%)",
      fillOpacity: 0.95,
    }).addTo(map);

    marker.bindPopup("Current Location");
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={mapElementRef} className="h-full w-full" aria-label="Navigation map" />

      <div className="absolute left-4 top-4 z-[1000]">
        <div className="flex w-[280px] flex-col gap-3 rounded-2xl border border-border/50 bg-card/90 px-4 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <span className="text-base text-primary">↑</span>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">Champs-Élysées</span>
              <span className="text-xs text-muted-foreground">Continue for 1.2 km</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">2.1 km total</span>
              <span className="font-mono text-primary">1.2 km</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: "65%" }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>ETA 14:32</span>
              <span>3 min left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
