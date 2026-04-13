import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type TaskbarItem = {
  id: string;
  label: string;
  type: "shortcut" | "widget";
};

export const TASKBAR_ITEMS: TaskbarItem[] = [
  { id: "settings", label: "Settings", type: "shortcut" },
  { id: "climate", label: "Climate", type: "widget" },
  { id: "media", label: "Media", type: "widget" },
  { id: "menu", label: "App Menu", type: "shortcut" },
];

type AppState = "closed" | "opened" | "minimized";

interface AppInstance {
  id: string;
  state: AppState;
}

interface ClimateState {
  temp: number;
  seatHeat: number;
  steeringHeat: boolean;
  defogger: boolean;
  zones: "dual" | "single";
  activeZone: "left" | "right";
}

interface MediaState {
  playing: boolean;
  volume: number;
  muted: boolean;
  source: string;
  trackIndex: number;
}

const TRACKS = [
  { title: "Midnight Drive", artist: "Synthwave FM" },
  { title: "Neon Horizons", artist: "Retrowave Radio" },
  { title: "Electric Dreams", artist: "Cyber Pulse" },
  { title: "Starlight Highway", artist: "Astral Beats" },
];

interface InfotainmentContextType {
  highlightedIndex: number;
  apps: Record<string, AppInstance>;
  climate: ClimateState;
  media: MediaState;
  tracks: typeof TRACKS;
  appMenuOpen: boolean;
  appMenuIndex: number;
  navigateLeft: () => void;
  navigateRight: () => void;
  openApp: () => void;
  minimizeApp: () => void;
  dialLeft: () => void;
  dialRight: () => void;
  dialUp: () => void;
  dialDown: () => void;
  dialRotate: (dir: "cw" | "ccw") => void;
  dialCenter: () => void;
  openAppFromMenu: (appId: string) => void;
  setClimate: React.Dispatch<React.SetStateAction<ClimateState>>;
  setMedia: React.Dispatch<React.SetStateAction<MediaState>>;
}

const InfotainmentContext = createContext<InfotainmentContextType | null>(null);

export const useInfotainment = () => {
  const ctx = useContext(InfotainmentContext);
  if (!ctx) throw new Error("useInfotainment must be used within InfotainmentProvider");
  return ctx;
};

const APP_MENU_COUNT = 9;

