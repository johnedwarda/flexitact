import { createContext, useContext, useState, useCallback, useRef, useEffect, type Context, type ReactNode } from "react";

const PHONE_ITEMS_COUNT = 9; // 5 favorites + 4 recent calls

export type TaskbarItem = {
  id: string;
  label: string;
  type: "shortcut" | "widget";
};

export const TASKBAR_ITEMS: TaskbarItem[] = [
  { id: "settings", label: "Settings", type: "shortcut" },
  { id: "climate", label: "Climate", type: "widget" },
  { id: "media", label: "Media", type: "widget" },
  { id: "phone", label: "Phone", type: "shortcut" },
  { id: "menu", label: "App Menu", type: "shortcut" },
];

type AppState = "closed" | "opened" | "minimized";

interface AppInstance {
  id: string;
  state: AppState;
}

export type ClimateZone = "driver" | "passenger" | "rearL" | "rearC" | "rearR";

interface ClimateState {
  temp: number; // driver temp (also single-zone temp)
  passengerTemp: number;
  rearTemp: number;
  seatHeat: number; // legacy alias for driver heat (kept for widget compat)
  frontSeatHeat: { driver: number; passenger: number };
  rearSeatHeat: [number, number, number];
  steeringHeat: boolean;
  defogger: boolean;
  rearDefogger: boolean;
  mirrorHeat: { left: boolean; right: boolean };
  fanSpeed: number;
  acOn: boolean;
  autoMode: boolean;
  recirculation: boolean;
  airDirection: "face" | "feet" | "both" | "windshield";
  zones: "dual" | "single";
  rearSync: boolean;
  activeZone: ClimateZone;
}

const ZONE_ORDER: ClimateZone[] = ["driver", "passenger", "rearL", "rearC", "rearR"];

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
  phonePopupOpen: boolean;
  phoneIndex: number;
  navigateLeft: () => void;
  navigateRight: () => void;
  openApp: () => void;
  minimizeApp: () => void;
  toggleApp: () => void;
  dialLeft: () => void;
  dialRight: () => void;
  dialUp: () => void;
  dialDown: () => void;
  dialRotate: (dir: "cw" | "ccw") => void;
  dialCenter: () => void;
  openAppFromMenu: (appId: string) => void;
  openAppById: (appId: string) => void;
  navigateToItem: (index: number) => void;
  setClimate: React.Dispatch<React.SetStateAction<ClimateState>>;
  setMedia: React.Dispatch<React.SetStateAction<MediaState>>;
}

const INFOTAINMENT_CONTEXT_KEY = "__lovable_infotainment_context__";

const globalInfotainmentContext = globalThis as typeof globalThis & {
  [INFOTAINMENT_CONTEXT_KEY]?: Context<InfotainmentContextType | null>;
};

const InfotainmentContext =
  globalInfotainmentContext[INFOTAINMENT_CONTEXT_KEY] ??
  (globalInfotainmentContext[INFOTAINMENT_CONTEXT_KEY] = createContext<InfotainmentContextType | null>(null));

InfotainmentContext.displayName = "InfotainmentContext";

export const useInfotainment = () => {
  const ctx = useContext(InfotainmentContext);
  if (!ctx) throw new Error("useInfotainment must be used within InfotainmentProvider");
  return ctx;
};

const APP_MENU_COUNT = 6;
const APP_MENU_COLS = 3;
const APP_MENU_IDS = ["dashcam", "games", "videos", "calendar", "messages", "navigation"];

