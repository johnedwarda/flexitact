import { useState } from "react";
import {
  Monitor,
  Volume2,
  Wifi,
  Bluetooth,
  Navigation,
  Car,
  Shield,
  Info,
  ChevronRight,
  Sun,
  Moon,
  Gauge,
  Eye,
  Lock,
  RotateCcw,
  Languages,
  Clock,
  Palette,
  SlidersHorizontal,
} from "lucide-react";

type SettingsCategory = "display" | "sound" | "connectivity" | "navigation" | "vehicle" | "safety" | "system";

const CATEGORIES: { id: SettingsCategory; label: string; icon: typeof Monitor; description: string }[] = [
  { id: "display", label: "Display", icon: Monitor, description: "Brightness, theme, layout" },
  { id: "sound", label: "Sound", icon: Volume2, description: "Audio, alerts, EQ" },
  { id: "connectivity", label: "Connectivity", icon: Wifi, description: "Wi-Fi, Bluetooth, hotspot" },
  { id: "navigation", label: "Navigation", icon: Navigation, description: "Maps, routes, POI" },
  { id: "vehicle", label: "Vehicle", icon: Car, description: "Lights, mirrors, locks" },
  { id: "safety", label: "Safety & Driver Assist", icon: Shield, description: "ADAS, cameras, alerts" },
  { id: "system", label: "System", icon: Info, description: "Language, time, updates" },
];

const SettingsAppView = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("display");
  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-6 items-center gap-3 px-5 pt-3">
        <SlidersHorizontal size={18} className="text-muted-foreground" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Settings</h1>
      </header>
      <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <div className="w-48 border-r border-border/30 bg-card/30 overflow-y-auto py-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              activeCategory === cat.id
                ? "bg-primary/10 text-primary border-r-2 border-primary"
                : "text-muted-foreground hover:bg-muted/30"
            }`}
          >
            <cat.icon size={16} />
            <span className="text-xs font-mono">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center gap-2 mb-5">
          <category.icon size={18} className="text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">{category.label}</h2>
        </div>
        {activeCategory === "display" && <DisplaySettings />}
        {activeCategory === "sound" && <SoundSettings />}
        {activeCategory === "connectivity" && <ConnectivitySettings />}
        {activeCategory === "navigation" && <NavigationSettings />}
        {activeCategory === "vehicle" && <VehicleSettings />}
        {activeCategory === "safety" && <SafetySettings />}
        {activeCategory === "system" && <SystemSettings />}
      </div>
      </div>
    </div>
  );
};

const SettingRow = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3 border-b border-border/20">
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
    {children}
  </div>
);

const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`w-10 h-5 rounded-full transition-colors relative ${active ? "bg-primary" : "bg-muted"}`}
  >
    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${active ? "left-5.5 translate-x-0" : "left-0.5"}`} 
      style={{ left: active ? "22px" : "2px" }}
    />
  </button>
);

const SliderRow = ({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
  <div className="flex items-center gap-3 w-40">
    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      onChange(Math.round(min + pct * (max - min)));
    }}>
      <div className="h-full bg-primary rounded-full" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
    </div>
    <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{value}</span>
  </div>
);

const DisplaySettings = () => {
  const [brightness, setBrightness] = useState(70);
  const [autoBrightness, setAutoBrightness] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  return (
    <div className="space-y-1">
      <SettingRow icon={<Sun size={16} />} label="Brightness">
        <SliderRow value={brightness} onChange={setBrightness} />
      </SettingRow>
      <SettingRow icon={<Eye size={16} />} label="Auto Brightness">
        <Toggle active={autoBrightness} onToggle={() => setAutoBrightness(!autoBrightness)} />
      </SettingRow>
      <SettingRow icon={<Moon size={16} />} label="Dark Mode">
        <Toggle active={darkMode} onToggle={() => setDarkMode(!darkMode)} />
      </SettingRow>
      <SettingRow icon={<Palette size={16} />} label="Night Mode">
        <Toggle active={nightMode} onToggle={() => setNightMode(!nightMode)} />
      </SettingRow>
    </div>
  );
};

const SoundSettings = () => {
  const [systemVol, setSystemVol] = useState(60);
  const [navVol, setNavVol] = useState(50);
  const [alertVol, setAlertVol] = useState(80);
  const [speedComp, setSpeedComp] = useState(true);

  return (
    <div className="space-y-1">
      <SettingRow icon={<Volume2 size={16} />} label="System Volume">
        <SliderRow value={systemVol} onChange={setSystemVol} />
      </SettingRow>
      <SettingRow icon={<Navigation size={16} />} label="Nav Volume">
        <SliderRow value={navVol} onChange={setNavVol} />
      </SettingRow>
      <SettingRow icon={<Shield size={16} />} label="Alert Volume">
        <SliderRow value={alertVol} onChange={setAlertVol} />
      </SettingRow>
      <SettingRow icon={<Gauge size={16} />} label="Speed Compensation">
        <Toggle active={speedComp} onToggle={() => setSpeedComp(!speedComp)} />
      </SettingRow>
    </div>
  );
};

