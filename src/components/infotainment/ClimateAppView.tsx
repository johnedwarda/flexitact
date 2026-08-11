import {
  Wind,
  CircleDot,
  Heater,
  Snowflake,
  RotateCcw,
  Minus,
  Plus,
  ChevronUp,
  ChevronDown,
  Thermometer,
} from "lucide-react";
import { useInfotainment, type ClimateZone } from "./InfotainmentContext";

type AirDirection = "face" | "feet" | "both" | "windshield";

const ClimateAppView = () => {
  const { climate, setClimate } = useInfotainment();

  const clampTemp = (v: number) => Math.max(16, Math.min(30, v));

  const adjustTemp = (delta: number) => {
    setClimate((c) => {
      const t = clampTemp(c.temp + delta);
      return { ...c, temp: t, passengerTemp: t, rearTemp: t };
    });
  };

  const setActiveZone = (zone: ClimateZone) =>
    setClimate((c) => ({ ...c, activeZone: zone }));

  const cycleSeatHeat = (target: "driver" | "passenger" | 0 | 1 | 2) => {
    setClimate((c) => {
      if (target === "driver" || target === "passenger") {
        return {
          ...c,
          frontSeatHeat: {
            ...c.frontSeatHeat,
            [target]: (c.frontSeatHeat[target] + 1) % 4,
          },
        };
      }
      const next: [number, number, number] = [...c.rearSeatHeat];
      next[target] = (next[target] + 1) % 4;
      return { ...c, rearSeatHeat: next };
    });
  };

  const cycleAir = () => {
    const order: AirDirection[] = ["face", "both", "feet", "windshield"];
    setClimate((c) => ({
      ...c,
      airDirection: order[(order.indexOf(c.airDirection) + 1) % order.length],
    }));
  };

  return (
    <div className="flex flex-col h-full px-5 pt-3 pb-5 gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex h-6 items-center gap-3">
          <Thermometer size={18} className="text-muted-foreground" />
          <h2 className="text-base font-mono uppercase tracking-widest text-muted-foreground">
            Climate
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ChipToggle
            label="Auto"
            active={climate.autoMode}
            onClick={() => setClimate((c) => ({ ...c, autoMode: !c.autoMode }))}
          />
          <ChipToggle
            label="A/C"
            icon={<Snowflake size={12} />}
            active={climate.acOn}
            onClick={() => setClimate((c) => ({ ...c, acOn: !c.acOn }))}
            accent="cool"
          />
          <ChipToggle
            label="Auto"
            active={climate.autoMode}
            onClick={() => setClimate((c) => ({ ...c, autoMode: !c.autoMode }))}
          />
          <ChipToggle
            label="A/C"
            icon={<Snowflake size={12} />}
            active={climate.acOn}
            onClick={() => setClimate((c) => ({ ...c, acOn: !c.acOn }))}
            accent="cool"
          />
          <ChipToggle
            label="Recirc"
            icon={<RotateCcw size={12} />}
            active={climate.recirculation}
            onClick={() =>
              setClimate((c) => ({ ...c, recirculation: !c.recirculation }))
            }
          />
          <FanStepper
            value={climate.fanSpeed}
            onChange={(v) => setClimate((c) => ({ ...c, fanSpeed: v }))}
          />
          <button
            onClick={cycleAir}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider border bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground"
            title="Air direction"
          >
            <VentIcon dir={climate.airDirection} />
            <span>
              {climate.airDirection === "face" && "Face"}
              {climate.airDirection === "feet" && "Feet"}
              {climate.airDirection === "both" && "Face+Feet"}
              {climate.airDirection === "windshield" && "Defrost"}
            </span>
          </button>
        </div>
      </div>

      {/* Cabin illustration + overlaid controls, with side temperature control */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center gap-6">
        <div className="relative h-full max-h-full aspect-[1409/768] flex-shrink">
          {/* Interior line-art illustration (inverted for the dark theme) */}
          <img
            src={cabinInterior.url}
            alt="Car cabin interior"
            className="absolute inset-0 w-full h-full object-contain opacity-40 invert pointer-events-none select-none"
            draggable={false}
          />

          {/* Windscreen defrost — across the windscreen */}
          <HotspotToggle
            style={{ left: "31%", top: "13%", transform: "translate(-50%,-50%)" }}
            active={climate.defogger}
            onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
            icon={<Wind size={13} />}
            label="Defrost"
            title="Front defogger"
          />

          {/* Rear window defog — rear-view mirror area */}
          <HotspotToggle
            style={{ left: "50%", top: "4%", transform: "translate(-50%,-50%)" }}
            active={climate.rearDefogger}
            onClick={() =>
              setClimate((c) => ({ ...c, rearDefogger: !c.rearDefogger }))
            }
            icon={<Wind size={13} className="rotate-180" />}
            label="Rear"
            title="Rear defogger"
          />

          {/* Mirror heating — on the side mirrors */}
          <HotspotToggle
            style={{ left: "10%", top: "29%", transform: "translate(-50%,-50%)" }}
            active={climate.mirrorHeat.left}
            onClick={() =>
              setClimate((c) => ({
                ...c,
                mirrorHeat: { ...c.mirrorHeat, left: !c.mirrorHeat.left },
              }))
            }
            icon={<Heater size={13} />}
            label="Mirror"
            title="Left mirror heating"
          />
          <HotspotToggle
            style={{ left: "89%", top: "29%", transform: "translate(-50%,-50%)" }}
            active={climate.mirrorHeat.right}
            onClick={() =>
              setClimate((c) => ({
                ...c,
                mirrorHeat: { ...c.mirrorHeat, right: !c.mirrorHeat.right },
              }))
            }
            icon={<Heater size={13} />}
            label="Mirror"
            title="Right mirror heating"
          />

          {/* Steering wheel heating — on the wheel */}
          <button
            onClick={() =>
              setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))
            }
            className={`absolute w-[7%] aspect-square rounded-full border-2 flex items-center justify-center transition-all ${
              climate.steeringHeat
                ? "border-climate-warm/70 bg-climate-warm/20 text-climate-warm shadow-[0_0_18px_hsl(var(--climate-warm)/0.4)]"
                : "border-border bg-background/70 text-muted-foreground hover:text-foreground"
            }`}
            style={{ left: "32%", top: "40%", transform: "translate(-50%,-50%)" }}
            title="Steering wheel heating"
          >
            <CircleDot size={16} />
          </button>

          {/* Front seat heating — on the front seats */}
          <SeatHotspot
            label="Driver"
            heat={climate.frontSeatHeat.driver}
            active={climate.activeZone === "driver"}
            style={{ left: "30%", top: "86%", transform: "translate(-50%,-50%)" }}
            onHeat={() => cycleSeatHeat("driver")}
            onSelect={() => setActiveZone("driver")}
          />
          <SeatHotspot
            label="Passenger"
            heat={climate.frontSeatHeat.passenger}
            active={climate.activeZone === "passenger"}
            style={{ left: "64%", top: "86%", transform: "translate(-50%,-50%)" }}
            onHeat={() => cycleSeatHeat("passenger")}
            onSelect={() => setActiveZone("passenger")}
          />

          {/* Rear seat heating — on the rear headrests / bench */}
          <SeatHotspot
            label="Rear L"
            heat={climate.rearSeatHeat[0]}
            active={climate.activeZone === "rearL"}
            style={{ left: "6%", top: "82%", transform: "translate(-50%,-50%)" }}
            onHeat={() => cycleSeatHeat(0)}
            onSelect={() => setActiveZone("rearL")}
          />
          <SeatHotspot
            label="Rear C"
            heat={climate.rearSeatHeat[1]}
            active={climate.activeZone === "rearC"}
            style={{ left: "50%", top: "70%", transform: "translate(-50%,-50%)" }}
            onHeat={() => cycleSeatHeat(1)}
            onSelect={() => setActiveZone("rearC")}
          />
          <SeatHotspot
            label="Rear R"
            heat={climate.rearSeatHeat[2]}
            active={climate.activeZone === "rearR"}
            style={{ left: "94%", top: "82%", transform: "translate(-50%,-50%)" }}
            onHeat={() => cycleSeatHeat(2)}
            onSelect={() => setActiveZone("rearR")}
          />
        </div>

        {/* Side temperature control */}
        <div className="flex flex-col items-center justify-center gap-3 py-2 px-4 rounded-2xl bg-muted/20 border border-border/40 min-w-[120px]">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.25em]">
            Cabin Temp
          </span>
          <button
            onClick={() => adjustTemp(0.5)}
            className="w-11 h-11 rounded-full bg-muted/40 hover:bg-muted/70 border border-border text-muted-foreground hover:text-climate-warm flex items-center justify-center transition-colors"
            aria-label="Increase temperature"
          >
            <Plus size={20} />
          </button>
          <span className="text-5xl font-bold font-mono text-climate-warm leading-none">
            {climate.temp.toFixed(1)}°
          </span>
          <button
            onClick={() => adjustTemp(-0.5)}
            className="w-11 h-11 rounded-full bg-muted/40 hover:bg-muted/70 border border-border text-muted-foreground hover:text-climate-cool flex items-center justify-center transition-colors"
            aria-label="Decrease temperature"
          >
            <Minus size={20} />
          </button>
        </div>
      </div>



      <p className="text-[10px] text-muted-foreground/60 font-mono text-center">
        Dial: Rotate = Temp • L/R = Cycle Seats • Up = Steering • Down = Defrost • Center = Auto
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
        active
          ? activeColor
          : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