export const InfotainmentProvider = ({ children }: { children: ReactNode }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(1);
  const [apps, setApps] = useState<Record<string, AppInstance>>({
    settings: { id: "settings", state: "closed" },
    climate: { id: "climate", state: "closed" },
    media: { id: "media", state: "closed" },
    phone: { id: "phone", state: "closed" },
    menu: { id: "menu", state: "closed" },
  });

  const [climate, setClimate] = useState<ClimateState>({
    temp: 22,
    passengerTemp: 22,
    rearTemp: 21,
    seatHeat: 1,
    frontSeatHeat: { driver: 1, passenger: 0 },
    rearSeatHeat: [0, 0, 0],
    steeringHeat: false,
    defogger: false,
    rearDefogger: false,
    mirrorHeat: { left: false, right: false },
    fanSpeed: 3,
    acOn: true,
    autoMode: false,
    recirculation: false,
    airDirection: "face",
    zones: "dual",
    rearSync: true,
    activeZone: "driver",
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
  const [phonePopupOpen, setPhonePopupOpen] = useState(false);
  const [phoneIndex, setPhoneIndex] = useState(0);
  const lastDialUsedIndexRef = useRef<number>(1); // default to climate
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastActivity, setLastActivity] = useState(0);

  // Track dial usage on eligible items (not settings or menu)
  const recordDialUsage = useCallback((index: number) => {
    const item = TASKBAR_ITEMS[index];
    if (item && item.id !== "settings" && item.id !== "menu") {
      lastDialUsedIndexRef.current = index;
    }
    setLastActivity(Date.now());
  }, []);

  // Reset idle timer on any navigation action
  const recordActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Auto-return from settings/menu after 5 seconds of idle
  useEffect(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    const currentItem = TASKBAR_ITEMS[highlightedIndex];
    if (currentItem && (currentItem.id === "settings" || currentItem.id === "menu")) {
      idleTimerRef.current = setTimeout(() => {
        const targetIndex = lastDialUsedIndexRef.current;
        setHighlightedIndex(targetIndex);
        setAppMenuOpen(false);
        setPhonePopupOpen(TASKBAR_ITEMS[targetIndex]?.id === "phone");
        if (TASKBAR_ITEMS[targetIndex]?.id === "phone") setPhoneIndex(0);
      }, 10000);
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [highlightedIndex, appMenuOpen, lastActivity]);

  // Auto-open/close menu when navigating to/from menu item
  const navigateLeft = useCallback(() => {
    recordActivity();
    if (appMenuOpen) {
      if (appMenuIndex === 0) {
        setAppMenuOpen(false);
        const menuIdx = TASKBAR_ITEMS.findIndex((t) => t.id === "menu");
        const prev = (menuIdx - 1 + TASKBAR_ITEMS.length) % TASKBAR_ITEMS.length;
        setHighlightedIndex(prev);
        if (TASKBAR_ITEMS[prev].id === "phone") {
          setPhonePopupOpen(true);
          setPhoneIndex(0);
        }
      } else {
        setAppMenuIndex((i) => i - 1);
      }
      return;
    }
    setHighlightedIndex((prev) => {
      if (prev <= 0) return prev; // stop at leftmost
      const next = prev - 1;
      if (TASKBAR_ITEMS[next].id === "menu") {
        setAppMenuOpen(true);
        setAppMenuIndex(APP_MENU_COUNT - 1);
        setPhonePopupOpen(false);
      } else if (TASKBAR_ITEMS[next].id === "phone") {
        setPhonePopupOpen(true);
        setPhoneIndex(0);
      } else {
        setPhonePopupOpen(false);
      }
      return next;
    });
  }, [appMenuOpen, appMenuIndex, recordActivity]);

  const navigateRight = useCallback(() => {
    recordActivity();
    if (appMenuOpen) {
      if (appMenuIndex === APP_MENU_COUNT - 1) {
        setAppMenuOpen(false);
        setHighlightedIndex(0);
        setPhonePopupOpen(false);
      } else {
        setAppMenuIndex((i) => i + 1);
      }
      return;
    }
    setHighlightedIndex((prev) => {
      if (prev >= TASKBAR_ITEMS.length - 1) return prev; // stop at rightmost
      const next = prev + 1;
      if (TASKBAR_ITEMS[next].id === "menu") {
        setAppMenuOpen(true);
        setAppMenuIndex(0);
        setPhonePopupOpen(false);
      } else if (TASKBAR_ITEMS[next].id === "phone") {
        setPhonePopupOpen(true);
        setPhoneIndex(0);
      } else {
        setPhonePopupOpen(false);
      }
      return next;
    });
  }, [appMenuOpen, appMenuIndex, recordActivity]);

  const currentId = TASKBAR_ITEMS[highlightedIndex].id;

  const openApp = useCallback(() => {
    const id = TASKBAR_ITEMS[highlightedIndex].id;
    if (id === "menu" && appMenuOpen) {
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
    setAppMenuOpen(false);
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

  const toggleApp = useCallback(() => {
    const id = TASKBAR_ITEMS[highlightedIndex].id;
    // If menu is open, select from menu
    if (id === "menu" && appMenuOpen) {
      openApp();
      return;
    }
    // Check if any app is currently opened
    const openedAppId = Object.keys(apps).find((k) => apps[k].state === "opened");
    if (openedAppId) {
      minimizeApp();
    } else {
      openApp();
    }
  }, [highlightedIndex, appMenuOpen, apps, openApp, minimizeApp]);

  const openAppById = useCallback((appId: string) => {
    setApps((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        if (updated[key].state === "opened") {
          updated[key] = { ...updated[key], state: "minimized" };
        }
      }
      if (updated[appId]) {
        updated[appId] = { ...updated[appId], state: "opened" };
      }
      return updated;
    });
  }, []);

  const navigateToItem = useCallback((index: number) => {
    const item = TASKBAR_ITEMS[index];
    setHighlightedIndex(index);
    if (item.id === "menu") {
      setAppMenuOpen(true);
      setAppMenuIndex(0);
      setPhonePopupOpen(false);
    } else if (item.id === "phone") {
      setPhonePopupOpen(true);
      setPhoneIndex(0);
      setAppMenuOpen(false);
    } else {
      setAppMenuOpen(false);
      setPhonePopupOpen(false);
    }
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
    recordDialUsage(highlightedIndex);
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i - 1 + APP_MENU_COUNT) % APP_MENU_COUNT);
    } else if (currentId === "phone" && phonePopupOpen) {
      setPhoneIndex((i) => (i - 1 + PHONE_ITEMS_COUNT) % PHONE_ITEMS_COUNT);
    } else if (currentId === "media") {
      setMedia((m) => ({
        ...m,
        trackIndex: (m.trackIndex - 1 + TRACKS.length) % TRACKS.length,
      }));
    } else if (currentId === "climate") {
      setClimate((c) => {
        const idx = ZONE_ORDER.indexOf(c.activeZone);
        const next = ZONE_ORDER[(idx - 1 + ZONE_ORDER.length) % ZONE_ORDER.length];
        return { ...c, activeZone: next };
      });
    }
  }, [currentId, appMenuOpen, phonePopupOpen, highlightedIndex, recordDialUsage]);

  const dialRight = useCallback(() => {
    recordDialUsage(highlightedIndex);
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i + 1) % APP_MENU_COUNT);
    } else if (currentId === "phone" && phonePopupOpen) {
      setPhoneIndex((i) => (i + 1) % PHONE_ITEMS_COUNT);
    } else if (currentId === "media") {
      setMedia((m) => ({
        ...m,
        trackIndex: (m.trackIndex + 1) % TRACKS.length,
      }));
    } else if (currentId === "climate") {
      setClimate((c) => {
        const idx = ZONE_ORDER.indexOf(c.activeZone);
        const next = ZONE_ORDER[(idx + 1) % ZONE_ORDER.length];
        return { ...c, activeZone: next };
      });
    }
  }, [currentId, appMenuOpen, phonePopupOpen, highlightedIndex, recordDialUsage]);

  const dialUp = useCallback(() => {
    recordDialUsage(highlightedIndex);
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i - APP_MENU_COLS + APP_MENU_COUNT) % APP_MENU_COUNT);
    } else if (currentId === "phone" && phonePopupOpen) {
      setPhoneIndex((i) => Math.max(0, i - 1));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }));
    }
  }, [currentId, appMenuOpen, phonePopupOpen, highlightedIndex, recordDialUsage]);

  const dialDown = useCallback(() => {
    recordDialUsage(highlightedIndex);
    if (currentId === "menu" && appMenuOpen) {
      setAppMenuIndex((i) => (i + APP_MENU_COLS) % APP_MENU_COUNT);
    } else if (currentId === "phone" && phonePopupOpen) {
      setPhoneIndex((i) => Math.min(PHONE_ITEMS_COUNT - 1, i + 1));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, defogger: !c.defogger }));
    }
  }, [currentId, appMenuOpen, phonePopupOpen, highlightedIndex, recordDialUsage]);

  const dialRotate = useCallback(
    (dir: "cw" | "ccw") => {
      recordDialUsage(highlightedIndex);
      if (currentId === "menu" && appMenuOpen) {
        setAppMenuIndex((i) => dir === "cw" ? (i + 1) % APP_MENU_COUNT : (i - 1 + APP_MENU_COUNT) % APP_MENU_COUNT);
      } else if (currentId === "phone" && phonePopupOpen) {
        setPhoneIndex((i) => dir === "cw" ? (i + 1) % PHONE_ITEMS_COUNT : (i - 1 + PHONE_ITEMS_COUNT) % PHONE_ITEMS_COUNT);
      } else if (currentId === "media") {
        setMedia((m) => ({
          ...m,
          volume: Math.max(0, Math.min(100, m.volume + (dir === "cw" ? 5 : -5))),
          muted: false,
        }));
      } else if (currentId === "climate") {
        const delta = dir === "cw" ? 0.5 : -0.5;
        setClimate((c) => {
          const t = Math.max(16, Math.min(30, c.temp + delta));
          return { ...c, temp: t, passengerTemp: t, rearTemp: t };
        });
      }
    },
    [currentId, appMenuOpen, phonePopupOpen, highlightedIndex, recordDialUsage]
  );

  const dialCenter = useCallback(() => {
    recordDialUsage(highlightedIndex);
    if (currentId === "menu" && appMenuOpen) {
      const selectedAppId = APP_MENU_IDS[appMenuIndex];
      if (selectedAppId) {
        openAppFromMenu(selectedAppId);
      }
    } else if (currentId === "phone" && phonePopupOpen) {
      console.log("Calling contact at index", phoneIndex);
    } else if (currentId === "media") {
      setMedia((m) => ({ ...m, playing: !m.playing }));
    } else if (currentId === "climate") {
      setClimate((c) => ({
        ...c,
        zones: c.zones === "dual" ? "single" : "dual",
      }));
    }
  }, [currentId, appMenuOpen, appMenuIndex, openAppFromMenu, highlightedIndex, recordDialUsage]);

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
        phonePopupOpen,
        phoneIndex,
        navigateLeft,
        navigateRight,
        openApp,
        minimizeApp,
        toggleApp,
        dialLeft,
        dialRight,
        dialUp,
        dialDown,
        dialRotate,
        dialCenter,
        openAppFromMenu,
        openAppById,
        navigateToItem,
        setClimate,
        setMedia,
      }}
    >
      {children}
    </InfotainmentContext.Provider>
  );
};
