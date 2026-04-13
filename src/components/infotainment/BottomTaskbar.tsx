import { Settings, LayoutGrid } from "lucide-react";
import ClimateWidget from "./ClimateWidget";
import MediaWidget from "./MediaWidget";
import { useInfotainment, TASKBAR_ITEMS } from "./InfotainmentContext";

const BottomTaskbar = () => {
  const { highlightedIndex } = useInfotainment();

  const renderItem = (index: number) => {
    const item = TASKBAR_ITEMS[index];
    const isHighlighted = highlightedIndex === index && item.id !== "menu";

    return (
      <div key={item.id} className="relative flex flex-col items-center">
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
              <LayoutGrid size={20} />
            </button>
          )}
        </div>

        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
            isHighlighted
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