const ConnectivitySettings = () => {
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [hotspot, setHotspot] = useState(false);

  return (
    <div className="space-y-1">
      <SettingRow icon={<Wifi size={16} />} label="Wi-Fi">
        <Toggle active={wifi} onToggle={() => setWifi(!wifi)} />
      </SettingRow>
      <SettingRow icon={<Bluetooth size={16} />} label="Bluetooth">
        <Toggle active={bt} onToggle={() => setBt(!bt)} />
      </SettingRow>
      <SettingRow icon={<Wifi size={16} />} label="Hotspot">
        <Toggle active={hotspot} onToggle={() => setHotspot(!hotspot)} />
      </SettingRow>
    </div>
  );
};

const NavigationSettings = () => {
  const [autoReroute, setAutoReroute] = useState(true);
  const [trafficOverlay, setTrafficOverlay] = useState(true);
  const [avoidTolls, setAvoidTolls] = useState(false);

  return (
    <div className="space-y-1">
      <SettingRow icon={<RotateCcw size={16} />} label="Auto Reroute">
        <Toggle active={autoReroute} onToggle={() => setAutoReroute(!autoReroute)} />
      </SettingRow>
      <SettingRow icon={<Eye size={16} />} label="Traffic Overlay">
        <Toggle active={trafficOverlay} onToggle={() => setTrafficOverlay(!trafficOverlay)} />
      </SettingRow>
      <SettingRow icon={<Navigation size={16} />} label="Avoid Tolls">
        <Toggle active={avoidTolls} onToggle={() => setAvoidTolls(!avoidTolls)} />
      </SettingRow>
    </div>
  );
};

const VehicleSettings = () => {
  const [autoLock, setAutoLock] = useState(true);
  const [autoFold, setAutoFold] = useState(false);
  const [ambientLight, setAmbientLight] = useState(true);
  const [ambientBri, setAmbientBri] = useState(50);

  return (
    <div className="space-y-1">
      <SettingRow icon={<Lock size={16} />} label="Auto Lock">
        <Toggle active={autoLock} onToggle={() => setAutoLock(!autoLock)} />
      </SettingRow>
      <SettingRow icon={<Car size={16} />} label="Auto Fold Mirrors">
        <Toggle active={autoFold} onToggle={() => setAutoFold(!autoFold)} />
      </SettingRow>
      <SettingRow icon={<Palette size={16} />} label="Ambient Lighting">
        <Toggle active={ambientLight} onToggle={() => setAmbientLight(!ambientLight)} />
      </SettingRow>
      <SettingRow icon={<Sun size={16} />} label="Ambient Brightness">
        <SliderRow value={ambientBri} onChange={setAmbientBri} />
      </SettingRow>
    </div>
  );
};

const SafetySettings = () => {
  const [lka, setLka] = useState(true);
  const [bsm, setBsm] = useState(true);
  const [fcw, setFcw] = useState(true);
  const [parkAssist, setParkAssist] = useState(true);

  return (
    <div className="space-y-1">
      <SettingRow icon={<Shield size={16} />} label="Lane Keep Assist">
        <Toggle active={lka} onToggle={() => setLka(!lka)} />
      </SettingRow>
      <SettingRow icon={<Eye size={16} />} label="Blind Spot Monitor">
        <Toggle active={bsm} onToggle={() => setBsm(!bsm)} />
      </SettingRow>
      <SettingRow icon={<Shield size={16} />} label="Forward Collision Warning">
        <Toggle active={fcw} onToggle={() => setFcw(!fcw)} />
      </SettingRow>
      <SettingRow icon={<Car size={16} />} label="Park Assist">
        <Toggle active={parkAssist} onToggle={() => setParkAssist(!parkAssist)} />
      </SettingRow>
    </div>
  );
};

const SystemSettings = () => (
  <div className="space-y-1">
    <SettingRow icon={<Languages size={16} />} label="Language">
      <span className="text-xs font-mono text-muted-foreground">English</span>
    </SettingRow>
    <SettingRow icon={<Clock size={16} />} label="Time Zone">
      <span className="text-xs font-mono text-muted-foreground">Auto</span>
    </SettingRow>
    <SettingRow icon={<Info size={16} />} label="Software Version">
      <span className="text-xs font-mono text-muted-foreground">v2.4.1</span>
    </SettingRow>
    <SettingRow icon={<RotateCcw size={16} />} label="Reset to Factory">
      <button className="text-xs font-mono text-destructive hover:underline">Reset</button>
    </SettingRow>
  </div>
);

export default SettingsAppView;
