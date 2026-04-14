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
import { useRef, useEffect, useState } from "react";
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

const AppMenuPopup = () => {
  const { appMenuIndex } = useInfotainment();
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; top: number; width: number } | null>(null);

  useEffect(() => {
    const el = itemRefs.current[appMenuIndex];
    const grid = gridRef.current;
    if (!el || !grid) return;
    const gridRect = grid.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - gridRect.left + elRect.width / 2 - 16,
      top: elRect.bottom - gridRect.top + 2,
      width: 32,
    });
  }, [appMenuIndex]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[20rem] z-[9999] flex justify-end px-4">
      <div className="pointer-events-auto rounded-2xl border border-border/50 bg-card/95 p-3 shadow-2xl backdrop-blur-xl">
        <div ref={gridRef} className="relative grid grid-cols-3 gap-2">
          {APP_MENU_ITEMS.map((app, i) => {
            const isActive = appMenuIndex === i;
            return (
              <div key={app.id} ref={(el) => { itemRefs.current[i] = el; }} className="relative flex flex-col items-center">
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
              </div>
            );
          })}
          {/* Sliding bright line indicator */}
          <div
            className="absolute h-[3px] rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)] transition-all duration-500 ease-in-out"
            style={indicatorStyle ? { left: indicatorStyle.left, top: indicatorStyle.top, width: indicatorStyle.width } : { left: 0, top: 0, width: 0 }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AppMenuPopup;
