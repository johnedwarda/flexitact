import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CloudFog, HeatWaves, Minus, Plus, RotateCcw, SeatHeat, Snowflake, Thermometer } from "./icons";
import { adjustZoneTemp, useInfotainment, type ClimateState, type ClimateZone } from "./InfotainmentContext";

/**
 * Climate: a top-down cutaway of the car (front up, driver on the left).
 *
 * Controls with a physical place in the car sit on the illustration: seat heating on each
 * seat, steering wheel heating on the wheel, defrost on the glass, heating on each mirror.
 * Controls without one (temperatures, fan, airflow, modes) sit in panels either side, with
 * leader lines to the seat they belong to.
 *
 * The car is drawn in its own frame (u runs rear to front, v runs driver side to passenger
 * side) and rotated into the stage, so shapes read like a normal side-on plan drawing.
 */

const STAGE_W = 900;
const STAGE_H = 560;
const CAR_TX = 325; // stage x of car-frame v = 0
const CAR_TY = 538; // stage y of car-frame u = 0

const cx = (v: number) => CAR_TX + v;
const cy = (u: number) => CAR_TY - u;

const L1 = "hsl(215 22% 72% / 0.8)";
const L2 = "hsl(215 18% 58% / 0.55)";
const L3 = "hsl(215 15% 46% / 0.5)";
const SELECT = "hsl(205 100% 58%)";

interface SeatDef {
  bu: number; // car-frame u of the backrest's rear edge
  vmin: number;
  vmax: number;
}

const SEATS: Record<ClimateZone, SeatDef> = {
  driver: { bu: 228, vmin: 46, vmax: 112 },
  passenger: { bu: 228, vmin: 138, vmax: 204 },
  rearL: { bu: 84, vmin: 46, vmax: 112 },
  rearR: { bu: 84, vmin: 138, vmax: 204 },
};

const ZONE_LABEL: Record<ClimateZone, string> = {
  driver: "Driver",
  passenger: "Passenger",
  rearL: "Rear left",
  rearR: "Rear right",
};

/** Stage-space geometry of a seat: its click area and the centre of its cushion. */
const seatBox = (d: SeatDef) => ({
  x: cx(d.vmin),
  y: cy(d.bu + 88),
  w: d.vmax - d.vmin,
  h: 100,
  centerX: cx((d.vmin + d.vmax) / 2),
  centerY: cy(d.bu + 58),
});

