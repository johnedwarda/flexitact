import { Settings, Menu } from "lucide-react";
import ClimateWidget from "./ClimateWidget";
import MediaWidget from "./MediaWidget";
import { useInfotainment, TASKBAR_ITEMS } from "./InfotainmentContext";

const BottomTaskbar = () => {
  const { highlightedIndex, apps } = useInfotainment();

  const renderItem = (index: number) => {
    const item = TASKBAR_ITEMS[index];
    const isHighlighted = highlightedIndex === index;
    const appState = apps[item.id]?.state;
    const isOpened = appState === "opened";
    const isMinimized = appState === "minimized";

    return (
      <div key={item.id} className="relative flex flex-col items-center">
        {/* Top indicator - shown when highlighted AND (opened OR minimized) */}
        <div
          className={`absolute -top-2 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
            isHighlighted && (isOpened || isMinimized)
              ? "w-8 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
              : isHighlighted
              ? "w-4 bg-primary/50"
              : "w-0 bg-transparent"
          }`}
        />

        {/* The widget/button content - no ring highlight */}
        <div className="rounded-2xl">
          {item.id === "settings" && (
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
              <Settings size={20} />
            </button>
          )}
          {item.id === "climate" && <ClimateWidget />}
          {item.id === "media" && <MediaWidget />}
          {item.id === "menu" && (
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Bottom indicator - shown when minimized and highlighted */}
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
            isHighlighted && isMinimized
              ? "w-8 bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)]"
              : "w-0 bg-transparent"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-md border-t border-border z-50">
      {TASKBAR_ITEMS.map((_, i) => renderItem(i))}
    </div>
  );
};

export default BottomTaskbar;
