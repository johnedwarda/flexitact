import {
  Wind,
  CircleDot,
  Heater,
  Snowflake,
  RotateCcw,
  Minus,
  Plus,
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
    <div className="flex flex-col h-full px-5 pt-3 pb-4 gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex h-6 items-center gap-3">
        <Thermometer size={18} className="text-muted-foreground" />
        <h2 className="text-base font-mono uppercase tracking-widest text-muted-foreground">
          Climate
        </h2>
      </div>

      {/* Drawn cabin (top view) with all controls positioned in context */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <CabinDrawing />

          {/* ---- Front glass zone: defrost + vents ---- */}
          <Hotspot
            style={{ left: "9%", top: "50%" }}
            active={climate.defogger}
            onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
            icon={<Wind size={13} />}
            label="Defrost"
            title="Windscreen defrost"
            tone="cool"
          />

          {/* Dash vents: air direction + fan */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
            style={{ left: "22%", top: "50%" }}
          >
            <button
              onClick={cycleAir}
              title="Air direction"
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-background/70 text-muted-foreground hover:text-foreground transition-colors"
            >
              <VentIcon dir={climate.airDirection} />
              <span className="text-[9px] font-mono uppercase tracking-wider">
                {climate.airDirection === "face" && "Face"}
                {climate.airDirection === "feet" && "Feet"}
                {climate.airDirection === "both" && "Face+Feet"}
                {climate.airDirection === "windshield" && "Screen"}
              </span>
            </button>
            <FanStepper
              value={climate.fanSpeed}
              onChange={(v) => setClimate((c) => ({ ...c, fanSpeed: v }))}
            />
          </div>

          {/* ---- Mirrors ---- */}
          <Hotspot
            style={{ left: "20%", top: "7%" }}
            active={climate.mirrorHeat.left}
            onClick={() =>
              setClimate((c) => ({
                ...c,
                mirrorHeat: { ...c.mirrorHeat, left: !c.mirrorHeat.left },
              }))
            }
            icon={<Heater size={12} />}
            label="Mirror"
            title="Left mirror heating"
            tone="warm"
          />
          <Hotspot
            style={{ left: "20%", top: "93%" }}
            active={climate.mirrorHeat.right}
            onClick={() =>
              setClimate((c) => ({
                ...c,
                mirrorHeat: { ...c.mirrorHeat, right: !c.mirrorHeat.right },
              }))
            }
            icon={<Heater size={12} />}
            label="Mirror"
            title="Right mirror heating"
            tone="warm"
          />

          {/* ---- Steering wheel ---- */}
          <button
            onClick={() =>
              setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))
            }
            title="Steering wheel heating"
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-[7.5%] aspect-square rounded-full flex items-center justify-center transition-all ${
              climate.steeringHeat
                ? "bg-climate-warm/20 text-climate-warm shadow-[0_0_18px_hsl(var(--climate-warm)/0.4)]"
                : "bg-background/70 text-muted-foreground hover:text-foreground"
            }`}
            style={{ left: "31%", top: "27%" }}
          >
            <CircleDot size={16} />
          </button>

          {/* ---- Front seats ---- */}
          <SeatHotspot
            label="Driver"
            heat={climate.frontSeatHeat.driver}
            active={climate.activeZone === "driver"}
            style={{ left: "42%", top: "27%" }}
            onHeat={() => cycleSeatHeat("driver")}
            onSelect={() => setActiveZone("driver")}
          />
          <SeatHotspot
            label="Front R"
            heat={climate.frontSeatHeat.passenger}
            active={climate.activeZone === "passenger"}
            style={{ left: "42%", top: "73%" }}
            onHeat={() => cycleSeatHeat("passenger")}
            onSelect={() => setActiveZone("passenger")}
          />

          {/* ---- Centre console: cabin temperature + modes ---- */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
            style={{ left: "43.5%", top: "50%" }}
          >
            <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-[0.25em]">
              Cabin
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustTemp(-0.5)}
                className="w-7 h-7 rounded-full bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-climate-cool flex items-center justify-center transition-colors"
                aria-label="Decrease temperature"
              >
                <Minus size={14} />
              </button>
              <span className="text-2xl font-bold font-mono text-climate-warm leading-none tabular-nums">
                {climate.temp.toFixed(1)}°
              </span>
              <button
                onClick={() => adjustTemp(0.5)}
                className="w-7 h-7 rounded-full bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-climate-warm flex items-center justify-center transition-colors"
                aria-label="Increase temperature"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <ChipToggle
                label="Auto"
                active={climate.autoMode}
                onClick={() =>
                  setClimate((c) => ({ ...c, autoMode: !c.autoMode }))
                }
              />
              <ChipToggle
                label="A/C"
                icon={<Snowflake size={11} />}
                active={climate.acOn}
                onClick={() => setClimate((c) => ({ ...c, acOn: !c.acOn }))}
                accent="cool"
              />
              <ChipToggle
                label="Recirc"
                icon={<RotateCcw size={11} />}
                active={climate.recirculation}
                onClick={() =>
                  setClimate((c) => ({ ...c, recirculation: !c.recirculation }))
                }
              />
            </div>
          </div>

          {/* ---- Rear seats ---- */}
          <SeatHotspot
            label="Rear L"
            heat={climate.rearSeatHeat[0]}
            active={climate.activeZone === "rearL"}
            style={{ left: "70%", top: "22%" }}
            onHeat={() => cycleSeatHeat(0)}
            onSelect={() => setActiveZone("rearL")}
          />
          <SeatHotspot
            label="Rear C"
            heat={climate.rearSeatHeat[1]}
            active={climate.activeZone === "rearC"}
            style={{ left: "70%", top: "50%" }}
            onHeat={() => cycleSeatHeat(1)}
            onSelect={() => setActiveZone("rearC")}
          />
          <SeatHotspot
            label="Rear R"
            heat={climate.rearSeatHeat[2]}
            active={climate.activeZone === "rearR"}
            style={{ left: "70%", top: "78%" }}
            onHeat={() => cycleSeatHeat(2)}
            onSelect={() => setActiveZone("rearR")}
          />

          {/* ---- Rear glass ---- */}
          <Hotspot
            style={{ left: "90%", top: "50%" }}
            active={climate.rearDefogger}
            onClick={() =>
              setClimate((c) => ({ ...c, rearDefogger: !c.rearDefogger }))
            }
            icon={<Wind size={13} className="rotate-180" />}
            label="Rear"
            title="Rear window defog"
            tone="cool"
          />
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 font-mono text-center">
        Dial: Rotate = Temp • L/R = Cycle Seats • Up = Steering • Down = Defrost • Center = Auto
      </p>
    </div>
  );
};

/* ---------- Drawn cabin (top view) ---------- */

const CabinDrawing = () => (
  <svg
    viewBox="0 0 1000 540"
    preserveAspectRatio="none"
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <g className="text-muted-foreground/45" strokeWidth={2}>
      {/* Body outline */}
      <path d="M60 270c0-92 14-152 34-176 18-22 62-32 130-36 78-5 420-5 560 0 74 3 130 10 150 30 18 18 26 78 26 182s-8 164-26 182c-20 20-76 27-150 30-140 5-482 5-560 0-68-4-112-14-130-36-20-24-34-84-34-176z" />
      {/* Windscreen */}
      <path d="M150 96c-16 22-24 96-24 174s8 152 24 174" />
      <path d="M196 118c-13 20-20 88-20 152s7 132 20 152" />
      {/* Dash line */}
      <path d="M232 150c-9 26-13 76-13 120s4 94 13 120" />
      {/* Rear glass */}
      <path d="M872 108c14 24 20 94 20 162s-6 138-20 162" />
      <path d="M826 130c12 22 17 86 17 140s-5 118-17 140" />
      {/* Wheel arches */}
      <path d="M250 46c40 0 60 14 60 32M250 494c40 0 60-14 60-32" />
      <path d="M760 46c-40 0-60 14-60 32M760 494c-40 0-60-14-60-32" />
      {/* Centre console */}
      <path d="M392 208h96a10 10 0 0 1 10 10v104a10 10 0 0 1-10 10h-96" />
    </g>

    {/* Seats */}
    <g className="text-muted-foreground/50" strokeWidth={2}>
      {/* front seats */}
      <rect x="376" y="96" width="112" height="96" rx="22" />
      <rect x="376" y="348" width="112" height="96" rx="22" />
      {/* rear bench */}
      <rect x="646" y="76" width="112" height="112" rx="20" />
      <rect x="646" y="214" width="112" height="112" rx="20" />
      <rect x="646" y="352" width="112" height="112" rx="20" />
    </g>

    {/* Steering wheel ring */}
    <g className="text-muted-foreground/50" strokeWidth={2}>
      <circle cx="310" cy="146" r="46" />
    </g>

  </svg>
);

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
      ? "bg-climate-cool/15 text-climate-cool"
      : accent === "warm"
        ? "bg-climate-warm/15 text-climate-warm"
        : "bg-primary/15 text-primary";
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono font-semibold uppercase tracking-wider transition-colors ${
        active
          ? activeColor
          : "bg-background/70 text-muted-foreground hover:text-foreground"
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
  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg border border-border/50 bg-background/70">
    <button
      onClick={() => onChange(Math.max(0, value - 1))}
      className="text-muted-foreground hover:text-foreground"
      title="Fan slower"
    >
      <Minus size={12} />
    </button>
    <div className="flex items-end gap-0.5 px-0.5">
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
    <button
      onClick={() => onChange(Math.min(7, value + 1))}
      className="text-muted-foreground hover:text-foreground"
      title="Fan faster"
    >
      <Plus size={12} />
    </button>
  </div>
);

const Hotspot = ({
  style,
  active,
  onClick,
  icon,
  label,
  title,
  tone = "cool",
}: {
  style: React.CSSProperties;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title: string;
  tone?: "cool" | "warm";
}) => (
    <button
      onClick={onClick}
      style={style}
      title={title}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
        active
          ? tone === "warm"
            ? "bg-climate-warm/20 text-climate-warm shadow-[0_0_14px_hsl(var(--climate-warm)/0.35)]"
            : "bg-climate-cool/20 text-climate-cool shadow-[0_0_14px_hsl(var(--climate-cool)/0.35)]"
          : "bg-background/70 text-muted-foreground hover:text-foreground"
      }`}
    >
    {icon}
    <span className="text-[9px] font-mono uppercase tracking-wider">{label}</span>
  </button>
);