const ClimateAppView = () => {
  const { climate, setClimate } = useInfotainment();

  const bump = (zone: ClimateZone, delta: number) => setClimate((c) => adjustZoneTemp(c, delta, zone));
  const select = (zone: ClimateZone) => setClimate((c) => ({ ...c, activeZone: zone }));

  const heatFor = (zone: ClimateZone): number =>
    zone === "driver"
      ? climate.frontSeatHeat.driver
      : zone === "passenger"
        ? climate.frontSeatHeat.passenger
        : climate.rearSeatHeat[zone === "rearL" ? 0 : 1];

  const cycleHeat = (zone: ClimateZone) =>
    setClimate((c) => {
      if (zone === "driver") {
        const v = (c.frontSeatHeat.driver + 1) % 4;
        return { ...c, seatHeat: v, frontSeatHeat: { ...c.frontSeatHeat, driver: v } };
      }
      if (zone === "passenger") {
        return { ...c, frontSeatHeat: { ...c.frontSeatHeat, passenger: (c.frontSeatHeat.passenger + 1) % 4 } };
      }
      const i = zone === "rearL" ? 0 : 1;
      const rear: [number, number] = [...c.rearSeatHeat];
      rear[i] = (rear[i] + 1) % 4;
      return { ...c, rearSeatHeat: rear };
    });

  const tempFor = (zone: ClimateZone) =>
    zone === "driver" ? climate.temp : zone === "passenger" ? climate.passengerTemp : climate.rearTemp;

  const driverSeat = seatBox(SEATS.driver);
  const passengerSeat = seatBox(SEATS.passenger);

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden px-3 pb-2 pt-2">
      {/* Header */}
      <div className="flex h-6 items-center gap-3">
        <Thermometer size={18} className="text-muted-foreground" />
        <h2 className="font-mono text-base uppercase tracking-widest text-muted-foreground">Climate</h2>
        <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground/60 xl:block">
          Dial: ◀ ▶ zone • rotate temp • up steering • down defrost • centre auto
        </span>
        <span className="ml-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
          {ZONE_LABEL[climate.activeZone]}
        </span>
      </div>

      <Stage>
        <CabinDrawing climate={climate} heatFor={heatFor} />

        {/* Leader lines from the side panels to the seats they control */}
        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
          strokeLinecap="round"
        >
          <g stroke={L2} strokeWidth={1.4} strokeDasharray="4 4">
            <path d={`M258 262H${driverSeat.x - 6}`} />
            <path d={`M642 262H${passengerSeat.x + passengerSeat.w + 6}`} />
          </g>
          <g fill={L1}>
            <circle cx={driverSeat.x - 6} cy={262} r={3.5} />
            <circle cx={passengerSeat.x + passengerSeat.w + 6} cy={262} r={3.5} />
          </g>
        </svg>

        {/* ---- Seats: select zone and heat ---- */}
        {(Object.keys(SEATS) as ClimateZone[]).map((zone) => {
          const b = seatBox(SEATS[zone]);
          return (
            <div
              key={zone}
              onClick={() => (zone === "driver" || zone === "passenger") && select(zone)}
              className="absolute cursor-pointer"
              style={{ left: b.x - 14, top: b.y, width: b.w + 14, height: b.h }}
            >
              <div
                className="absolute"
                style={{ left: b.centerX - b.x + 14, top: b.centerY - b.y, transform: "translate(-50%, -50%)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <HeatButton level={heatFor(zone)} label={`${ZONE_LABEL[zone]} seat heating`} onClick={() => cycleHeat(zone)} />
              </div>
            </div>
          );
        })}

        {/* ---- Steering wheel heating ---- */}
        <At x={cx(80)} y={cy(352)}>
          <button
            onClick={() => setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))}
            title="Steering wheel heating"
            aria-label="Steering wheel heating"
            aria-pressed={climate.steeringHeat}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
              climate.steeringHeat
                ? "text-climate-warm drop-shadow-[0_0_8px_hsl(var(--climate-warm)/0.9)]"
                : "text-foreground/80 hover:text-foreground"
            }`}
          >
            <HeatWaves size={22} />
          </button>
        </At>

        {/* ---- Windscreen defrost ---- */}
        <GlassButton
          x={cx(125)}
          y={cy(421)}
          label="Defrost"
          title="Windscreen defrost"
          active={climate.defogger}
          onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
        />

        {/* ---- Mirror heating ---- */}
        <MirrorButton
          x={cx(16.5)}
          y={cy(376.5)}
          label="Left mirror heating"
          active={climate.mirrorHeat.left}
          onClick={() => setClimate((c) => ({ ...c, mirrorHeat: { ...c.mirrorHeat, left: !c.mirrorHeat.left } }))}
        />
        <MirrorButton
          x={cx(233.5)}
          y={cy(376.5)}
          label="Right mirror heating"
          active={climate.mirrorHeat.right}
          onClick={() => setClimate((c) => ({ ...c, mirrorHeat: { ...c.mirrorHeat, right: !c.mirrorHeat.right } }))}
        />

        {/* ---- Left panel (driver side): temperature, fan ---- */}
        <TempPod zone="driver" x={160} y={262} climate={climate} tempFor={tempFor} onSelect={select} onBump={bump} />
        <Panel x={160} y={418} w={200}>
          <PanelLabel>Fan</PanelLabel>
          <FanStepper value={climate.fanSpeed} onChange={(v) => setClimate((c) => ({ ...c, fanSpeed: v }))} />
        </Panel>

        {/* ---- Right panel (passenger side): modes, passenger temperature ---- */}
        <Panel x={740} y={118} w={200}>
          <PanelLabel>Mode</PanelLabel>
          <div className="grid w-full grid-cols-3 gap-1.5">
            <Chip active={climate.autoMode} onClick={() => setClimate((c) => ({ ...c, autoMode: !c.autoMode }))} title="Auto">
              Auto
            </Chip>
            <Chip
              active={climate.acOn}
              onClick={() => setClimate((c) => ({ ...c, acOn: !c.acOn }))}
              title="Air conditioning"
              tone="cool"
            >
              <Snowflake size={17} />
            </Chip>
            <Chip
              active={climate.recirculation}
              onClick={() => setClimate((c) => ({ ...c, recirculation: !c.recirculation }))}
              title="Recirculation"
            >
              <RotateCcw size={17} />
            </Chip>
          </div>
        </Panel>
        <TempPod zone="passenger" x={740} y={262} climate={climate} tempFor={tempFor} onSelect={select} onBump={bump} />
        {/* ---- Bottom right: rear sync ---- */}
        <Panel x={740} y={418} w={200}>
          <div className="grid w-full grid-cols-1 gap-1.5">
            <Chip
              active={climate.zones === "single"}
              onClick={() =>
                setClimate((c) =>
                  c.zones === "single"
                    ? { ...c, zones: "dual" }
                    : { ...c, zones: "single", passengerTemp: c.temp, rearTemp: c.temp },
                )
              }
              title="Sync driver and passenger temperatures"
            >
              Sync
            </Chip>
          </div>
        </Panel>
      </Stage>
    </div>
  );
};

/* ---------- Stage: fixed-size canvas scaled to fit ---------- */

const Stage = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Use layout size, not getBoundingClientRect: the app opens with a scale animation and
    // a bounding rect would include that transform, shrinking the cabin permanently.
    const measure = () => {
      if (el.clientWidth === 0 || el.clientHeight === 0) return;
      setScale(Math.min(el.clientWidth / STAGE_W, el.clientHeight / STAGE_H));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative min-h-0 w-full flex-1">
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
};

/* ---------- Cabin drawing (car frame, rotated into the stage) ---------- */

const mirrorV = (v: number) => 250 - v;

const Seat = ({ def, heat, selected }: { def: SeatDef; heat: number; selected: boolean }) => {
  const { bu, vmin, vmax } = def;
  const mid = (vmin + vmax) / 2;
  const fill = heat > 0 ? `url(#seat-warm-${heat})` : "url(#seat-cool)";
  const stroke = selected ? SELECT : "hsl(200 35% 38%)";
  const sw = selected ? 3 : 1.4;
  const stitch = { stroke: "hsl(200 40% 32% / 0.3)", strokeWidth: 0.8, strokeDasharray: "3 3" } as const;
  return (
    <g style={{ transition: "stroke 200ms" }}>
      <rect x={bu + 20} y={vmin + 2} width={66} height={vmax - vmin - 4} rx={14} fill={fill} stroke={stroke} strokeWidth={sw} />
      <rect x={bu} y={vmin} width={26} height={vmax - vmin} rx={12} fill={fill} stroke={stroke} strokeWidth={sw} />
      <rect x={bu - 8} y={mid - 15} width={14} height={30} rx={5} fill={fill} stroke={stroke} strokeWidth={sw} />
      <rect x={bu + 4} y={vmin + 7} width={18} height={vmax - vmin - 14} rx={7} {...stitch} />
      <rect x={bu + 34} y={vmin + 9} width={46} height={vmax - vmin - 18} rx={10} {...stitch} />
      <path d={`M${bu + 34} ${mid}H${bu + 80}`} {...stitch} />
    </g>
  );
};

