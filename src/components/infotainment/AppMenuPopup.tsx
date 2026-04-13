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
import { createPortal } from "react-dom";
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

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[20rem] z-[9999] flex justify-end px-4">
      <div className="pointer-events-auto w-[19rem] rounded-2xl border border-border/50 bg-card/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-2">
          {APP_MENU_ITEMS.map((app, i) => (
            <button
              key={app.id}
              className={`flex w-full flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all duration-150 ${
                appMenuIndex === i
                  ? "border-primary/40 bg-primary/15 shadow-md"
                  : "border-transparent hover:bg-muted/30"
              }`}
            >
              <app.icon
                size={22}
                className={appMenuIndex === i ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-center text-[8px] font-medium leading-tight ${
                  appMenuIndex === i ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AppMenuPopup;
