import { useState, useCallback, useRef, useEffect } from "react";
import { Settings, LayoutGrid, Phone } from "lucide-react";
import ClimateWidget from "./ClimateWidget";
import MediaWidget from "./MediaWidget";
import PhonePopup from "./PhonePopup";
import { useInfotainment, TASKBAR_ITEMS } from "./InfotainmentContext";

const BottomTaskbar = () => {
  const { highlightedIndex, apps, openAppById, navigateToItem, phonePopupOpen, phoneIndex } = useInfotainment();
  const phoneRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);

  // Determine which index should show the bright line (exclude menu)
  const activeIndicatorIndex = TASKBAR_ITEMS[highlightedIndex]?.id === "menu" ? -1 : highlightedIndex;

  useEffect(() => {
    if (activeIndicatorIndex < 0 || !containerRef.current) {
      setIndicatorStyle(null);
      return;
    }
    const el = itemRefs.current[activeIndicatorIndex];
    if (!el || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - containerRect.left + elRect.width / 2 - 16,
      width: 32,
    });
  }, [activeIndicatorIndex]);

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

  const [phoneHover, setPhoneHover] = useState(false);

  const renderItem = (index: number) => {
    const item = TASKBAR_ITEMS[index];
    const isHighlighted = highlightedIndex === index && item.id !== "menu";

    return (
      <div key={item.id} ref={(el) => { itemRefs.current[index] = el; }} className="relative flex flex-col items-center">
        <div className="rounded-2xl">
          {item.id === "settings" && (
            <button
              onClick={() => {
                navigateToItem(index);
                openAppById("settings");
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:text-foreground text-muted-foreground transition-colors outline-none focus:outline-none focus-visible:outline-none"
            >
              <Settings size={20} />
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
            <div
              className="relative"
              onMouseEnter={() => {
                setPhoneHover(true);
                navigateToItem(index);
              }}
              onMouseLeave={() => setPhoneHover(false)}
            >
              <button
                ref={phoneRef}
                onClick={() => navigateToItem(index)}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:text-foreground text-muted-foreground transition-colors outline-none focus:outline-none focus-visible:outline-none"
              >
                <Phone size={20} />
              </button>
              {(phoneHover || phonePopupOpen) && phoneRef.current && (
                <PhonePopup
                  phoneIndex={phoneIndex}
                  anchorX={phoneRef.current.getBoundingClientRect().left + phoneRef.current.getBoundingClientRect().width / 2}
                  anchorTop={phoneRef.current.getBoundingClientRect().top}
                />
              )}
            </div>
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

      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-md border-t border-border z-50">
      {TASKBAR_ITEMS.map((_, i) => renderItem(i))}
      {/* Sliding bright line indicator */}
      <div
        className={`absolute bottom-1 h-[3px] rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)] transition-all duration-500 ease-in-out ${
          indicatorStyle ? "opacity-100" : "opacity-0"
        }`}
        style={indicatorStyle ? { left: indicatorStyle.left, width: indicatorStyle.width } : { left: 0, width: 0 }}
      />
    </div>
  );
};

export default BottomTaskbar;
