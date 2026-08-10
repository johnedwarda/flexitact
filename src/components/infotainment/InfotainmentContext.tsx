import { createContext, useContext, useState, useCallback, useRef, useEffect, type Context, type ReactNode } from "react";

const PHONE_ITEMS_COUNT = 4; // 4 favorites

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
  { id: "calendar", label: "Calendar", type: "shortcut" },
  { id: "recent", label: "Recent App", type: "shortcut" },
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
  activeCallIndex: number | null;
  controlClusterDisabled: boolean;
  startCall: (index: number) => void;
  endCall: () => void;
  callVolume: number;
  callMuted: boolean;
  setCallMuted: (m: boolean) => void;
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
  toggleAppById: (appId: string) => void;
  openAppMenu: () => void;
  recentGridAppId: string | null;
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

const APP_MENU_COUNT = 5;
const APP_MENU_COLS = 3;
const APP_MENU_IDS = ["dashcam", "games", "videos", "messages", "navigation"];

export const InfotainmentProvider = ({ children }: { children: ReactNode }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(1);
  const [apps, setApps] = useState<Record<string, AppInstance>>({
    settings: { id: "settings", state: "closed" },
    climate: { id: "climate", state: "closed" },
    media: { id: "media", state: "closed" },
    phone: { id: "phone", state: "closed" },
    calendar: { id: "calendar", state: "closed" },
    dashcam: { id: "dashcam", state: "closed" },
    games: { id: "games", state: "closed" },
    videos: { id: "videos", state: "closed" },
    messages: { id: "messages", state: "closed" },
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
  const [activeCallIndex, setActiveCallIndex] = useState<number | null>(null);
  const [callVolume, setCallVolume] = useState(60);
  const [callMuted, setCallMuted] = useState(false);
  // Most recently opened app-grid app, surfaced in the reserved taskbar slot
  const [recentGridAppId, setRecentGridAppId] = useState<string | null>(null);
  const recentGridAppIdRef = useRef<string | null>(null);
  const rememberGridApp = useCallback((appId: string) => {
    if (!APP_MENU_IDS.includes(appId) || appId === "navigation") return;
    recentGridAppIdRef.current = appId;
    setRecentGridAppId(appId);
  }, []);
  // ---- Highlight timeout logic ----
  const IDLE_TIMEOUT_MS = 5000;
  // Items that can hold the highlight after a timeout (interactive widgets)
  const WIDGET_IDS = ["climate", "media", "phone"];
  const isWidgetIndex = (index: number) => WIDGET_IDS.includes(TASKBAR_ITEMS[index]?.id ?? "");

  const lastDialUsedIndexRef = useRef<number>(1); // default to climate
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastActivity, setLastActivity] = useState(0);

  const returnToLastWidget = useCallback(() => {
    const targetIndex = lastDialUsedIndexRef.current;
    setHighlightedIndex(targetIndex);
    setAppMenuOpen(false);
    const isPhone = TASKBAR_ITEMS[targetIndex]?.id === "phone";
    setPhonePopupOpen(isPhone);
    if (isPhone) setPhoneIndex(0);
    setLastActivity(Date.now());
  }, []);

  // Any control-cluster interaction resets the timeout; interactions on a
  // widget also make it the "last used widget".
  const recordDialUsage = useCallback((index: number) => {
    // Control-cluster interaction only counts when the highlight is on a widget.
    // On icons (settings / calendar / app grid) it neither locks nor resets the timer.
    if (!isWidgetIndex(index)) return;
    lastDialUsedIndexRef.current = index;
    setLastActivity(Date.now());
  }, []);

  const recordActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // After 5s without any control-cluster interaction, return the highlight to
  // the last widget the control cluster was used with. The app grid stays open
  // as long as the highlight sits in it; the revert closes it.
  useEffect(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    // A widget that was last interacted with via the control cluster is locked.
    if (highlightedIndex === lastDialUsedIndexRef.current && isWidgetIndex(highlightedIndex)) {
      return;
    }

    idleTimerRef.current = setTimeout(returnToLastWidget, IDLE_TIMEOUT_MS);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [highlightedIndex, appMenuOpen, lastActivity, returnToLastWidget]);


  // Auto-open/close menu when navigating to/from menu item
  const navigateLeft = useCallback(() => {
    recordActivity();
    if (appMenuOpen) {
      if (appMenuIndex <= 0) {
        // Wrap from the first app-grid item back to the taskbar item before the app grid icon (calendar).
        setAppMenuOpen(false);
        setPhonePopupOpen(false);
        const calendarIndex = TASKBAR_ITEMS.findIndex((item) => item.id === "calendar");
        setHighlightedIndex(calendarIndex >= 0 ? calendarIndex : TASKBAR_ITEMS.length - 2);
      } else {
        setAppMenuIndex((i) => i - 1);
      }
      return;
    }
    setHighlightedIndex((prev) => {
      if (prev <= 0) return prev; // stop at leftmost
      let next = prev - 1;
      if (TASKBAR_ITEMS[next].id === "recent" && !recentGridAppIdRef.current) next = next - 1;
      if (next < 0) return prev;
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
      // App grid highlight clamps at the last item instead of exiting/cycling.
      if (appMenuIndex < APP_MENU_COUNT - 1) {
        setAppMenuIndex((i) => i + 1);
      }
      return;
    }
    setHighlightedIndex((prev) => {
      // At the rightmost taskbar item (app grid icon), wrap into the app grid.
      if (prev >= TASKBAR_ITEMS.length - 1) {
        setAppMenuOpen(true);
        setAppMenuIndex(0);
        setPhonePopupOpen(false);
        return prev;
      }
      let next = prev + 1;
      if (TASKBAR_ITEMS[next].id === "recent" && !recentGridAppIdRef.current) next = next + 1;
      if (next > TASKBAR_ITEMS.length - 1) return prev;
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
  // Control Cluster is enabled only while the highlight pill sits on an interactive widget.
  // It is disabled for all taskbar icons (settings, calendar, recent, app grid) regardless of
  // whether an app is currently open.
  const CONTROL_CLUSTER_ENABLED_IDS = ["climate", "media", "phone"];
  const controlClusterDisabled = !CONTROL_CLUSTER_ENABLED_IDS.includes(currentId);


  const openApp = useCallback(() => {
    const id = TASKBAR_ITEMS[highlightedIndex].id;
    if (id === "menu" && appMenuOpen) {
      const selectedAppId = APP_MENU_IDS[appMenuIndex];
      if (selectedAppId) {
        // Already open → close it (reveal the map)
        if (apps[selectedAppId]?.state === "opened") {
          setApps((prev) => {
            const updated = { ...prev };
            for (const key of Object.keys(updated)) {
              if (updated[key].state === "opened") updated[key] = { ...updated[key], state: "minimized" };
            }
            return updated;
          });
          return;
        }
        rememberGridApp(selectedAppId);
        // Grid stays open (highlight remains on it) until the idle timeout.
        setApps((prev) => {
          const updated = { ...prev };
          for (const key of Object.keys(updated)) {
            if (updated[key].state === "opened") {
              updated[key] = { ...updated[key], state: "minimized" };
            }
          }
          // "navigation" is the persistent map background — opening it just clears overlays
          if (selectedAppId !== "navigation") {
            updated[selectedAppId] = { ...(updated[selectedAppId] ?? { id: selectedAppId }), state: "opened" };
          }
          return updated;
        });
      }
    } else if (id !== "menu") {
      const targetId = id === "recent" ? recentGridAppIdRef.current : id;
      if (!targetId) return;
      setApps((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          if (updated[key].state === "opened") {
            updated[key] = { ...updated[key], state: "minimized" };
          }
        }
        updated[targetId] = { ...(updated[targetId] ?? { id: targetId }), state: "opened" };
        return updated;
      });
    }
  }, [highlightedIndex, appMenuOpen, appMenuIndex, apps, rememberGridApp]);

  const minimizeApp = useCallback(() => {
    // The app grid stays open while the highlight is on it; only the idle
    // timeout / navigating away closes it.
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
    // Open/close always restarts the idle timer (for both widgets and icons);
    // the revert to the last used widget only happens on idle timeout.
    recordActivity();

    if (id === "menu" && appMenuOpen) {
      openApp();
      return;
    }
    if (id === "menu") return;
    if (id === "recent") {
      const targetId = recentGridAppIdRef.current;
      if (!targetId) return;
      if (apps[targetId]?.state === "opened") minimizeApp();
      else openApp();
      return;
    }
    // If the focused app is already the open one, close it (reveal map).
    // Otherwise open the focused app (replacing any other open app).
    if (apps[id]?.state === "opened") {
      minimizeApp();
    } else {
      openApp();
    }
  }, [highlightedIndex, appMenuOpen, apps, openApp, minimizeApp, recordActivity]);



  const openAppById = useCallback((appId: string) => {
    rememberGridApp(appId);
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
  }, [rememberGridApp]);

  const toggleAppById = useCallback((appId: string) => {
    recordActivity();
    if (apps[appId]?.state === "opened") {
      minimizeApp();
    } else {
      openAppById(appId);
    }
  }, [apps, openAppById, minimizeApp, recordActivity]);

  const openAppMenu = useCallback(() => {
    // Touch/mouse opening: no grid item is highlighted, the pill stays where it was.
    setAppMenuOpen(true);
    setAppMenuIndex(-1);
    setPhonePopupOpen(false);
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
    rememberGridApp(appId);
    // Grid stays open until the idle timeout reverts the highlight.
    setApps((prev) => {
      const updated = { ...prev };
      const alreadyOpen = prev[appId]?.state === "opened";
      for (const key of Object.keys(updated)) {
        if (updated[key].state === "opened") {
          updated[key] = { ...updated[key], state: "minimized" };
        }
      }
      // Toggle: tapping the open app closes it (reveals the map).
      // "navigation" is the persistent map background — opening it just clears overlays
      if (appId !== "navigation" && !alreadyOpen) {
        updated[appId] = { ...(updated[appId] ?? { id: appId }), state: "opened" };
      }
      return updated;
    });
  }, [rememberGridApp]);

  // Contextual dial controls
  const dialLeft = useCallback(() => {
    if (controlClusterDisabled) return;
    recordDialUsage(highlightedIndex);
    if (currentId === "phone" && phonePopupOpen) {
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
  }, [currentId, controlClusterDisabled, phonePopupOpen, highlightedIndex, recordDialUsage]);

  const dialRight = useCallback(() => {
    if (controlClusterDisabled) return;
    recordDialUsage(highlightedIndex);
    if (currentId === "phone" && phonePopupOpen) {
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
  }, [currentId, controlClusterDisabled, phonePopupOpen, highlightedIndex, recordDialUsage]);

  const dialUp = useCallback(() => {
    if (controlClusterDisabled) return;
    recordDialUsage(highlightedIndex);
    if (currentId === "phone" && activeCallIndex !== null) {
      setCallMuted(false);
      return;
    }
    if (currentId === "phone" && phonePopupOpen) {
      setPhoneIndex((i) => Math.max(0, i - 1));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }));
    }
  }, [currentId, controlClusterDisabled, phonePopupOpen, highlightedIndex, recordDialUsage, activeCallIndex]);

  const dialDown = useCallback(() => {
    if (controlClusterDisabled) return;
    recordDialUsage(highlightedIndex);
    if (currentId === "phone" && activeCallIndex !== null) {
      setCallMuted(true);
      return;
    }
    if (currentId === "phone" && phonePopupOpen) {
      setPhoneIndex((i) => Math.min(PHONE_ITEMS_COUNT - 1, i + 1));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, defogger: !c.defogger }));
    }
  }, [currentId, controlClusterDisabled, phonePopupOpen, highlightedIndex, recordDialUsage, activeCallIndex]);

  const dialRotate = useCallback(
    (dir: "cw" | "ccw") => {
      if (controlClusterDisabled) return;
      recordDialUsage(highlightedIndex);
      if (currentId === "phone" && activeCallIndex !== null) {
        setCallVolume((v) => Math.max(0, Math.min(100, v + (dir === "cw" ? 5 : -5))));
        setCallMuted(false);
        return;
      }
      if (currentId === "phone" && phonePopupOpen) {
        setPhoneIndex((i) => dir === "cw" ? (i + 1) % PHONE_ITEMS_COUNT : (i - 1 + PHONE_ITEMS_COUNT) % PHONE_ITEMS_COUNT);
      } else if (currentId === "media") {
        setMedia((m) => ({
          ...m,
          volume: Math.max(0, Math.min(100, m.volume + (dir === "cw" ? 5 : -5))),
          muted: false,
        }));
      } else if (currentId === "climate") {
        const delta = dir === "cw" ? 1 : -1;
        setClimate((c) => {
          const t = Math.max(16, Math.min(30, c.temp + delta));
          return { ...c, temp: t, passengerTemp: t, rearTemp: t };
        });
      }
    },
    [currentId, controlClusterDisabled, phonePopupOpen, highlightedIndex, recordDialUsage, activeCallIndex]
  );

  const dialCenter = useCallback(() => {
    if (controlClusterDisabled) return;
    recordDialUsage(highlightedIndex);
    if (currentId === "phone") {
      setActiveCallIndex((cur) => (cur === phoneIndex ? null : phoneIndex));
    } else if (currentId === "media") {
      setMedia((m) => ({ ...m, playing: !m.playing }));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, autoMode: !c.autoMode }));
    }
  }, [currentId, controlClusterDisabled, appMenuIndex, openAppFromMenu, highlightedIndex, recordDialUsage]);

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
        activeCallIndex,
        controlClusterDisabled,
        startCall: (index: number) => { setPhoneIndex(index); setActiveCallIndex(index); setCallMuted(false); },
        endCall: () => { setActiveCallIndex(null); setCallMuted(false); },
        callVolume,
        callMuted,
        setCallMuted,
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
        toggleAppById,
        openAppMenu,
        recentGridAppId,
        navigateToItem,
        setClimate,
        setMedia,
      }}
    >
      {children}
    </InfotainmentContext.Provider>
  );
};
