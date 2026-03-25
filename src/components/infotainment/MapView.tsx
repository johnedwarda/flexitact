import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const MapView = () => {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={14}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[48.8566, 2.3522]}>
          <Popup>
            <span className="text-xs">Current Location</span>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Navigation overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-card/90 backdrop-blur-md rounded-xl px-4 py-3 border border-border/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-sm">↑</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Champs-Élysées</span>
            <span className="text-xs text-muted-foreground">Continue for 1.2 km</span>
          </div>
          <span className="ml-auto text-xs font-mono text-primary">1.2 km</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