const CabinDrawing = ({ climate, heatFor }: { climate: ClimateState; heatFor: (z: ClimateZone) => number }) => {
  const mirrorPath = (flip: boolean) => {
    const v = (n: number) => (flip ? mirrorV(n) : n);
    return `M362 ${v(26)}L372 ${v(4)}C380 ${v(0)} 388 ${v(2)} 390 ${v(8)}L382 ${v(28)}Z`;
  };
  return (
    <svg
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="hsl(220 12% 24%)" />
          <stop offset="0.5" stopColor="hsl(220 14% 14%)" />
          <stop offset="1" stopColor="hsl(220 12% 24%)" />
        </linearGradient>
        <linearGradient id="seat-cool" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(195 70% 86%)" />
          <stop offset="1" stopColor="hsl(197 55% 66%)" />
        </linearGradient>
        {[1, 2, 3].map((l) => (
          <linearGradient key={l} id={`seat-warm-${l}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(30 ${70 + l * 8}% ${86 - l * 6}%)`} />
            <stop offset="1" stopColor={`hsl(16 ${70 + l * 8}% ${66 - l * 6}%)`} />
          </linearGradient>
        ))}
        <linearGradient id="car-dash" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="hsl(192 68% 40%)" />
          <stop offset="1" stopColor="hsl(197 62% 24%)" />
        </linearGradient>
        <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(200 45% 62% / 0.38)" />
          <stop offset="1" stopColor="hsl(205 40% 40% / 0.12)" />
        </linearGradient>
        <linearGradient id="car-tail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="hsl(2 85% 55%)" />
          <stop offset="1" stopColor="hsl(0 70% 30% / 0.2)" />
        </linearGradient>
      </defs>

      <g transform={`translate(${CAR_TX} ${CAR_TY}) rotate(-90)`}>
        {/* Body */}
        <path
          d="M32 62C24 80 22 100 22 125C22 150 24 170 32 188C44 212 68 226 108 228L330 228C395 226 446 214 470 175C478 155 481 140 481 125C481 110 478 95 470 75C446 36 395 24 330 22L108 22C68 24 44 36 32 62Z"
          fill="hsl(220 16% 9%)"
          stroke={L1}
          strokeWidth={2}
        />
        {/* Seats */}
        {(Object.keys(SEATS) as ClimateZone[]).map((zone) => (
          <Seat key={zone} def={SEATS[zone]} heat={heatFor(zone)} selected={climate.activeZone === zone} />
        ))}

        {/* Steering wheel: thick rim, three spokes, hub */}
        <g style={{ transition: "stroke 200ms" }}>
          <ellipse cx={352} cy={80} rx={20} ry={28} fill="hsl(220 14% 10%)" />
          <path d="M352 80H372M352 54V106" stroke="hsl(220 10% 30%)" strokeWidth={5} />
          <ellipse
            cx={352}
            cy={80}
            rx={20}
            ry={28}
            stroke={climate.steeringHeat ? "hsl(18 90% 58%)" : "hsl(215 14% 52%)"}
            strokeWidth={6}
            style={{ transition: "stroke 200ms" }}
          />
          <ellipse cx={352} cy={80} rx={23} ry={31} stroke={L1} strokeWidth={0.8} />
          <ellipse cx={352} cy={80} rx={17} ry={25} stroke="hsl(0 0% 0% / 0.35)" strokeWidth={0.8} />
          <ellipse cx={352} cy={80} rx={9} ry={12} fill="hsl(220 14% 14%)" stroke={L1} strokeWidth={1.4} />
        </g>

        {/* Door mirrors */}
        <path d={mirrorPath(false)} fill="hsl(220 12% 20%)" stroke={L1} strokeWidth={1.6} />
        <path d={mirrorPath(true)} fill="hsl(220 12% 20%)" stroke={L1} strokeWidth={1.6} />
      </g>
    </svg>
  );
};

