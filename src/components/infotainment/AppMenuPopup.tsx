import {
  Map,
  Music,
  Thermometer,
  Settings,
  Phone,
  Camera,
  Calendar,
  MessageSquare,
  Bluetooth,
  Wifi,
  Car,
  Battery,
  Gauge,
  ParkingCircle,
  Shield,
  Info,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

export const APP_MENU_ITEMS = [
  { id: "navigation", label: "Navigation", icon: Map },
  { id: "media", label: "Media", icon: Music },
  { id: "climate", label: "Climate", icon: Thermometer },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "bluetooth", label: "Bluetooth", icon: Bluetooth },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "vehicle", label: "Vehicle", icon: Car },
  { id: "charging", label: "Charging", icon: Battery },
  { id: "performance", label: "Performance", icon: Gauge },
  { id: "parking", label: "Parking", icon: ParkingCircle },
  { id: "security", label: "Security", icon: Shield },
  { id: "about", label: "About", icon: Info },
];

const AppMenuPopup = () => {
  const { appMenuIndex } = useInfotainment();

  return (
    <div className="fixed bottom-[60px] right-4 z-[100]">
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-4 gap-2">
          {APP_MENU_ITEMS.map((app, i) => (
            <button
              key={app.id}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-150 ${
                appMenuIndex === i
                  ? "bg-primary/15 border border-primary/40 shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
                  : "border border-transparent hover:bg-muted/30"
              }`}
              style={{ width: 64 }}
            >
              <app.icon
                size={22}
                className={appMenuIndex === i ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-[8px] font-medium leading-tight text-center ${
                  appMenuIndex === i ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppMenuPopup;