const FanStepper = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg border border-border/40 bg-muted/30">
    <button
      onClick={() => onChange(Math.max(0, value - 1))}
      className="text-muted-foreground hover:text-foreground"
      title="Fan slower"
    >
      <Minus size={12} />
    </button>
    <div className="flex items-end gap-0.5 px-1">
      {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
        <div
          key={lvl}
          className={`w-1 rounded-sm transition-all ${
            lvl <= value ? "bg-primary" : "bg-muted/60"
          }`}
          style={{ height: `${4 + lvl}px` }}
        />
      ))}
    </div>
    <span className="text-[10px] font-mono text-muted-foreground w-3 text-center">
      {value}
    </span>
    <button
      onClick={() => onChange(Math.min(7, value + 1))}
      className="text-muted-foreground hover:text-foreground"
      title="Fan faster"
    >
      <Plus size={12} />
    </button>
  </div>
);

const MirrorTab = ({
  side,
  active,
  onClick,
}: {
  side: "left" | "right";
  active: boolean;
  onClick: () => void;
}) => {
  const pos =
    side === "left" ? "left-[-2%] top-[28%]" : "right-[-2%] top-[28%]";
  return (
    <button
      onClick={onClick}
      className={`absolute ${pos} w-[6%] aspect-[2/3] rounded-md border flex flex-col items-center justify-center gap-0.5 transition-all ${
        active
          ? "bg-climate-warm/20 border-climate-warm/60 text-climate-warm shadow-[0_0_12px_hsl(var(--climate-warm)/0.35)]"
          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
      }`}
      title={`${side === "left" ? "Left" : "Right"} mirror heating`}
    >
      <Heater size={10} />
      <span className="text-[7px] font-mono uppercase">
        {side === "left" ? "L" : "R"}
      </span>
    </button>
  );
};

