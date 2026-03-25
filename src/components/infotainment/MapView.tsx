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

      <div className="absolute left-4 right-4 top-4 z-[1000]">
        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/90 px-4 py-3 backdrop-blur-md">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <span className="text-sm text-primary">↑</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Champs-Élysées</span>
            <span className="text-xs text-muted-foreground">Continue for 1.2 km</span>
          </div>
          <span className="ml-auto font-mono text-xs text-primary">1.2 km</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
