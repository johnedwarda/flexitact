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
  Unlock,
  RotateCcw,
  Languages,
  Clock,
  Palette,
  SlidersHorizontal,
  Battery,
  Lightbulb,
  Zap,
  Box,
  Square,
  Fan,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Droplets,
} from "lucide-react";

type SettingsCategory = "vehicle" | "display" | "sound" | "connectivity" | "navigation" | "battery" | "safety" | "system";

const CATEGORIES: { id: SettingsCategory; label: string; icon: typeof Monitor; description: string }[] = [
  { id: "vehicle", label: "Vehicle", icon: Car, description: "Controls, lights, locks, climate" },
  { id: "display", label: "Display", icon: Monitor, description: "Brightness, theme, layout" },
  { id: "sound", label: "Sound", icon: Volume2, description: "Audio, alerts, EQ" },
  { id: "connectivity", label: "Connectivity", icon: Wifi, description: "Wi-Fi, Bluetooth, hotspot" },
  { id: "navigation", label: "Navigation", icon: Navigation, description: "Maps, routes, POI" },
  { id: "battery", label: "Battery & Charging", icon: Battery, description: "Charge limit, schedule, precondition" },
  { id: "safety", label: "Safety & Driver Assist", icon: Shield, description: "ADAS, cameras, alerts" },
  { id: "system", label: "System", icon: Info, description: "Language, time, updates" },
];

const SettingsAppView = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("vehicle");
  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="flex flex-col h-full px-6 pt-3 pb-6">
      <header className="flex h-6 items-center gap-3">
        <SlidersHorizontal size={18} className="text-muted-foreground" />
        <h1 className="text-base font-mono uppercase tracking-widest text-muted-foreground">Settings</h1>
      </header>
      <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <div className="w-52 border-r border-border/30 bg-card/30 overflow-y-auto py-2">
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
            <span className="text-xs font-mono whitespace-nowrap">{cat.label}</span>
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
        {activeCategory === "battery" && <BatterySettings />}
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
  const [locked, setLocked] = useState(true);
  const [chargeOpen, setChargeOpen] = useState(false);
  const [frunkOpen, setFrunkOpen] = useState(false);
  const [trunkOpen, setTrunkOpen] = useState(false);
  const [domeOn, setDomeOn] = useState(false);
  const [windowsOpen, setWindowsOpen] = useState(false);
  const [mirrorsFolded, setMirrorsFolded] = useState(false);
  const [ventOn, setVentOn] = useState(false);

  const ControlPill = ({
    icon: Icon,
    label,
    active,
    onClick,
  }: {
    icon: typeof Lock;
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 w-[72px] h-[72px] rounded-2xl border transition-all ${
        active
          ? "bg-primary/15 border-primary/60 text-primary"
          : "bg-card/40 border-border/40 text-muted-foreground hover:bg-muted/30"
      }`}
    >
      <Icon size={22} />
      <span className="text-[9px] font-mono uppercase tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Tesla-style quick controls grid */}
      <div className="grid grid-cols-4 gap-3">
        <ControlPill
          icon={locked ? Lock : Unlock}
          label={locked ? "Lock" : "Unlock"}
          active={!locked}
          onClick={() => setLocked(!locked)}
        />
        <ControlPill
          icon={Lightbulb}
          label="Dome"
          active={domeOn}
          onClick={() => setDomeOn(!domeOn)}
        />
        <ControlPill
          icon={Zap}
          label="Charge"
          active={chargeOpen}
          onClick={() => setChargeOpen(!chargeOpen)}
        />
        <ControlPill
          icon={Fan}
          label="Vent"
          active={ventOn}
          onClick={() => setVentOn(!ventOn)}
        />
      </div>

      {/* Car silhouette with interactive zones */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="relative w-64 h-[280px]">
          {/* Car body */}
          <div className="absolute inset-4 rounded-[40px] bg-card/40 border border-border/40 flex flex-col items-center justify-between py-6">
            {/* Front trunk area */}
            <button
              onClick={() => setFrunkOpen(!frunkOpen)}
              className={`w-20 h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                frunkOpen
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/30 text-muted-foreground hover:border-border/60"
              }`}
            >
              <Box size={16} />
            </button>

            {/* Cabin / doors */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setMirrorsFolded(!mirrorsFolded)}
                className={`w-10 h-24 rounded-lg border transition-all flex items-center justify-center ${
                  mirrorsFolded
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/30 text-muted-foreground hover:border-border/60"
                }`}
              >
                <Square size={14} />
              </button>
              <div className="w-28 h-36 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-center">
                <Car size={40} className="text-muted-foreground/40" />
              </div>
              <button
                onClick={() => setMirrorsFolded(!mirrorsFolded)}
                className={`w-10 h-24 rounded-lg border transition-all flex items-center justify-center ${
                  mirrorsFolded
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/30 text-muted-foreground hover:border-border/60"
                }`}
              >
                <Square size={14} />
              </button>
            </div>

            {/* Rear trunk area */}
            <button
              onClick={() => setTrunkOpen(!trunkOpen)}
              className={`w-24 h-12 rounded-xl border-2 transition-all flex items-center justify-center ${
                trunkOpen
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/30 text-muted-foreground hover:border-border/60"
              }`}
            >
              <ArrowUp size={16} />
            </button>
          </div>

          {/* Zone labels */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Frunk</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Trunk</span>
          <span className="absolute top-1/2 left-1 text-[9px] font-mono text-muted-foreground uppercase tracking-wider -rotate-90 origin-center">Mirror</span>
          <span className="absolute top-1/2 right-1 text-[9px] font-mono text-muted-foreground uppercase tracking-wider rotate-90 origin-center">Mirror</span>
        </div>
      </div>

      {/* Secondary controls */}
      <div className="grid grid-cols-3 gap-3">
        <ControlPill
          icon={windowsOpen ? ArrowDown : ArrowUp}
          label="Windows"
          active={windowsOpen}
          onClick={() => setWindowsOpen(!windowsOpen)}
        />
        <ControlPill
          icon={Droplets}
          label="Wipers"
          active={false}
          onClick={() => {}}
        />
        <ControlPill
          icon={Thermometer}
          label="Climate"
          active={false}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

const BatterySettings = () => {
  const [chargeLimit, setChargeLimit] = useState(80);
  const [scheduledCharging, setScheduledCharging] = useState(true);
  const [precondition, setPrecondition] = useState(true);
  const [chargingMode, setChargingMode] = useState<"Daily" | "Trip">("Daily");

  return (
    <div className="space-y-1">
      <SettingRow icon={<Battery size={16} />} label="Battery Level">
        <span className="text-xs font-mono text-muted-foreground">74%</span>
      </SettingRow>
      <SettingRow icon={<Gauge size={16} />} label="Charge Limit">
        <SliderRow value={chargeLimit} onChange={setChargeLimit} min={50} max={100} />
      </SettingRow>
      <SettingRow icon={<Clock size={16} />} label="Scheduled Charging">
        <Toggle active={scheduledCharging} onToggle={() => setScheduledCharging(!scheduledCharging)} />
      </SettingRow>
      <SettingRow icon={<Sun size={16} />} label="Precondition Cabin">
        <Toggle active={precondition} onToggle={() => setPrecondition(!precondition)} />
      </SettingRow>
      <SettingRow icon={<Car size={16} />} label="Charging Mode">
        <div className="flex items-center gap-2">
          {(["Daily", "Trip"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setChargingMode(mode)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono border ${
                chargingMode === mode
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border/60 text-muted-foreground hover:bg-muted/30"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
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
