import { useState, useCallback } from "react";
import { SlidersHorizontal, LayoutGrid, Calendar, Video, Gamepad2, Film, MessageSquare, type LucideIcon } from "lucide-react";
import ClimateWidget from "./ClimateWidget";
import MediaWidget from "./MediaWidget";
import PhoneWidget from "./PhoneWidget";
import { useInfotainment, TASKBAR_ITEMS } from "./InfotainmentContext";

const GRID_APP_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  dashcam: { icon: Video, label: "Dashcam" },
  games: { icon: Gamepad2, label: "Games" },
  videos: { icon: Film, label: "Videos" },
  messages: { icon: MessageSquare, label: "Messages" },
};

const BottomTaskbar = () => {
  const { highlightedIndex, toggleAppById, openAppMenu, recentGridAppId } = useInfotainment();

  const iconClass = () =>
    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors outline-none focus:outline-none focus-visible:outline-none text-foreground/80 hover:text-foreground";

  const handleSwipeUp = useCallback(
    (itemId: string) => {
      toggleAppById(itemId);
    },
    [toggleAppById]
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

  const renderItem = (index: number, item: (typeof TASKBAR_ITEMS)[number]) => {
    const isHighlighted = highlightedIndex === index && item.id !== "menu";

    return (
      <div key={item.id} data-taskbar-id={item.id} className="relative flex flex-col items-center">
        <div className="rounded-2xl">
        {item.id === "settings" && (
            <button
              onClick={() => toggleAppById("settings")}
              className={iconClass()}
            >
              <SlidersHorizontal size={20} />
            </button>
          )}
          {item.id === "climate" && (
            <SwipeWrapper itemId="climate">
              <ClimateWidget />
            </SwipeWrapper>
          )}
          {item.id === "media" && (
            <SwipeWrapper itemId="media">
              <MediaWidget />
            </SwipeWrapper>
          )}
          {item.id === "phone" && (
            <PhoneWidget />
          )}
          {item.id === "calendar" && (
            <button
              onClick={() => toggleAppById("calendar")}
              className={iconClass()}
            >
              <Calendar size={20} />
            </button>
          )}
          {item.id === "recent" && (() => {
            if (!recentGridAppId) return <div className="w-0 h-10" />;
            const entry = GRID_APP_ICONS[recentGridAppId];
            if (!entry) return <div className="w-0 h-10" />;
            const RecentIcon = entry.icon;
            return (
              <button
                onClick={() => toggleAppById(recentGridAppId)}
                aria-label={entry.label}
                className={iconClass()}
              >
                <RecentIcon size={20} />
              </button>
            );
          })()}
          {item.id === "menu" && (
            <button
              onClick={() => openAppMenu()}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:text-foreground text-foreground/80 transition-colors outline-none focus:outline-none focus-visible:outline-none"
            >
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

  // The recent-app slot only appears after a grid app has been opened.
  const visibleItems = TASKBAR_ITEMS
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => !(item.id === "recent" && !recentGridAppId));

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-md border-t border-border z-50">
      {visibleItems.map(({ item, originalIndex }) => renderItem(originalIndex, item))}
    </div>
  );
};

export default BottomTaskbar;
