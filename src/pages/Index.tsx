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
import { emitHardwareInput } from "@/components/infotainment/hardwareInputEvents";

// Space the physical-control panel needs, in px, when docked to the right / below.
const CONTROLS_SIDE_WIDTH = 260;
const CONTROLS_BELOW_HEIGHT = 270;
const SCREEN_RATIO = 16 / 9;

// Pick whichever placement leaves the 16:9 screen wider: controls on the right
// (wide windows) or below (narrow / tall windows).
const useControlsPlacement = (): "side" | "below" => {
  const compute = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const sideWidth = Math.min(Math.max(w - CONTROLS_SIDE_WIDTH, 0), h * SCREEN_RATIO);
    const belowWidth = Math.min(w, Math.max(h - CONTROLS_BELOW_HEIGHT, 0) * SCREEN_RATIO);
    return sideWidth > belowWidth ? "side" : "below";
  };
  const [placement, setPlacement] = useState<"side" | "below">(compute);
  useEffect(() => {
    const onResize = () => setPlacement(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return placement;
};

const IndexContent = () => {
  const placement = useControlsPlacement();
  const controlsOnSide = placement === "side";

  const { apps, appMenuOpen, navigateLeft, navigateRight, toggleApp, dialLeft, dialRight, dialUp, dialDown, dialRotate, dialCenter } = useInfotainment();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        // Navigation Cluster: v=left, b=toggle, n=right
        case "v":
          e.preventDefault();
          emitHardwareInput("joy-left");
          navigateLeft();
          break;
        case "b":
          e.preventDefault();
          emitHardwareInput("joy-center");
          toggleApp();
          break;
        case "n":
          e.preventDefault();
          emitHardwareInput("joy-right");
          navigateRight();
          break;
        // Control Cluster directional: arrow keys
        case "ArrowLeft":
          e.preventDefault();
          emitHardwareInput("dial-left");
          dialLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          emitHardwareInput("dial-right");
          dialRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          emitHardwareInput("dial-up");
          dialUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          emitHardwareInput("dial-down");
          dialDown();
          break;
        // Control Cluster rotate: PgUp/PgDown
        case "PageUp":
          e.preventDefault();
          emitHardwareInput("rotate-ccw");
          dialRotate("ccw");
          break;
        case "PageDown":
          e.preventDefault();
          emitHardwareInput("rotate-cw");
          dialRotate("cw");
          break;
        // Control Cluster center: Enter
        case "Enter":
          e.preventDefault();
          emitHardwareInput("dial-center");
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
      case "phone":
        return <PhoneAppView />;
      case "dashcam":
        return <DashcamAppView />;
      case "games":
        return <GamesAppView />;
      case "videos":
        return <VideosAppView />;
      case "messages":
        return <MessagesAppView />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-background relative items-center ${
        controlsOnSide ? "flex-row" : "flex-col"
      }`}
    >

      {/* Display area (screen + taskbar) locked to 16:9 */}
      <div className="flex-1 min-h-0 min-w-0 h-full w-full flex items-center justify-center overflow-hidden bg-[hsl(220_22%_5%)]">
        <div
          className="flex flex-col overflow-hidden bg-[hsl(220_22%_5%)] border border-border/30 rounded-sm"
          style={{ aspectRatio: "16 / 9", height: "100%", maxWidth: "100%", maxHeight: "100%" }}
        >
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

              {/* App grid popup */}
              {appMenuOpen && <AppMenuPopup />}
            </div>
          </div>

          <BottomTaskbar />
        </div>
      </div>

      {controlsOnSide && (
        <div
          className="h-full flex-shrink-0 overflow-y-auto bg-[hsl(220_22%_5%)]"
          style={{ width: CONTROLS_SIDE_WIDTH }}
        >
          <NavigationButtons vertical />
        </div>
      )}

      {!controlsOnSide && (
        <div className="w-full flex-shrink-0">
          <NavigationButtons />
        </div>
      )}
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
