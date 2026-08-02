import { useEffect, useState, useRef } from "react";

import DrivingInfo from "@/components/infotainment/DrivingInfo";
import MapView from "@/components/infotainment/MapView";
import BottomTaskbar from "@/components/infotainment/BottomTaskbar";
import NavigationButtons from "@/components/infotainment/NavigationButtons";
import ClimateAppView from "@/components/infotainment/ClimateAppView";
import MediaAppView from "@/components/infotainment/MediaAppView";
import SettingsAppView from "@/components/infotainment/SettingsAppView";
import CalendarAppView from "@/components/infotainment/CalendarAppView";
import PhoneAppView from "@/components/infotainment/PhoneAppView";
import DashcamAppView from "@/components/infotainment/DashcamAppView";
import GamesAppView from "@/components/infotainment/GamesAppView";
import VideosAppView from "@/components/infotainment/VideosAppView";
import MessagesAppView from "@/components/infotainment/MessagesAppView";
import AppMenuPopup from "@/components/infotainment/AppMenuPopup";
import { InfotainmentProvider, useInfotainment } from "@/components/infotainment/InfotainmentContext";

const IndexContent = () => {
  const { apps, appMenuOpen, navigateLeft, navigateRight, toggleApp, dialLeft, dialRight, dialUp, dialDown, dialRotate, dialCenter } = useInfotainment();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        // Task Switcher: v=left, b=toggle, n=right
        case "v":
          e.preventDefault();
          navigateLeft();
          break;
        case "b":
          e.preventDefault();
          toggleApp();
          break;
        case "n":
          e.preventDefault();
          navigateRight();
          break;
        // Control Dial directional: arrow keys
        case "ArrowLeft":
          e.preventDefault();
          dialLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          dialRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          dialUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          dialDown();
          break;
        // Control Dial rotate: PgUp/PgDown
        case "PageUp":
          e.preventDefault();
          dialRotate("ccw");
          break;
        case "PageDown":
          e.preventDefault();
          dialRotate("cw");
          break;
        // Control Dial center: Enter
        case "Enter":
          e.preventDefault();
          dialCenter();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateLeft, navigateRight, toggleApp, dialLeft, dialRight, dialUp, dialDown, dialRotate, dialCenter]);

  const openedAppId = Object.keys(apps).find((id) => apps[id].state === "opened") ?? null;

  // Map is always rendered in the background. Apps animate in/out as overlays.
  const [overlayAppId, setOverlayAppId] = useState<string | null>(openedAppId);
  const [phase, setPhase] = useState<"in" | "out" | "idle">(openedAppId ? "in" : "idle");
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const prevRef = useRef<string | null>(openedAppId);
  const paneRef = useRef<HTMLDivElement>(null);

  // Compute transform-origin based on taskbar item position
  const computeOrigin = (appId: string | null) => {
    if (!paneRef.current || !appId) return null;
    const paneRect = paneRef.current.getBoundingClientRect();
    const el = document.querySelector<HTMLElement>(`[data-taskbar-id="${appId}"]`);
    if (!el) return { x: paneRect.width / 2, y: paneRect.height };
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - paneRect.left,
      y: paneRect.height,
    };
  };

  useEffect(() => {
    if (openedAppId === prevRef.current) return;
    const prev = prevRef.current;
    prevRef.current = openedAppId;

    if (openedAppId && !prev) {
      // No overlay → opening one
      setOrigin(computeOrigin(openedAppId));
      setOverlayAppId(openedAppId);
      setPhase("in");
    } else if (!openedAppId && prev) {
      // Closing current overlay → reveal map
      setOrigin(computeOrigin(prev));
      setPhase("out");
      const t = setTimeout(() => {
        setOverlayAppId(null);
        setPhase("idle");
      }, 240);
      return () => clearTimeout(t);
    } else if (openedAppId && prev) {
      // Switching from one overlay to another: shrink old, then grow new
      setOrigin(computeOrigin(prev));
      setPhase("out");
      const t = setTimeout(() => {
        setOrigin(computeOrigin(openedAppId));
        setOverlayAppId(openedAppId);
        setPhase("in");
      }, 240);
      return () => clearTimeout(t);
    }
  }, [openedAppId]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderOverlay = () => {
    switch (overlayAppId) {
      case "climate":
        return <ClimateAppView />;
      case "media":
        return <MediaAppView />;
      case "settings":
        return <SettingsAppView />;
      case "calendar":
        return <CalendarAppView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background relative">
      

      <div className="flex flex-1 min-h-0">
        <div className="w-[340px] flex-shrink-0 bg-card/40">
          <DrivingInfo />
        </div>

        <div ref={paneRef} className="flex-1 min-w-0 relative overflow-hidden">
          {/* Persistent map background */}
          <div className="absolute inset-0 z-0">
            <MapView />
          </div>

          {/* Overlay app */}
          {overlayAppId && (
            <div
              key={overlayAppId}
              className={`absolute inset-0 z-[2000] bg-background ${
                phase === "in" ? "animate-genie-in" : phase === "out" ? "animate-genie-out" : ""
              }`}
              style={
                origin
                  ? { transformOrigin: `${origin.x}px ${origin.y}px` }
                  : { transformOrigin: "50% 100%" }
              }
            >
              {renderOverlay()}
            </div>
          )}
        </div>
      </div>

      <BottomTaskbar />
      <NavigationButtons />

      {appMenuOpen && <AppMenuPopup />}
    </div>
  );
};

const Index = () => {
  return (
    <InfotainmentProvider>
      <IndexContent />
    </InfotainmentProvider>
  );
};

export default Index;