/* ---------- Controls ---------- */

const At = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <div className="absolute flex flex-col items-center gap-1" style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}>
    {children}
  </div>
);

const Panel = ({ x, y, w, children }: { x: number; y: number; w: number; children: ReactNode }) => (
  <div
    className="absolute flex flex-col items-center gap-2"
    style={{ left: x - w / 2, top: y, width: w, transform: "translateY(-50%)" }}
  >
    {children}
  </div>
);

const PanelLabel = ({ children }: { children: ReactNode }) => (
  <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">{children}</span>
);

const RoundButton = ({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
  >
    {children}
  </button>
);

const TempPod = ({
  zone,
  label,
  x,
  y,
  climate,
  tempFor,
  onSelect,
  onBump,
}: {
  zone: ClimateZone;
  label?: string;
  x: number;
  y: number;
  climate: ClimateState;
  tempFor: (z: ClimateZone) => number;
  onSelect: (z: ClimateZone) => void;
  onBump: (z: ClimateZone, d: number) => void;
}) => {
  const selected = climate.activeZone === zone || (zone === "rearL" && climate.activeZone === "rearR");
  const name = label ?? ZONE_LABEL[zone];
  const warm = zone === "driver" || zone === "passenger" ? "text-climate-warm" : "text-climate-cool";
  return (
    <div
      onClick={() => onSelect(zone)}
      className={`absolute flex cursor-pointer flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 backdrop-blur-sm transition-colors ${
        selected ? "border-primary/70 bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.25)]" : "border-border/40 bg-background/40"
      }`}
      style={{ left: x - 98, top: y - 52, width: 196 }}
    >
      <span
        className={`font-mono text-[12px] font-semibold uppercase tracking-[0.22em] ${
          selected ? "text-primary" : "text-muted-foreground/80"
        }`}
      >
        {name}
      </span>
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <RoundButton label={`${name} cooler`} onClick={() => onBump(zone, -1)}>
          <Minus size={18} />
        </RoundButton>
        <span className={`w-[68px] text-center font-mono text-[38px] font-bold leading-none tabular-nums ${warm}`}>
          {tempFor(zone).toFixed(0)}°
        </span>
        <RoundButton label={`${name} warmer`} onClick={() => onBump(zone, 1)}>
          <Plus size={18} />
        </RoundButton>
      </div>
    </div>
  );
};

const HeatButton = ({ level, label, onClick }: { level: number; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label={`${label}, level ${level}`}
    title={label}
    className={`flex h-9 items-center gap-1.5 rounded-xl px-2 transition-colors ${
      level > 0 ? "text-[hsl(14_80%_22%)]" : "text-[hsl(205_45%_20%)] hover:text-[hsl(205_60%_10%)]"
    }`}
  >
    <SeatHeat size={20} />
    <span className="flex items-end gap-[2px]">
      {[1, 2, 3].map((lvl) => (
        <span
          key={lvl}
          className={`w-[4px] rounded-sm ${lvl <= level ? "bg-current" : "bg-current opacity-25"}`}
          style={{ height: 6 + lvl * 3.5 }}
        />
      ))}
    </span>
  </button>
);

const GlassButton = ({
  x,
  y,
  label,
  title,
  active,
  onClick,
}: {
  x: number;
  y: number;
  label: string;
  title: string;
  active: boolean;
  onClick: () => void;
}) => (
  <At x={x} y={y}>
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
        active
          ? "bg-climate-cool/30 text-climate-cool shadow-[0_0_18px_hsl(var(--climate-cool)/0.5)]"
          : "bg-background/60 text-foreground/80 hover:bg-background/80"
      }`}
    >
      <CloudFog size={22} />
    </button>
    <span
      className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${active ? "text-climate-cool" : "text-foreground/70"}`}
    >
      {label}
    </span>
  </At>
);

