import {
  Map,
  Gamepad2,
  Video,
  Camera,
  MessageSquare,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

const APP_MENU_ITEMS = [
  { id: "navigation", label: "Maps", icon: Map },
  { id: "dashcam", label: "Dashcam", icon: Camera },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "videos", label: "Videos", icon: Video },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

export { APP_MENU_ITEMS };

const AppMenuOverlay = () => {
  const { appMenuIndex, openAppFromMenu } = useInfotainment();

  return (
    <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center p-8">
      <h2 className="text-base font-mono uppercase tracking-widest text-muted-foreground mb-6">
        App Menu
      </h2>
      <div className="grid grid-cols-3 gap-4 max-w-md">
        {APP_MENU_ITEMS.map((app, i) => (
          <button
            key={app.id}
            onClick={() => openAppFromMenu(app.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
              appMenuIndex === i
                ? "bg-primary/15 border-primary/50 shadow-[0_0_16px_hsl(var(--primary)/0.2)]"
                : "bg-muted/20 border-border/30 hover:bg-muted/40"
            }`}
          >
            <app.icon
              size={28}
              className={appMenuIndex === i ? "text-primary" : "text-muted-foreground"}
            />
            <span
              className={`text-[10px] font-mono uppercase tracking-wider ${
                appMenuIndex === i ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {app.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60 font-mono mt-6">
        Dial: Navigate • Center: Open • Down: Close Menu
      </p>
    </div>
  );
};

export default AppMenuOverlay;
