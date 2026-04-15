import {
  Map,
  Phone,
  Camera,
  Calendar,
  MessageSquare,
  Bluetooth,
  Wifi,
  Car,
  Info,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useInfotainment } from "./InfotainmentContext";

export const APP_MENU_ITEMS = [
  { id: "navigation", label: "Navigation", icon: Map },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "bluetooth", label: "Bluetooth", icon: Bluetooth },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "vehicle", label: "Vehicle", icon: Car },
  { id: "about", label: "About", icon: Info },
];

const AppMenuPopup = ({ anchorX }: { anchorX?: number }) => {
  const { appMenuIndex } = useInfotainment();

  if (typeof document === "undefined") {
    return null;
  }

  const POPUP_WIDTH = 228;
  const PADDING = 16;
  const viewportWidth = window.innerWidth;
  const halfWidth = POPUP_WIDTH / 2;
  const x = anchorX ?? viewportWidth - 40;
  const clampedLeft = Math.max(halfWidth + PADDING, Math.min(viewportWidth - halfWidth - PADDING, x));

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999] flex flex-col items-center"
      style={{
        left: clampedLeft,
        bottom: "4.5rem",
        transform: "translateX(-50%)",
      }}
    >
      <div className="pointer-events-auto rounded-2xl border border-border/50 bg-card/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-2">
          {APP_MENU_ITEMS.map((app, i) => {
            const isActive = appMenuIndex === i;
            return (
              <div key={app.id} className="relative flex flex-col items-center">
                <button
                  className="flex w-16 flex-col items-center gap-1.5 rounded-xl p-2.5 transition-colors hover:bg-muted/30"
                >
                  <app.icon
                    size={22}
                    className={isActive ? "text-primary" : "text-muted-foreground"}
                  />
                  <span
                    className={`text-center text-[8px] font-medium leading-tight ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {app.label}
                  </span>
                </button>
                {/* Bright line indicator — same as taskbar */}
                <div
                  className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)]"
                      : "w-0 bg-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* Connector stem + caret */}
      <div className="flex flex-col items-center">
        <div className="w-px h-3 bg-border/50" />
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border/50" />
      </div>
    </div>,
    document.body,
  );
};

export default AppMenuPopup;