const MirrorButton = ({
  x,
  y,
  label,
  active,
  onClick,
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <At x={x} y={y}>
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
        active
          ? "text-climate-warm drop-shadow-[0_0_8px_hsl(var(--climate-warm)/0.9)]"
          : "text-foreground/80 hover:text-foreground"
      }`}
    >
      <HeatWaves size={17} />
    </button>
  </At>
);

const Chip = ({
  children,
  active,
  onClick,
  title,
  tone,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  title?: string;
  tone?: "cool";
}) => (
  <button
    onClick={onClick}
    title={title}
    aria-pressed={active}
    className={`flex h-10 items-center justify-center rounded-xl font-mono text-[13px] font-semibold uppercase tracking-wide transition-colors ${
      active
        ? tone === "cool"
          ? "bg-climate-cool/25 text-climate-cool"
          : "bg-primary/25 text-primary"
        : "bg-background/60 text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const FanStepper = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex h-11 w-full items-center justify-between rounded-xl bg-background/60 px-2.5">
    <button
      onClick={() => onChange(Math.max(0, value - 1))}
      className="text-muted-foreground hover:text-foreground"
      title="Fan slower"
      aria-label="Fan slower"
    >
      <Minus size={18} />
    </button>
    <div className="flex items-end gap-[4px]">
      {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
        <div
          key={lvl}
          className={`w-[5px] rounded-sm transition-all ${lvl <= value ? "bg-primary" : "bg-muted/70"}`}
          style={{ height: 8 + lvl * 2.6 }}
        />
      ))}
    </div>
    <button
      onClick={() => onChange(Math.min(7, value + 1))}
      className="text-muted-foreground hover:text-foreground"
      title="Fan faster"
      aria-label="Fan faster"
    >
      <Plus size={18} />
    </button>
  </div>
);

export default ClimateAppView;
