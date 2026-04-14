import {
  Thermometer,
  Wind,
  CircleDot,
  Heater,
  Columns2,
  Square,
  Fan,
  Snowflake,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Car,
  Gauge,
  Power,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";
import { useState } from "react";

type AirDirection = "face" | "feet" | "both" | "windshield";

const ClimateAppView = () => {
  const { climate, setClimate } = useInfotainment();
  const [fanSpeed, setFanSpeed] = useState(3);
  const [acOn, setAcOn] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  const [recirculation, setRecirculation] = useState(false);
  const [rearDefogger, setRearDefogger] = useState(false);
  const [airDirection, setAirDirection] = useState<AirDirection>("face");

  const airDirections: { id: AirDirection; label: string }[] = [
    { id: "face", label: "Face" },
    { id: "feet", label: "Feet" },
    { id: "both", label: "Both" },
    { id: "windshield", label: "W/S" },
  ];

  return (
    <div className="flex flex-col h-full p-6 gap-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide uppercase text-foreground/80 font-mono">
          Climate Control
        </h2>
        <button
          onClick={() => setAutoMode(!autoMode)}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
            autoMode
              ? "bg-primary/20 text-primary border border-primary/40"
              : "bg-muted/40 text-muted-foreground border border-border/40"
          }`}
        >
          Auto
        </button>
      </div>

      {/* Temperature + Zones */}
      <div className="flex items-center justify-center gap-8">
        {/* Left zone */}
        <div className={`flex flex-col items-center gap-1 transition-opacity ${climate.zones === "dual" && climate.activeZone === "right" ? "opacity-40" : ""}`}>
          <span className="text-[10px] text-muted-foreground font-mono uppercase">Driver</span>
          <span className="text-5xl font-bold font-mono text-climate-warm">{climate.temp}°</span>
        </div>

        {/* Zone toggle */}
        <button
          onClick={() => setClimate((c) => ({ ...c, zones: c.zones === "dual" ? "single" : "dual" }))}
          className="flex flex-col items-center gap-1"
        >
          {climate.zones === "dual" ? <Columns2 size={20} className="text-primary" /> : <Square size={20} className="text-muted-foreground" />}
          <span className="text-[9px] font-mono text-muted-foreground">{climate.zones === "dual" ? "DUAL" : "SYNC"}</span>
        </button>

        {/* Right zone (only in dual) */}
        {climate.zones === "dual" && (
          <div className={`flex flex-col items-center gap-1 transition-opacity ${climate.activeZone === "left" ? "opacity-40" : ""}`}>
            <span className="text-[10px] text-muted-foreground font-mono uppercase">Passenger</span>
            <span className="text-5xl font-bold font-mono text-climate-warm">{climate.temp}°</span>
          </div>
        )}
      </div>

      {/* Fan Speed */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Fan size={16} className={fanSpeed > 0 ? "text-primary" : "text-muted-foreground"} />
            <span className="text-xs font-mono text-muted-foreground uppercase">Fan Speed</span>
          </div>
          <span className="text-sm font-mono font-semibold">{fanSpeed}</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((level) => (
            <button
              key={level}
              onClick={() => setFanSpeed(level)}
              className={`flex-1 h-2 rounded-full transition-colors ${
                level <= fanSpeed ? "bg-primary" : "bg-muted/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Air Direction */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUp size={16} className="text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground uppercase">Air Direction</span>
        </div>
        <div className="flex gap-2">
          {airDirections.map((dir) => (
            <button
              key={dir.id}
              onClick={() => setAirDirection(dir.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                airDirection === dir.id
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-muted/40 text-muted-foreground border border-border/30"
              }`}
            >
              {dir.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-3 gap-3">
        <ToggleCard
          icon={<Snowflake size={20} />}
          label="A/C"
          active={acOn}
          onToggle={() => setAcOn(!acOn)}
          color="text-climate-cool"
        />
        <ToggleCard
          icon={<RotateCcw size={20} />}
          label="Recirc"
          active={recirculation}
          onToggle={() => setRecirculation(!recirculation)}
          color="text-primary"
        />
        <ToggleCard
          icon={<Wind size={20} />}
          label="Front Defog"
          active={climate.defogger}
          onToggle={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
          color="text-climate-cool"
        />
        <ToggleCard
          icon={<Car size={20} />}
          label="Rear Defog"
          active={rearDefogger}
          onToggle={() => setRearDefogger(!rearDefogger)}
          color="text-climate-cool"
        />
        <ToggleCard
          icon={<Heater size={20} />}
          label={`Seat Heat ${climate.seatHeat > 0 ? climate.seatHeat : ""}`}
          active={climate.seatHeat > 0}
          onToggle={() => setClimate((c) => ({ ...c, seatHeat: (c.seatHeat + 1) % 4 }))}
          color="text-climate-warm"
        />
        <ToggleCard
          icon={<CircleDot size={20} />}
          label="Steering"
          active={climate.steeringHeat}
          onToggle={() => setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))}
          color="text-climate-warm"
        />
      </div>

      <p className="text-[10px] text-muted-foreground/60 font-mono text-center">
        Control Dial: Rotate = Temp • Left/Right = Zones • Up = Steering • Down = Defog • Center = Sync
      </p>
    </div>
  );
};

const ToggleCard = ({
  icon,
  label,
  active,
  onToggle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
  color: string;
}) => (
  <button
    onClick={onToggle}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
      active
        ? "bg-muted/60 border-border/60"
        : "bg-muted/20 border-border/20"
    }`}
  >
    <div className={active ? color : "text-muted-foreground/40"}>{icon}</div>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">{label}</span>
  </button>
);

export default ClimateAppView;
