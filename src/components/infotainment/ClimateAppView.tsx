import {
  Wind,
  CircleDot,
  Heater,
  Fan,
  Snowflake,
  RotateCcw,
  Minus,
  Plus,
  ChevronUp,
  ChevronDown,
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
  const [driverTemp, setDriverTemp] = useState(climate.temp);
  const [passengerTemp, setPassengerTemp] = useState(climate.temp);

  const setTemp = (side: "driver" | "passenger", delta: number) => {
    if (climate.zones === "single") {
      const t = Math.max(16, Math.min(30, driverTemp + delta));
      setDriverTemp(t);
      setPassengerTemp(t);
      setClimate((c) => ({ ...c, temp: t }));
      return;
    }
    if (side === "driver") {
      const t = Math.max(16, Math.min(30, driverTemp + delta));
      setDriverTemp(t);
      setClimate((c) => ({ ...c, temp: t }));
    } else {
      setPassengerTemp((p) => Math.max(16, Math.min(30, p + delta)));
    }
  };

  const cycleAir = () => {
    const order: AirDirection[] = ["face", "both", "feet", "windshield"];
    setAirDirection(order[(order.indexOf(airDirection) + 1) % order.length]);
  };

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground/70 font-mono">
          Climate
        </h2>
        <div className="flex items-center gap-2">
          <ChipToggle label="Auto" active={autoMode} onClick={() => setAutoMode(!autoMode)} />
          <ChipToggle label="A/C" icon={<Snowflake size={12} />} active={acOn} onClick={() => setAcOn(!acOn)} accent="cool" />
          <ChipToggle label="Recirc" icon={<RotateCcw size={12} />} active={recirculation} onClick={() => setRecirculation(!recirculation)} />
          <ChipToggle
            label="Sync"
            active={climate.zones === "single"}
            onClick={() => setClimate((c) => ({ ...c, zones: c.zones === "dual" ? "single" : "dual" }))}
          />
        </div>
      </div>

      {/* Cabin diagram */}
      <div className="flex-1 flex items-stretch gap-4 min-h-0">
        {/* Fan slider (left side, like a vertical control) */}
        <div className="flex flex-col items-center justify-between bg-muted/20 rounded-2xl border border-border/30 px-3 py-4 w-16">
          <button
            onClick={() => setFanSpeed(Math.min(7, fanSpeed + 1))}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp size={18} />
          </button>
          <div className="flex-1 flex flex-col-reverse gap-1 py-2 w-full items-center">
            {[1, 2, 3, 4, 5, 6, 7].map((level) => (
              <button
                key={level}
                onClick={() => setFanSpeed(level)}
                className={`w-2 rounded-full transition-all ${
                  level <= fanSpeed ? "bg-primary h-3" : "bg-muted/60 h-2"
                }`}
                aria-label={`Fan ${level}`}
              />
            ))}
          </div>
          <button
            onClick={() => setFanSpeed(Math.max(0, fanSpeed - 1))}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronDown size={18} />
          </button>
          <div className="flex flex-col items-center mt-1">
            <Fan size={14} className={fanSpeed > 0 ? "text-primary" : "text-muted-foreground"} />
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5">{fanSpeed}</span>
          </div>
        </div>

        {/* Cabin (top-down) */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 rounded-[2.5rem] border border-border/40 bg-gradient-to-b from-muted/10 via-transparent to-muted/10 overflow-hidden">
            {/* Windshield band */}
            <button
              onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
              className={`absolute top-0 left-0 right-0 h-12 flex items-center justify-center gap-2 border-b border-border/40 transition-colors ${
                climate.defogger ? "bg-climate-cool/15 text-climate-cool" : "bg-muted/10 text-muted-foreground hover:text-foreground"
              }`}
              title="Front defogger"
            >
              <Wind size={14} />
              <span className="text-[10px] font-mono uppercase tracking-wider">Windshield</span>
            </button>

            {/* Vents row */}
            <button
              onClick={cycleAir}
              className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-3 px-3 py-1 rounded-lg bg-muted/30 border border-border/40 hover:border-primary/40 transition-colors"
              title="Air direction"
            >
              <VentIcon dir={airDirection} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {airDirection === "face" && "Face"}
                {airDirection === "feet" && "Feet"}
                {airDirection === "both" && "Face + Feet"}
                {airDirection === "windshield" && "Defrost"}
              </span>
            </button>

            {/* Steering wheel (driver-only indicator) */}
            <button
              onClick={() => setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))}
              className={`absolute top-[6.5rem] left-[22%] -translate-x-1/2 w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                climate.steeringHeat
                  ? "border-climate-warm/70 bg-climate-warm/15 text-climate-warm shadow-[0_0_20px_hsl(var(--climate-warm)/0.3)]"
                  : "border-border/50 bg-muted/20 text-muted-foreground hover:text-foreground"
              }`}
              title="Steering wheel heating"
            >
              <CircleDot size={22} />
            </button>

            {/* Seats */}
            <Seat
              side="left"
              label="Driver"
              temp={driverTemp}
              heat={climate.seatHeat}
              onTempUp={() => setTemp("driver", 0.5)}
              onTempDown={() => setTemp("driver", -0.5)}
              onHeat={() => setClimate((c) => ({ ...c, seatHeat: (c.seatHeat + 1) % 4 }))}
            />
            <Seat
              side="right"
              label="Passenger"
              temp={climate.zones === "single" ? driverTemp : passengerTemp}
              heat={climate.seatHeat}
              dimmed={climate.zones === "single"}
              onTempUp={() => setTemp("passenger", 0.5)}
              onTempDown={() => setTemp("passenger", -0.5)}
              onHeat={() => setClimate((c) => ({ ...c, seatHeat: (c.seatHeat + 1) % 4 }))}
            />

            {/* Rear window defog */}
            <button
              onClick={() => setRearDefogger(!rearDefogger)}
              className={`absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center gap-2 border-t border-border/40 transition-colors ${
                rearDefogger ? "bg-climate-cool/15 text-climate-cool" : "bg-muted/10 text-muted-foreground hover:text-foreground"
              }`}
              title="Rear defogger"
            >
              <Wind size={14} className="rotate-180" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Rear Defog</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 font-mono text-center">
        Dial: Rotate = Temp • L/R = Zones • Up = Steering • Down = Defog • Center = Sync
      </p>
    </div>
  );
};

