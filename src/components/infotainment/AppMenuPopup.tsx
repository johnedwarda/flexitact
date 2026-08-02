import {
  Video,
  Gamepad2,
  Film,
  MessageSquare,
  Map,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useInfotainment } from "./InfotainmentContext";

export const APP_MENU_ITEMS = [
  { id: "dashcam", label: "Dashcam", icon: Video },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "videos", label: "Videos", icon: Film },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "navigation", label: "Maps", icon: Map },
];

const AppMenuPopup = () => {
  const { appMenuIndex, openAppFromMenu } = useInfotainment();

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[20rem] z-[9999] flex justify-end px-4">
      <div className="pointer-events-auto rounded-2xl border border-border/50 bg-card/95 p-3 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-2">
          {APP_MENU_ITEMS.map((app, i) => {
            const isActive = appMenuIndex === i;
            return (
              <div key={app.id} className="relative flex flex-col items-center">
                <button
                  onClick={() => openAppFromMenu(app.id)}
                  aria-label={app.label}
                  className="flex w-16 flex-col items-center gap-1.5 rounded-xl p-2.5 transition-colors hover:bg-muted/30"
                >

                  <app.icon
                    size={22}
                    className={isActive ? "text-primary" : "text-foreground/80"}
                  />
                  <span
                    className={`text-center text-[8px] font-medium leading-tight ${
                      isActive ? "text-primary" : "text-foreground/80"
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
    </div>,
    document.body,
  );
};

export default AppMenuPopup;