const SeatHotspot = ({
  label,
  heat,
  active,
  style,
  onHeat,
  onSelect,
}: {
  label: string;
  heat: number;
  active: boolean;
  style: React.CSSProperties;
  onHeat: () => void;
  onSelect: () => void;
}) => (
    <button
      onClick={() => {
        onSelect();
        onHeat();
      }}
      style={style}
      title={`${label} seat heating: ${heat}`}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${
        heat > 0
          ? "bg-climate-warm/20 text-climate-warm shadow-[0_0_14px_hsl(var(--climate-warm)/0.35)]"
          : "bg-background/70 text-muted-foreground hover:text-foreground"
      } ${active ? "ring-1 ring-primary/70" : ""}`}
    >
    <Heater size={14} />
    <span className="text-[8px] font-mono uppercase tracking-wider">{label}</span>
    <div className="flex gap-0.5">
      {[1, 2, 3].map((lvl) => (
        <div
          key={lvl}
          className={`w-1 h-1 rounded-full ${
            lvl <= heat ? "bg-climate-warm" : "bg-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  </button>
);

const VentIcon = ({ dir }: { dir: AirDirection }) => {
  const base = "text-current";
  if (dir === "windshield") return <Wind size={12} className={base} />;
  if (dir === "feet") return <Wind size={12} className={`${base} rotate-90`} />;
  if (dir === "both") return <Wind size={12} className={`${base} -rotate-45`} />;
  return <Wind size={12} className={base} />;
};

export default ClimateAppView;