/* ---------- Sub-components ---------- */

const ChipToggle = ({
  label,
  icon,
  active,
  onClick,
  accent,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  accent?: "cool" | "warm";
}) => {
  const activeColor =
    accent === "cool"
      ? "bg-climate-cool/15 text-climate-cool border-climate-cool/40"
      : accent === "warm"
        ? "bg-climate-warm/15 text-climate-warm border-climate-warm/40"
        : "bg-primary/15 text-primary border-primary/40";
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider border transition-colors ${
        active ? activeColor : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

const Seat = ({
  side,
  label,
  temp,
  heat,
  dimmed,
  onTempUp,
  onTempDown,
  onHeat,
}: {
  side: "left" | "right";
  label: string;
  temp: number;
  heat: number;
  dimmed?: boolean;
  onTempUp: () => void;
  onTempDown: () => void;
  onHeat: () => void;
}) => {
  const positionClass = side === "left" ? "left-[10%]" : "right-[10%]";
  return (
    <div
      className={`absolute top-[11rem] ${positionClass} flex flex-col items-center gap-2 transition-opacity ${
        dimmed ? "opacity-50" : ""
      }`}
    >
      {/* Temp readout */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onTempDown}
          className="w-6 h-6 rounded-full bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center"
        >
          <Minus size={12} />
        </button>
        <div className="flex flex-col items-center min-w-[52px]">
          <span className="text-2xl font-bold font-mono text-climate-warm leading-none">
            {temp}°
          </span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
        <button
          onClick={onTempUp}
          className="w-6 h-6 rounded-full bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Seat shape */}
      <button
        onClick={onHeat}
        className={`relative w-20 h-20 rounded-t-3xl rounded-b-xl border-2 flex flex-col items-center justify-end pb-2 transition-all ${
          heat > 0
            ? "border-climate-warm/60 bg-climate-warm/10 text-climate-warm"
            : "border-border/50 bg-muted/20 text-muted-foreground hover:text-foreground"
        }`}
        title={`Seat heating: ${heat}`}
      >
        {/* Headrest */}
        <div
          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full ${
            heat > 0 ? "bg-climate-warm/40" : "bg-muted/50"
          }`}
        />
        <Heater size={18} />
        <div className="flex gap-0.5 mt-1">
          {[1, 2, 3].map((lvl) => (
            <div
              key={lvl}
              className={`w-1.5 h-1 rounded-full ${
                lvl <= heat ? "bg-climate-warm" : "bg-muted/50"
              }`}
            />
          ))}
        </div>
      </button>
    </div>
  );
};

const VentIcon = ({ dir }: { dir: AirDirection }) => {
  const base = "text-primary";
  if (dir === "face")
    return (
      <div className="flex flex-col items-center">
        <ChevronUp size={14} className={base} />
        <div className="w-4 h-0.5 bg-primary/70 rounded" />
      </div>
    );
  if (dir === "feet")
    return (
      <div className="flex flex-col items-center">
        <div className="w-4 h-0.5 bg-primary/70 rounded" />
        <ChevronDown size={14} className={base} />
      </div>
    );
  if (dir === "both")
    return (
      <div className="flex flex-col items-center">
        <ChevronUp size={12} className={base} />
        <div className="w-4 h-0.5 bg-primary/70 rounded" />
        <ChevronDown size={12} className={base} />
      </div>
    );
  return <Wind size={14} className={base} />;
};

export default ClimateAppView;
