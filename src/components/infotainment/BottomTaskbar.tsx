import { useState, useCallback } from "react";
import { SlidersHorizontal, LayoutGrid, Calendar } from "lucide-react";
import ClimateWidget from "./ClimateWidget";
import MediaWidget from "./MediaWidget";
import PhoneWidget from "./PhoneWidget";
import { useInfotainment, TASKBAR_ITEMS } from "./InfotainmentContext";

const BottomTaskbar = () => {
  const { highlightedIndex, openAppById, navigateToItem } = useInfotainment();

  const handleSwipeUp = useCallback(
    (itemId: string) => {
      openAppById(itemId);
    },
    [openAppById]
  );

  const SwipeWrapper = ({ itemId, children }: { itemId: string; children: React.ReactNode }) => {
    const [touchStart, setTouchStart] = useState<number | null>(null);

    return (
      <div
        onTouchStart={(e) => setTouchStart(e.touches[0].clientY)}
        onTouchEnd={(e) => {
          if (touchStart !== null) {
            const diff = touchStart - e.changedTouches[0].clientY;
            if (diff > 40) handleSwipeUp(itemId);
            setTouchStart(null);
          }
        }}
      >
        {children}
      </div>
    );
  };

  const renderItem = (index: number) => {
    const item = TASKBAR_ITEMS[index];
    const isHighlighted = highlightedIndex === index && item.id !== "menu";

    return (
      <div key={item.id} data-taskbar-id={item.id} className="relative flex flex-col items-center">
        <div className="rounded-2xl">
          {item.id === "settings" && (
            <button
              onClick={() => {
                navigateToItem(index);
                openAppById("settings");
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:text-foreground text-muted-foreground transition-colors outline-none focus:outline-none focus-visible:outline-none"
            >
              <SlidersHorizontal size={20} />
            </button>
          )}
          {item.id === "climate" && (
            <SwipeWrapper itemId="climate">
              <div onClick={() => navigateToItem(index)} className="cursor-pointer">
                <ClimateWidget />
              </div>
            </SwipeWrapper>
          )}
          {item.id === "media" && (
            <SwipeWrapper itemId="media">
              <div onClick={() => navigateToItem(index)} className="cursor-pointer">
                <MediaWidget />
              </div>
            </SwipeWrapper>
          )}
          {item.id === "phone" && (
            <div onClick={() => navigateToItem(index)} className="cursor-pointer">
              <PhoneWidget />
            </div>
          )}
          {item.id === "calendar" && (
            <button
              onClick={() => {
                navigateToItem(index);
                openAppById("calendar");
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:text-foreground text-muted-foreground transition-colors outline-none focus:outline-none focus-visible:outline-none"
            >
              <Calendar size={20} />
            </button>
          )}
          {item.id === "menu" && (
            <button
              onClick={() => navigateToItem(index)}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:text-foreground text-muted-foreground transition-colors outline-none focus:outline-none focus-visible:outline-none"
            >
              <LayoutGrid size={20} />
            </button>
          )}
        </div>

        {item.type === "widget" ? (
          <div
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 transition-all duration-300 ${
              isHighlighted
                ? "w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-accent drop-shadow-[0_0_6px_hsl(var(--accent)/0.7)]"
                : "opacity-0 scale-0"
            }`}
          />
        ) : (
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
              isHighlighted
                ? "w-8 bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)]"
                : "w-0 bg-transparent"
            }`}
          />
        )}
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
