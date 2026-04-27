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

  const adjustZoneTemp = (zone: ClimateZone, delta: number) => {
    setClimate((c) => {
      if (zone === "driver") {
        const t = clampTemp(c.temp + delta);
        return c.zones === "single"
          ? { ...c, temp: t, passengerTemp: t }
          : { ...c, temp: t };
      }
      if (zone === "passenger") {
        if (c.zones === "single") {
          const t = clampTemp(c.temp + delta);
          return { ...c, temp: t, passengerTemp: t };
        }
        return { ...c, passengerTemp: clampTemp(c.passengerTemp + delta) };
      }
      return { ...c, rearTemp: clampTemp(c.rearTemp + delta) };
    });
  };

  const setActiveZone = (zone: ClimateZone) =>
    setClimate((c) => ({ ...c, activeZone: zone }));

  const cycleSeatHeat = (
    target: "driver" | "passenger" | 0 | 1 | 2,
  ) => {
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

  const passengerDisplayTemp =
    climate.zones === "single" ? climate.temp : climate.passengerTemp;

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-hidden">
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
            label="Recirc"
            icon={<RotateCcw size={12} />}
            active={climate.recirculation}
            onClick={() =>
              setClimate((c) => ({ ...c, recirculation: !c.recirculation }))
            }
          />
          <ChipToggle
            label="Sync"
            active={climate.zones === "single"}
            onClick={() =>
              setClimate((c) => ({
                ...c,
                zones: c.zones === "dual" ? "single" : "dual",
              }))
            }
          />
          <ChipToggle
            label="Rear Sync"
            active={climate.rearSync}
            onClick={() =>
              setClimate((c) => ({ ...c, rearSync: !c.rearSync }))
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

      {/* Cabin (top-down) */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 rounded-[2.5rem] border border-border/40 bg-gradient-to-b from-muted/10 via-transparent to-muted/10 overflow-visible">
          {/* Windshield band */}
          <button
            onClick={() =>
              setClimate((c) => ({ ...c, defogger: !c.defogger }))
            }
            className={`absolute top-0 left-0 right-0 h-11 rounded-t-[2.5rem] flex items-center justify-center gap-2 border-b border-border/40 transition-colors ${
              climate.defogger
                ? "bg-climate-cool/15 text-climate-cool"
                : "bg-muted/10 text-muted-foreground hover:text-foreground"
            }`}
            title="Front defogger"
          >
            <Wind size={14} />
            <span className="text-[10px] font-mono uppercase tracking-wider">
              Windshield {climate.defogger ? "• Defrost On" : ""}
            </span>
          </button>

          {/* Side mirrors */}
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

          {/* Front row: driver + steering + passenger */}
          <div className="absolute top-14 left-0 right-0 px-6 flex items-start justify-between gap-2">
            <Seat
              zone="driver"
              label="Driver"
              temp={climate.temp}
              heat={climate.frontSeatHeat.driver}
              active={climate.activeZone === "driver"}
              onTempUp={() => adjustZoneTemp("driver", 0.5)}
              onTempDown={() => adjustZoneTemp("driver", -0.5)}
              onHeat={() => cycleSeatHeat("driver")}
              onSelect={() => setActiveZone("driver")}
            />

            {/* Steering wheel between front seats */}
            <div className="flex flex-col items-center pt-10">
              <button
                onClick={() =>
                  setClimate((c) => ({
                    ...c,
                    steeringHeat: !c.steeringHeat,
                  }))
                }
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  climate.steeringHeat
                    ? "border-climate-warm/70 bg-climate-warm/15 text-climate-warm shadow-[0_0_16px_hsl(var(--climate-warm)/0.35)]"
                    : "border-border/50 bg-muted/20 text-muted-foreground hover:text-foreground"
                }`}
                title="Steering wheel heating"
              >
                <CircleDot size={20} />
              </button>
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Steering
              </span>
            </div>

            <Seat
              zone="passenger"
              label="Passenger"
              temp={passengerDisplayTemp}
              heat={climate.frontSeatHeat.passenger}
              active={climate.activeZone === "passenger"}
              dimmed={climate.zones === "single"}
              onTempUp={() => adjustZoneTemp("passenger", 0.5)}
              onTempDown={() => adjustZoneTemp("passenger", -0.5)}
              onHeat={() => cycleSeatHeat("passenger")}
              onSelect={() => setActiveZone("passenger")}
            />
          </div>

          {/* Rear row: 3 seats */}
          <div className="absolute bottom-14 left-0 right-0 px-4 flex items-end justify-between gap-2">
            {(["rearL", "rearC", "rearR"] as const).map((zone, i) => (
              <Seat
                key={zone}
                zone={zone}
                label={
                  zone === "rearL"
                    ? "Rear L"
                    : zone === "rearC"
                      ? "Rear C"
                      : "Rear R"
                }
                temp={climate.rearTemp}
                heat={climate.rearSeatHeat[i]}
                active={climate.activeZone === zone}
                compact
                onTempUp={() => adjustZoneTemp(zone, 0.5)}
                onTempDown={() => adjustZoneTemp(zone, -0.5)}
                onHeat={() => cycleSeatHeat(i as 0 | 1 | 2)}
                onSelect={() => setActiveZone(zone)}
              />
            ))}
          </div>

          {/* Rear window band */}
          <button
            onClick={() =>
              setClimate((c) => ({ ...c, rearDefogger: !c.rearDefogger }))
            }
            className={`absolute bottom-0 left-0 right-0 h-11 rounded-b-[2.5rem] flex items-center justify-center gap-2 border-t border-border/40 transition-colors ${
              climate.rearDefogger
                ? "bg-climate-cool/15 text-climate-cool"
                : "bg-muted/10 text-muted-foreground hover:text-foreground"
            }`}
            title="Rear defogger"
          >
            <Wind size={14} className="rotate-180" />
            <span className="text-[10px] font-mono uppercase tracking-wider">
              Rear Window {climate.rearDefogger ? "• Defog On" : ""}
            </span>
          </button>
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
    side === "left"
      ? "left-0 -translate-x-1/2 rounded-r-md rounded-l-lg"
      : "right-0 translate-x-1/2 rounded-l-md rounded-r-lg";
  return (
    <button
      onClick={onClick}
      className={`absolute top-[3.5rem] ${pos} w-7 h-10 border flex flex-col items-center justify-center gap-0.5 transition-all ${
        active
          ? "bg-climate-warm/15 border-climate-warm/50 text-climate-warm shadow-[0_0_12px_hsl(var(--climate-warm)/0.3)]"
          : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground"
      }`}
      title={`${side === "left" ? "Left" : "Right"} mirror heating`}
    >
      <Heater size={12} />
      <span className="text-[8px] font-mono uppercase tracking-wider">
        {side === "left" ? "L" : "R"}
      </span>
    </button>
  );
};

const Seat = ({
  zone,
  label,
  temp,
  heat,
  active,
  dimmed,
  compact,
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
  onTempUp: () => void;
  onTempDown: () => void;
  onHeat: () => void;
  onSelect: () => void;
}) => {
  const seatSize = compact ? "w-16 h-16" : "w-20 h-20";
  const headrestSize = compact ? "w-10 h-2.5" : "w-12 h-3";
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col items-center gap-1.5 cursor-pointer transition-opacity ${
        dimmed ? "opacity-50" : ""
      }`}
    >
      {/* Temp readout */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTempDown();
          }}
          className="w-5 h-5 rounded-full bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center"
        >
          <Minus size={10} />
        </button>
        <div className="flex flex-col items-center min-w-[44px]">
          <span
            className={`${
              compact ? "text-lg" : "text-2xl"
            } font-bold font-mono text-climate-warm leading-none`}
          >
            {temp}°
          </span>
          <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTempUp();
          }}
          className="w-5 h-5 rounded-full bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Seat shape */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onHeat();
        }}
        className={`relative ${seatSize} rounded-t-3xl rounded-b-xl border-2 flex flex-col items-center justify-end pb-1.5 transition-all ${
          heat > 0
            ? "border-climate-warm/60 bg-climate-warm/10 text-climate-warm"
            : "border-border/50 bg-muted/20 text-muted-foreground hover:text-foreground"
        } ${active ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-background" : ""}`}
        title={`${label} seat heating: ${heat}`}
      >
        <div
          className={`absolute -top-1.5 left-1/2 -translate-x-1/2 ${headrestSize} rounded-full ${
            heat > 0 ? "bg-climate-warm/40" : "bg-muted/50"
          }`}
        />
        <Heater size={compact ? 14 : 18} />
        <div className="flex gap-0.5 mt-0.5">
          {[1, 2, 3].map((lvl) => (
            <div
              key={lvl}
              className={`w-1 h-0.5 rounded-full ${
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