const CarSeat = ({
  label,
  heat,
  active,
  compact,
  position,
  onHeat,
  onSelect,
}: {
  label: string;
  heat: number;
  active: boolean;
  compact?: boolean;
  position: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    width: string;
    height: string;
  };
  onHeat: () => void;
  onSelect: () => void;
}) => {
  return (
    <div
      onClick={onSelect}
      style={position}
      className="absolute cursor-pointer"
    >
      {/* Seat shape: backrest (top) + cushion (bottom), top-down view */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onHeat();
        }}
        className={`relative w-full h-full rounded-[1.5rem] border-2 flex flex-col items-center justify-end overflow-hidden transition-all ${
          heat > 0
            ? "border-climate-warm/60 bg-gradient-to-b from-climate-warm/15 to-climate-warm/5 text-climate-warm"
            : "border-border bg-gradient-to-b from-muted/40 to-muted/10 text-muted-foreground hover:text-foreground"
        } ${active ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""}`}
        title={`${label} seat heating: ${heat}`}
      >
        {/* Headrest (top of seat in top-down view) */}
        <div
          className={`absolute top-1 left-1/2 -translate-x-1/2 w-[55%] h-[18%] rounded-full ${
            heat > 0 ? "bg-climate-warm/40" : "bg-muted-foreground/30"
          }`}
        />
        {/* Backrest divider line */}
        <div
          className={`absolute top-[28%] left-[10%] right-[10%] h-px ${
            heat > 0 ? "bg-climate-warm/30" : "bg-border"
          }`}
        />
        {/* Cushion side bolsters */}
        <div
          className={`absolute bottom-[10%] left-[6%] w-[14%] h-[40%] rounded-full ${
            heat > 0 ? "bg-climate-warm/15" : "bg-muted/40"
          }`}
        />
        <div
          className={`absolute bottom-[10%] right-[6%] w-[14%] h-[40%] rounded-full ${
            heat > 0 ? "bg-climate-warm/15" : "bg-muted/40"
          }`}
        />
      </button>

      {/* Label + heat dots (centered on cushion) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1 mt-[18%]">
        <span
          className={`${
            compact ? "text-[8px]" : "text-[9px]"
          } font-mono text-foreground/70 uppercase tracking-wider`}
        >
          {label}
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3].map((lvl) => (
            <div
              key={lvl}
              className={`${compact ? "w-1 h-1" : "w-1.5 h-1.5"} rounded-full ${
                lvl <= heat ? "bg-climate-warm" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const VentIcon = ({ dir }: { dir: AirDirection }) => {
  const base = "text-primary";
  if (dir === "face")
    return (
      <div className="flex flex-col items-center">
        <ChevronUp size={12} className={base} />
        <div className="w-3 h-0.5 bg-primary/70 rounded" />
      </div>
    );
  if (dir === "feet")
    return (
      <div className="flex flex-col items-center">
        <div className="w-3 h-0.5 bg-primary/70 rounded" />
        <ChevronDown size={12} className={base} />
      </div>
    );
  if (dir === "both")
    return (
      <div className="flex flex-col items-center">
        <ChevronUp size={10} className={base} />
        <div className="w-3 h-0.5 bg-primary/70 rounded" />
        <ChevronDown size={10} className={base} />
      </div>
    );
  return <Wind size={12} className={base} />;
};

export default ClimateAppView;
