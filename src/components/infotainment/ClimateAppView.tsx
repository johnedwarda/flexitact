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
    <div className="flex flex-col h-full p-5 gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground/70 font-mono">
          Climate
        </h2>
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

      {/* Big shared temperature readout / control */}
      <div className="flex items-center justify-center gap-4 py-1">
        <button
          onClick={() => adjustTemp(-0.5)}
          className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/70 border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          aria-label="Decrease temperature"
        >
          <Minus size={18} />
        </button>
        <div className="flex flex-col items-center min-w-[110px]">
          <span className="text-4xl font-bold font-mono text-climate-warm leading-none">
            {climate.temp.toFixed(1)}°
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mt-1">
            Cabin Temp
          </span>
        </div>
        <button
          onClick={() => adjustTemp(0.5)}
          className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/70 border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          aria-label="Increase temperature"
        >
          <Plus size={18} />
        </button>
      </div>

          <ChipToggle
            label="Rear Sync"
            active={climate.rearSync}
            onClick={() => setClimate((c) => ({ ...c, rearSync: !c.rearSync }))}
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

      {/* Cabin (top-down car) */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        <div className="relative h-full aspect-[5/8] max-h-full">
          {/* Car silhouette via SVG */}
          <svg
            viewBox="0 0 500 800"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(220 18% 14%)" />
                <stop offset="50%" stopColor="hsl(220 16% 11%)" />
                <stop offset="100%" stopColor="hsl(220 18% 14%)" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(205 60% 30% / 0.35)" />
                <stop offset="100%" stopColor="hsl(205 60% 20% / 0.15)" />
              </linearGradient>
            </defs>

            {/* Car body outline (rounded teardrop-ish shape, top-down) */}
            <path
              d="M 250 10
                 C 360 10, 460 90, 470 250
                 L 470 600
                 C 460 740, 360 790, 250 790
                 C 140 790, 40 740, 30 600
                 L 30 250
                 C 40 90, 140 10, 250 10 Z"
              fill="url(#bodyGrad)"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />

            {/* Hood line */}
            <path
              d="M 80 180 C 150 150, 350 150, 420 180"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />

            {/* Windshield (glass) */}
            <path
              d="M 95 200 C 160 175, 340 175, 405 200 L 390 280 C 340 265, 160 265, 110 280 Z"
              fill="url(#glassGrad)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.9"
            />

            {/* Rear window (glass) */}
            <path
              d="M 110 600 C 160 585, 340 585, 390 600 L 405 680 C 340 660, 160 660, 95 680 Z"
              fill="url(#glassGrad)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.9"
            />

            {/* Center console / dashboard line under windshield */}
            <rect
              x="190"
              y="290"
              width="120"
              height="20"
              rx="6"
              fill="hsl(220 16% 9%)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.8"
            />

            {/* Center tunnel between front seats */}
            <rect
              x="225"
              y="320"
              width="50"
              height="170"
              rx="10"
              fill="hsl(220 16% 9%)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.85"
            />

            {/* B-pillar / door divider lines */}
            <line
              x1="30"
              y1="500"
              x2="65"
              y2="500"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              opacity="0.7"
            />
            <line
              x1="435"
              y1="500"
              x2="470"
              y2="500"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* Door panels - front */}
            <path
              d="M 30 280 L 65 285 L 65 495 L 30 495"
              fill="hsl(220 14% 12%)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.8"
            />
            <path
              d="M 470 280 L 435 285 L 435 495 L 470 495"
              fill="hsl(220 14% 12%)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.8"
            />
            {/* Door panels - rear */}
            <path
              d="M 30 505 L 65 505 L 65 690 L 30 685"
              fill="hsl(220 14% 12%)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.8"
            />
            <path
              d="M 470 505 L 435 505 L 435 690 L 470 685"
              fill="hsl(220 14% 12%)"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.8"
            />
          </svg>

          {/* Windshield defrost overlay button */}
          <button
            onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
            className={`absolute left-[20%] right-[20%] top-[24%] h-[8%] flex items-center justify-center gap-1.5 rounded-md transition-colors ${
              climate.defogger
                ? "bg-climate-cool/20 text-climate-cool ring-1 ring-climate-cool/50"
                : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/20"
            }`}
            title="Front defogger"
          >
            <Wind size={12} />
            <span className="text-[9px] font-mono uppercase tracking-wider">
              Defrost
            </span>
          </button>

          {/* Rear window defog overlay button */}
          <button
            onClick={() =>
              setClimate((c) => ({ ...c, rearDefogger: !c.rearDefogger }))
            }
            className={`absolute left-[20%] right-[20%] bottom-[16%] h-[7%] flex items-center justify-center gap-1.5 rounded-md transition-colors ${
              climate.rearDefogger
                ? "bg-climate-cool/20 text-climate-cool ring-1 ring-climate-cool/50"
                : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/20"
            }`}
            title="Rear defogger"
          >
            <Wind size={12} className="rotate-180" />
            <span className="text-[9px] font-mono uppercase tracking-wider">
              Rear Defog
            </span>
          </button>

          {/* Side mirrors (just outside body, near A-pillar) */}
          <MirrorTab
            side="left"
            active={climate.mirrorHeat.left}
            onClick={() =>
              setClimate((c) => ({
                ...c,
                mirrorHeat: { ...c.mirrorHeat, left: !c.mirrorHeat.left },
              }))
            }
          />
          <MirrorTab
            side="right"
            active={climate.mirrorHeat.right}
            onClick={() =>
              setClimate((c) => ({
                ...c,
                mirrorHeat: { ...c.mirrorHeat, right: !c.mirrorHeat.right },
              }))
            }
          />

          {/* Steering wheel — driver side, behind the dashboard */}
          <button
            onClick={() =>
              setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))
            }
            className={`absolute left-[22%] top-[34%] -translate-x-1/2 -translate-y-1/2 w-[14%] aspect-square rounded-full border-[3px] flex items-center justify-center transition-all ${
              climate.steeringHeat
                ? "border-climate-warm/70 bg-climate-warm/15 text-climate-warm shadow-[0_0_18px_hsl(var(--climate-warm)/0.4)]"
                : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
            }`}
            title="Steering wheel heating"
          >
            <CircleDot size={18} />
            <span className="absolute inset-0 rounded-full border border-border/40" />
          </button>

          {/* Driver seat */}
          <CarSeat
            zone="driver"
            label="Driver"
            temp={climate.temp}
            heat={climate.frontSeatHeat.driver}
            active={climate.activeZone === "driver"}
            position={{ left: "9%", top: "42%", width: "30%", height: "22%" }}
            onTempUp={() => adjustZoneTemp("driver", 0.5)}
            onTempDown={() => adjustZoneTemp("driver", -0.5)}
            onHeat={() => cycleSeatHeat("driver")}
            onSelect={() => setActiveZone("driver")}
          />

          {/* Passenger seat */}
          <CarSeat
            zone="passenger"
            label="Passenger"
            temp={passengerDisplayTemp}
            heat={climate.frontSeatHeat.passenger}
            active={climate.activeZone === "passenger"}
            dimmed={climate.zones === "single"}
            position={{ right: "9%", top: "42%", width: "30%", height: "22%" }}
            onTempUp={() => adjustZoneTemp("passenger", 0.5)}
            onTempDown={() => adjustZoneTemp("passenger", -0.5)}
            onHeat={() => cycleSeatHeat("passenger")}
            onSelect={() => setActiveZone("passenger")}
          />

          {/* Rear seats (bench: L / C / R) */}
          <CarSeat
            zone="rearL"
            label="Rear L"
            temp={climate.rearTemp}
            heat={climate.rearSeatHeat[0]}
            active={climate.activeZone === "rearL"}
            compact
            position={{ left: "9%", top: "70%", width: "23%", height: "16%" }}
            onTempUp={() => adjustZoneTemp("rearL", 0.5)}
            onTempDown={() => adjustZoneTemp("rearL", -0.5)}
            onHeat={() => cycleSeatHeat(0)}
            onSelect={() => setActiveZone("rearL")}
          />
          <CarSeat
            zone="rearC"
            label="Rear C"
            temp={climate.rearTemp}
            heat={climate.rearSeatHeat[1]}
            active={climate.activeZone === "rearC"}
            compact
            position={{ left: "38.5%", top: "70%", width: "23%", height: "16%" }}
            onTempUp={() => adjustZoneTemp("rearC", 0.5)}
            onTempDown={() => adjustZoneTemp("rearC", -0.5)}
            onHeat={() => cycleSeatHeat(1)}
            onSelect={() => setActiveZone("rearC")}
          />
          <CarSeat
            zone="rearR"
            label="Rear R"
            temp={climate.rearTemp}
            heat={climate.rearSeatHeat[2]}
            active={climate.activeZone === "rearR"}
            compact
            position={{ right: "9%", top: "70%", width: "23%", height: "16%" }}
            onTempUp={() => adjustZoneTemp("rearR", 0.5)}
            onTempDown={() => adjustZoneTemp("rearR", -0.5)}
            onHeat={() => cycleSeatHeat(2)}
            onSelect={() => setActiveZone("rearR")}
          />
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 font-mono text-center">
        Dial: Rotate = Temp • L/R = Cycle Zones • Up = Steering • Down = Defrost • Center = Sync
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
  zone,
  label,
  temp,
  heat,
  active,
  dimmed,
  compact,
  position,
  onTempUp,
  onTempDown,
  onHeat,
  onSelect,
}: {
  zone: ClimateZone;
  label: string;
  temp: number;
  heat: number;
  active: boolean;
  dimmed?: boolean;
  compact?: boolean;
  position: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    width: string;
    height: string;
  };
  onTempUp: () => void;
  onTempDown: () => void;
  onHeat: () => void;
  onSelect: () => void;
}) => {
  return (
    <div
      onClick={onSelect}
      style={position}
      className={`absolute cursor-pointer transition-opacity ${
        dimmed ? "opacity-50" : ""
      }`}
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

      {/* Temp readout overlay (centered on seat cushion) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-0.5 mt-[10%]">
        <span
          className={`${
            compact ? "text-base" : "text-xl"
          } font-bold font-mono text-climate-warm leading-none drop-shadow-[0_1px_2px_hsl(220_20%_5%/0.8)]`}
        >
          {temp}°
        </span>
        <span className="text-[8px] font-mono text-foreground/70 uppercase tracking-wider">
          {label}
        </span>
        {/* Heat dots */}
        <div className="flex gap-0.5 mt-0.5">
          {[1, 2, 3].map((lvl) => (
            <div
              key={lvl}
              className={`w-1 h-1 rounded-full ${
                lvl <= heat ? "bg-climate-warm" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Temp +/- buttons floating on the seat sides */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTempDown();
        }}
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 flex items-center justify-center shadow-md"
      >
        <Minus size={10} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTempUp();
        }}
        className="absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 flex items-center justify-center shadow-md"
      >
        <Plus size={10} />
      </button>
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
