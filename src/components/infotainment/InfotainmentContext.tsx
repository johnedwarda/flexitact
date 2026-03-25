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
  { id: "menu", label: "Menu", type: "shortcut" },
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
  // Task switcher actions
  navigateLeft: () => void;
  navigateRight: () => void;
  openApp: () => void;
  minimizeApp: () => void;
  // Control dial actions (contextual)
  dialLeft: () => void;
  dialRight: () => void;
  dialUp: () => void;
  dialDown: () => void;
  dialRotate: (dir: "cw" | "ccw") => void;
  dialCenter: () => void;
  // Direct state setters for widgets
  setClimate: React.Dispatch<React.SetStateAction<ClimateState>>;
  setMedia: React.Dispatch<React.SetStateAction<MediaState>>;
}

const InfotainmentContext = createContext<InfotainmentContextType | null>(null);

export const useInfotainment = () => {
  const ctx = useContext(InfotainmentContext);
  if (!ctx) throw new Error("useInfotainment must be used within InfotainmentProvider");
  return ctx;
};

export const InfotainmentProvider = ({ children }: { children: ReactNode }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(1); // start on climate
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

  const navigateLeft = useCallback(() => {
    setHighlightedIndex((i) => (i - 1 + TASKBAR_ITEMS.length) % TASKBAR_ITEMS.length);
  }, []);

  const navigateRight = useCallback(() => {
    setHighlightedIndex((i) => (i + 1) % TASKBAR_ITEMS.length);
  }, []);

  const currentId = TASKBAR_ITEMS[highlightedIndex].id;

  const openApp = useCallback(() => {
    const id = TASKBAR_ITEMS[highlightedIndex].id;
    setApps((prev) => ({ ...prev, [id]: { ...prev[id], state: "opened" } }));
  }, [highlightedIndex]);

  const minimizeApp = useCallback(() => {
    const id = TASKBAR_ITEMS[highlightedIndex].id;
    setApps((prev) => ({
      ...prev,
      [id]: { ...prev[id], state: prev[id].state === "opened" ? "minimized" : "closed" },
    }));
  }, [highlightedIndex]);

  // Contextual dial controls
  const dialLeft = useCallback(() => {
    if (currentId === "media") {
      setMedia((m) => ({
        ...m,
        trackIndex: (m.trackIndex - 1 + TRACKS.length) % TRACKS.length,
      }));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, activeZone: c.activeZone === "left" ? "right" : "left" }));
    }
  }, [currentId]);

  const dialRight = useCallback(() => {
    if (currentId === "media") {
      setMedia((m) => ({
        ...m,
        trackIndex: (m.trackIndex + 1) % TRACKS.length,
      }));
    } else if (currentId === "climate") {
      setClimate((c) => ({ ...c, activeZone: c.activeZone === "left" ? "right" : "left" }));
    }
  }, [currentId]);

  const dialUp = useCallback(() => {
    if (currentId === "climate") {
      setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }));
    }
  }, [currentId]);

  const dialDown = useCallback(() => {
    if (currentId === "climate") {
      setClimate((c) => ({ ...c, defogger: !c.defogger }));
    }
  }, [currentId]);

  const dialRotate = useCallback(
    (dir: "cw" | "ccw") => {
      if (currentId === "media") {
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
    [currentId]
  );

  const dialCenter = useCallback(() => {
    if (currentId === "media") {
      setMedia((m) => ({ ...m, playing: !m.playing }));
    } else if (currentId === "climate") {
      setClimate((c) => ({
        ...c,
        zones: c.zones === "dual" ? "single" : "dual",
      }));
    }
  }, [currentId]);

  return (
    <InfotainmentContext.Provider
      value={{
        highlightedIndex,
        apps,
        climate,
        media,
        tracks: TRACKS,
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
        setClimate,
        setMedia,
      }}
    >
      {children}
    </InfotainmentContext.Provider>
  );
};
