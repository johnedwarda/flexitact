import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CloudFog,
  Thermometer,
  LayoutGrid,
  Mic,
  MicOff,
  PanelLeft,
  PanelRight,
  Phone,
  Play,
  Radio,
  SkipBack,
  SkipForward,
  SteeringWheel,
  VolumeX,
  type IconType,
} from "./icons";
import { useInfotainment, TASKBAR_ITEMS } from "./InfotainmentContext";
import { onHardwareInput } from "./hardwareInputEvents";

type DialIcon = IconType;
type DialHint = { icon: DialIcon; name: string };

const NavigationButtons = ({ vertical = false }: { vertical?: boolean }) => {
  const {
    highlightedIndex,
    controlClusterDisabled,
    navigateLeft,
    navigateRight,
    toggleApp,
    dialLeft,
    dialRight,
    dialUp,
    dialDown,
    dialRotate,
    dialCenter,
  } = useInfotainment();

  const [dialRotation, setDialRotation] = useState(0);
  const [activeJoystick, setActiveJoystick] = useState<string | null>(null);
  const [activeDialDir, setActiveDialDir] = useState<string | null>(null);
  const joyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentItem = TASKBAR_ITEMS[highlightedIndex];

  // Drag-to-rotate: each 15 degrees of travel around the dial centre is one detent step.
  const dialDrag = useRef<{ cx: number; cy: number; last: number; acc: number } | null>(null);
  const [dialDragging, setDialDragging] = useState(false);
  const pointerAngle = (e: React.PointerEvent, cx: number, cy: number) =>
    (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;

  const handleJoystick = (dir: string) => {
    if (dir === "left") navigateLeft();
    if (dir === "right") navigateRight();
    if (dir === "center") toggleApp();
  };

  const handleDialDirection = (dir: string) => {
    if (dir === "left") dialLeft();
    if (dir === "right") dialRight();
    if (dir === "up") dialUp();
    if (dir === "down") dialDown();
  };

  const handleRotate = (dir: "cw" | "ccw") => {
    setDialRotation((r) => r + (dir === "cw" ? 15 : -15));
    dialRotate(dir);
  };

  const onDialPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (controlClusterDisabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    e.currentTarget.setPointerCapture(e.pointerId);
    dialDrag.current = { cx, cy, last: pointerAngle(e, cx, cy), acc: 0 };
    setDialDragging(true);
  };

  const onDialPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dialDrag.current;
    if (!d) return;
    const a = pointerAngle(e, d.cx, d.cy);
    let delta = a - d.last;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    d.last = a;
    d.acc += delta;
    while (d.acc >= 15) {
      handleRotate("cw");
      d.acc -= 15;
    }
    while (d.acc <= -15) {
      handleRotate("ccw");
      d.acc += 15;
    }
  };

  const endDialDrag = () => {
    dialDrag.current = null;
    setDialDragging(false);
  };

  // Keyboard input mirrors the touch visuals: flash the pressed button and
  // spin the dial ring. The context action itself is fired by the key handler.
  useEffect(() => {
    const flashJoystick = (key: string) => {
      setActiveJoystick(key);
      if (joyTimer.current) clearTimeout(joyTimer.current);
      joyTimer.current = setTimeout(() => setActiveJoystick(null), 150);
    };
    const flashDial = (key: string) => {
      setActiveDialDir(key);
      if (dialTimer.current) clearTimeout(dialTimer.current);
      dialTimer.current = setTimeout(() => setActiveDialDir(null), 150);
    };

    return onHardwareInput((input) => {
      switch (input) {
        case "joy-left":
          flashJoystick("left");
          break;
        case "joy-right":
          flashJoystick("right");
          break;
        case "joy-center":
          flashJoystick("center");
          break;
        case "dial-left":
          flashDial("left");
          break;
        case "dial-right":
          flashDial("right");
          break;
        case "dial-up":
          flashDial("up");
          break;
        case "dial-down":
          flashDial("down");
          break;
        case "dial-center":
          flashDial("center");
          break;
        case "rotate-cw":
          setDialRotation((r) => r + 15);
          break;
        case "rotate-ccw":
          setDialRotation((r) => r - 15);
          break;
      }
    });
  }, []);


  const joystickDirs = [
    { key: "left", label: "◀" },
    { key: "right", label: "▶" },
  ];

  // Contextual icons for the control dial
  const getDialHints = (): {
    left: DialHint;
    right: DialHint;
    up: DialHint;
    down: DialHint;
    center: DialHint;
    dial: string;
  } => {
    switch (currentItem.id) {
      case "media":
        return {
          left: { icon: SkipBack, name: "Previous" },
          right: { icon: SkipForward, name: "Next" },
          up: { icon: Radio, name: "Source" },
          down: { icon: VolumeX, name: "Mute" },
          center: { icon: Play, name: "Play / pause" },
          dial: "Volume",
        };
      case "climate":
        return {
          left: { icon: PanelLeft, name: "Zone left" },
          right: { icon: PanelRight, name: "Zone right" },
          up: { icon: SteeringWheel, name: "Steering heat" },
          down: { icon: CloudFog, name: "Defog" },
          center: { icon: Thermometer, name: "Zones" },
          dial: "Temp",
        };
      case "phone":
        return {
          left: { icon: ChevronLeft, name: "Previous" },
          right: { icon: ChevronRight, name: "Next" },
          up: { icon: Mic, name: "Unmute" },
          down: { icon: MicOff, name: "Mute" },
          center: { icon: Phone, name: "Call" },
          dial: "Volume",
        };
      case "menu":
        return {
          left: { icon: ChevronLeft, name: "Previous" },
          right: { icon: ChevronRight, name: "Next" },
          up: { icon: ChevronUp, name: "Row up" },
          down: { icon: ChevronDown, name: "Row down" },
          center: { icon: LayoutGrid, name: "Open" },
          dial: "Browse",
        };
      default:
        return {
          left: { icon: ArrowLeft, name: "Left" },
          right: { icon: ArrowRight, name: "Right" },
          up: { icon: ArrowUp, name: "Up" },
          down: { icon: ArrowDown, name: "Down" },
          center: { icon: Check, name: "OK" },
          dial: "Scroll",
        };
    }
  };

  const hints = getDialHints();

  const Kbd = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex min-w-[18px] items-center justify-center rounded border border-border/50 bg-[hsl(var(--surface-glass))] px-1 py-[1px] font-mono text-[8px] text-muted-foreground">
      {children}
    </span>
  );

  const ShortcutList = ({ items }: { items: [string, string][] }) => (
    <ul className="flex flex-col gap-1">
      {items.map(([keys, action]) => (
        <li key={action} className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5">
            {keys.split("/").map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground/70 font-mono">{action}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`flex flex-col items-center bg-[hsl(220_22%_5%)] ${
        vertical ? "min-h-full justify-center gap-6 px-4 py-6" : "gap-4 px-8 pb-6 pt-4"
      }`}
    >
      {/* Title */}
      <div className="flex flex-col items-center gap-0.5">
        <h1 className="text-lg font-semibold tracking-[0.3em] text-foreground/90">FlexiTact</h1>
        <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/70">
          Finnish national patent pending
        </span>
      </div>

      <div
        className={`flex items-center justify-center ${vertical ? "flex-col gap-6" : "gap-12"}`}
      >
      {/* Navigation Cluster shortcuts */}
      <ShortcutList
        items={[
          ["V", "Move left"],
          ["B", "Open / close"],
          ["N", "Move right"],
        ]}
      />

      {/* Navigation Cluster - 4-way Joystick */}
      <div className="flex flex-col items-center gap-2">

        {/* Hardware-style rocker/puck: recessed well with a domed knob */}
        <div className="relative h-[82px] w-[82px] rounded-full">
          {/* Recessed well */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 30%, hsl(220 16% 10%), hsl(220 24% 3.5%))",
              boxShadow: "inset 0 4px 9px rgba(0,0,0,0.9), inset 0 -1px 2px rgba(255,255,255,0.05), 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />

          {/* Left / right rocker zones with engraved chevrons */}
          {joystickDirs.map(({ key, label }) => {
            const active = activeJoystick === key;
            return (
              <button
                key={key}
                aria-label={key === "left" ? "Move left" : "Move right"}
                className={`absolute top-1/2 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[11px] transition-colors duration-100 ${
                  key === "left" ? "left-[2px]" : "right-[2px]"
                } ${active ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"}`}
                style={active ? { textShadow: "0 0 8px hsl(var(--primary) / 0.9)" } : { textShadow: "0 -1px 0 rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.08)" }}
                onPointerDown={() => {
                  setActiveJoystick(key);
                  handleJoystick(key);
                }}
                onPointerUp={() => setActiveJoystick(null)}
                onPointerLeave={() => setActiveJoystick(null)}
              >
                {label}
              </button>
            );
          })}

          {/* Domed knob: tilts toward the pressed side, depresses on centre press */}
          <button
            aria-label="Open or close"
            className="absolute left-1/2 top-1/2 h-[44px] w-[44px] rounded-full transition-all duration-100"
            style={{
              transform: `translate(-50%, -50%) translateX(${
                activeJoystick === "left" ? -3 : activeJoystick === "right" ? 3 : 0
              }px) scale(${activeJoystick === "center" ? 0.94 : 1})`,
              background:
                "radial-gradient(circle at 34% 26%, hsl(220 10% 38%), hsl(220 13% 20%) 48%, hsl(220 20% 9%) 100%)",
              boxShadow:
                activeJoystick === "center"
                  ? "0 1px 2px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -3px 6px rgba(0,0,0,0.6), 0 0 14px hsl(var(--primary) / 0.45)"
                  : "0 5px 9px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.28), inset 0 -4px 6px rgba(0,0,0,0.55)",
            }}
            onPointerDown={() => {
              setActiveJoystick("center");
              handleJoystick("center");
            }}
            onPointerUp={() => setActiveJoystick(null)}
            onPointerLeave={() => setActiveJoystick(null)}
          >
            {/* Concave finger dimple */}
            <span
              className="absolute inset-[9px] flex items-center justify-center rounded-full"
              style={{
                background: "radial-gradient(circle at 60% 70%, hsl(220 14% 22%), hsl(220 18% 12%))",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <span className="font-mono text-[7px] text-muted-foreground/70">B</span>
            </span>
          </button>
        </div>
        {/* Show highlighted item name */}
        <span className="text-[10px] font-mono text-primary">
          {currentItem.label}
        </span>
      </div>

      {/* Control Cluster */}
      <div className="flex flex-col items-center gap-2">

        <div className="relative w-32 h-32">
          {/* Outer ring: knurled metal grip that turns with the dial */}
          <div
            className={`absolute inset-0 touch-none select-none rounded-full transition-transform duration-150 ${
              controlClusterDisabled ? "opacity-30" : dialDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            role="slider"
            aria-label="Rotate dial (drag around the ring)"
            aria-valuenow={((dialRotation % 360) + 360) % 360}
            aria-valuemin={0}
            aria-valuemax={359}
            onPointerDown={onDialPointerDown}
            onPointerMove={onDialPointerMove}
            onPointerUp={endDialDrag}
            onPointerCancel={endDialDrag}
            style={{
              transform: `rotate(${dialRotation}deg)`,
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.06) 0deg 1.5deg, rgba(0,0,0,0.25) 1.5deg 3deg), hsl(220 10% 17%)",
              boxShadow:
                "0 9px 18px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.85)",
            }}
          >
            {/* Index marker */}
            <div
              className="absolute left-1/2 top-[3px] h-3 w-1.5 -translate-x-1/2 rounded-full bg-primary"
              style={{ boxShadow: "0 0 6px hsl(var(--primary) / 0.8)" }}
            />
          </div>
          {/* Static light: bevel highlight on the ring edge (does not rotate) */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 200deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 25%, rgba(0,0,0,0.25) 55%, rgba(255,255,255,0) 75%, rgba(255,255,255,0.18))",
              WebkitMask: "radial-gradient(circle, transparent 62%, #000 63%)",
              mask: "radial-gradient(circle, transparent 62%, #000 63%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -2px 3px rgba(0,0,0,0.5)",
            }}
          />

          {/* Inner display + joystick area */}
          <div
            className="absolute inset-[18px] rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 28%, hsl(220 16% 12%), hsl(220 24% 4%))",
              boxShadow:
                "inset 0 5px 10px rgba(0,0,0,0.9), inset 0 -1px 2px rgba(255,255,255,0.06), 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            {/* Disabled: label sits inside the well; ring and well stay visible */}
            {controlClusterDisabled && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[9px] font-semibold tracking-widest text-muted-foreground">
                  DISABLED
                </span>
              </div>
            )}

            {/* 4-way direction buttons with hint icons */}
            {!controlClusterDisabled && [
              { key: "up", style: "top-1 left-1/2 -translate-x-1/2", hint: hints.up },
              { key: "down", style: "bottom-1 left-1/2 -translate-x-1/2", hint: hints.down },
              { key: "left", style: "left-1 top-1/2 -translate-y-1/2", hint: hints.left },
              { key: "right", style: "right-1 top-1/2 -translate-y-1/2", hint: hints.right },
            ].map(({ key, style, hint: { icon: Icon, name } }) => (
              <button
                key={key}
                aria-label={name}
                title={name}
                className={`absolute ${style} flex h-7 w-7 items-center justify-center rounded transition-all duration-100 ${
                  activeDialDir === key
                    ? "text-primary scale-110"
                    : "text-muted-foreground/70 hover:text-foreground"
                }`}
                onPointerDown={() => {
                  setActiveDialDir(key);
                  handleDialDirection(key);
                }}
                onPointerUp={() => setActiveDialDir(null)}
                onPointerLeave={() => setActiveDialDir(null)}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}

            {/* Center press: flat button with label */}
            {!controlClusterDisabled && (
            <button
              aria-label={hints.center.name}
              title={hints.center.name}
              className="absolute left-1/2 top-1/2 flex h-9 w-9 flex-col items-center justify-center rounded-full border transition-colors duration-100"
              style={{
                transform: "translate(-50%, -50%)",
                background: activeDialDir === "center" ? "hsl(var(--primary) / 0.25)" : "hsl(220 16% 14%)",
                borderColor: activeDialDir === "center" ? "hsl(var(--primary) / 0.6)" : "hsl(220 12% 22%)",
              }}
              onPointerDown={() => {
                setActiveDialDir("center");
                dialCenter();
              }}
              onPointerUp={() => setActiveDialDir(null)}
              onPointerLeave={() => setActiveDialDir(null)}
            >
              <hints.center.icon className="h-4 w-4 text-muted-foreground" />
            </button>
            )}
          </div>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground/70">⟳ {controlClusterDisabled ? "—" : hints.dial}</span>
      </div>

      {/* Control Cluster shortcuts */}
      <ShortcutList
        items={[
          ["←/→", "Left / right"],
          ["↑/↓", "Up / down"],
          ["PgUp/PgDn", "Rotate"],
          ["Enter", "Press"],
        ]}
      />
      </div>
    </div>

  );
};

export default NavigationButtons;