export const InfotainmentProvider = ({ children }: { children: ReactNode }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(1);
  const [apps, setApps] = useState<Record<string, AppInstance>>({
    settings: { id: "settings", state: "closed" },
    climate: { id: "climate", state: "closed" },
    media: { id: "media", state: "closed" },
    menu: { id: "menu", state: "closed" },
  });

  const [climate, setClimate] = useState<ClimateState>({
    temp: 22,
    seatHeat: 1,
    steeringHeat: false,
    defogger: false,
    zones: "dual",
    activeZone: "left",
  });

  const [media, setMedia] = useState<MediaState>({
    playing: true,
    volume: 65,
    muted: false,
    source: "music",
    trackIndex: 0,
  });

  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [appMenuIndex, setAppMenuIndex] = useState(0);

  // Auto-open/close menu when navigating to/from menu item
  const navigateLeft = useCallback(() => {
    if (appMenuOpen) {
      if (appMenuIndex === 0) {
        // Past first item — exit menu, go to rightmost non-menu taskbar item
        setAppMenuOpen(false);
        const menuIdx = TASKBAR_ITEMS.findIndex((t) => t.id === "menu");
        const prev = (menuIdx - 1 + TASKBAR_ITEMS.length) % TASKBAR_ITEMS.length;
        setHighlightedIndex(prev);
      } else {
        setAppMenuIndex((i) => i - 1);
      }
      return;
    }
    setHighlightedIndex((prev) => {
      const next = (prev - 1 + TASKBAR_ITEMS.length) % TASKBAR_ITEMS.length;
      if (TASKBAR_ITEMS[next].id === "menu") {
        setAppMenuOpen(true);
        setAppMenuIndex(APP_MENU_COUNT - 1); // enter from right side = last item
      }
      return next;
    });
  }, [appMenuOpen, appMenuIndex]);

  const navigateRight = useCallback(() => {
    if (appMenuOpen) {
      if (appMenuIndex === APP_MENU_COUNT - 1) {
        // Past last item — exit menu, go to first taskbar item
        setAppMenuOpen(false);
        setHighlightedIndex(0);
      } else {
        setAppMenuIndex((i) => i + 1);
      }
      return;
    }
    setHighlightedIndex((prev) => {
      const next = (prev + 1) % TASKBAR_ITEMS.length;
      if (TASKBAR_ITEMS[next].id === "menu") {
        setAppMenuOpen(true);
        setAppMenuIndex(0);
      }
      return next;
    });
  }, [appMenuOpen, appMenuIndex]);

  const currentId = TASKBAR_ITEMS[highlightedIndex].id;

  const openApp = useCallback(() => {
    const id = TASKBAR_ITEMS[highlightedIndex].id;
    if (id === "menu" && appMenuOpen) {
      const APP_MENU_IDS = ["navigation", "media", "climate", "settings", "phone", "camera", "calendar", "messages", "bluetooth", "wifi", "vehicle", "charging", "performance", "parking", "security", "about"];
      const selectedAppId = APP_MENU_IDS[appMenuIndex];
      if (selectedAppId) {
        setAppMenuOpen(false);
        const taskbarIndex = TASKBAR_ITEMS.findIndex((t) => t.id === selectedAppId);
        if (taskbarIndex >= 0) {
          setHighlightedIndex(taskbarIndex);
          setApps((prev) => {
            const updated = { ...prev };
            for (const key of Object.keys(updated)) {
              if (updated[key].state === "opened") {
                updated[key] = { ...updated[key], state: "minimized" };
              }
            }
            updated[selectedAppId] = { ...updated[selectedAppId], state: "opened" };
            return updated;
          });
        }
      }
    } else if (id !== "menu") {
      setApps((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          if (updated[key].state === "opened") {
            updated[key] = { ...updated[key], state: "minimized" };
          }
        }
        updated[id] = { ...updated[id], state: "opened" };
        return updated;
      });
    }
  }, [highlightedIndex, appMenuOpen, appMenuIndex]);

  const minimizeApp = useCallback(() => {
    // Close app menu if open
    setAppMenuOpen(false);
    // Close any opened app regardless of what's highlighted
    setApps((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        if (updated[key].state === "opened") {
          updated[key] = { ...updated[key], state: "minimized" };
        }
      }
      return updated;
    });
  }, []);

  const openAppFromMenu = useCallback((appId: string) => {
    setAppMenuOpen(false);
    // Map menu items to taskbar items where possible
    const taskbarIndex = TASKBAR_ITEMS.findIndex((t) => t.id === appId);
    if (taskbarIndex >= 0) {
      setHighlightedIndex(taskbarIndex);
      setApps((prev) => ({ ...prev, [appId]: { ...prev[appId], state: "opened" } }));
    } else {
      // For apps not in taskbar, open settings as fallback or just close menu
      // In a real system these would have their own views
    }
  }, []);

  // Contextual dial controls
  const dialLeft = useCallback(() => {
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i - 1 + APP_MENU_COUNT) % APP_MENU_COUNT);
    } else if (currentId === "media") {
      setMedia((m) => ({
        ...m,
        trackIndex: (m.trackIndex - 1 + TRACKS.length) % TRACKS.length,
      }));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, activeZone: c.activeZone === "left" ? "right" : "left" }));
    }
  }, [currentId, appMenuOpen]);

  const dialRight = useCallback(() => {
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i + 1) % APP_MENU_COUNT);
    } else if (currentId === "media") {
      setMedia((m) => ({
        ...m,
        trackIndex: (m.trackIndex + 1) % TRACKS.length,
      }));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, activeZone: c.activeZone === "left" ? "right" : "left" }));
    }
  }, [currentId, appMenuOpen]);

  const dialUp = useCallback(() => {
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i - 4 + APP_MENU_COUNT) % APP_MENU_COUNT);
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }));
    }
  }, [currentId, appMenuOpen]);

  const dialDown = useCallback(() => {
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i + 4) % APP_MENU_COUNT);
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, defogger: !c.defogger }));
    }
  }, [currentId, appMenuOpen]);

  const dialRotate = useCallback(
    (dir: "cw" | "ccw") => {
      if (currentId === "menu" && appMenuOpen) {
        setAppMenuIndex((i) => dir === "cw" ? (i + 1) % APP_MENU_COUNT : (i - 1 + APP_MENU_COUNT) % APP_MENU_COUNT);
      } else if (currentId === "media") {
        setMedia((m) => ({
          ...m,
          volume: Math.max(0, Math.min(100, m.volume + (dir === "cw" ? 5 : -5))),
          muted: false,
        }));
      } else if (currentId === "climate") {
        setClimate((c) => ({
          ...c,
          temp: Math.max(16, Math.min(30, c.temp + (dir === "cw" ? 0.5 : -0.5))),
        }));
      }
    },
    [currentId, appMenuOpen]
  );

  const dialCenter = useCallback(() => {
    if (currentId === "menu" && appMenuOpen) {
      // Import the app menu items list to get the id
      // We'll use a dynamic import approach - for now just use the index mapping
      const APP_MENU_IDS = ["navigation", "media", "climate", "settings", "phone", "camera", "calendar", "messages", "bluetooth", "wifi", "vehicle", "charging", "performance", "parking", "security", "about"];
      const selectedAppId = APP_MENU_IDS[appMenuIndex];
      if (selectedAppId) {
        openAppFromMenu(selectedAppId);
      }
    } else if (currentId === "media") {
      setMedia((m) => ({ ...m, playing: !m.playing }));
    } else if (currentId === "climate") {
      setClimate((c) => ({
        ...c,
        zones: c.zones === "dual" ? "single" : "dual",
      }));
    }
  }, [currentId, appMenuOpen, appMenuIndex, openAppFromMenu]);

  return (
    <InfotainmentContext.Provider
      value={{
        highlightedIndex,
        apps,
        climate,
        media,
        tracks: TRACKS,
        appMenuOpen,
        appMenuIndex,
        navigateLeft,
        navigateRight,
        openApp,
        minimizeApp,
        dialLeft,
        dialRight,
        dialUp,
        dialDown,
        dialRotate,
        dialCenter,
        openAppFromMenu,
        setClimate,
        setMedia,
      }}
    >
      {children}
    </InfotainmentContext.Provider>
  );
};
