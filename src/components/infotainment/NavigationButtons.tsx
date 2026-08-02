import { useState } from "react";
import { useInfotainment, TASKBAR_ITEMS } from "./InfotainmentContext";

const NavigationButtons = () => {
  const {
    highlightedIndex,
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

  const currentItem = TASKBAR_ITEMS[highlightedIndex];

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

  const joystickDirs = [
    { key: "left", label: "◀", style: "left-0 top-1/2 -translate-y-1/2" },
    { key: "right", label: "▶", style: "right-0 top-1/2 -translate-y-1/2" },
  ];

  // Contextual hints for the control dial
  const getDialHints = () => {
    switch (currentItem.id) {
      case "media":
        return { label: "Media Control", left: "⏮ Prev", right: "Next ⏭", up: "Source", down: "Mute", dial: "Volume", center: "⏯" };
      case "climate":
        return { label: "Climate Control", left: "Zone L", right: "Zone R", up: "Steering", down: "Defog", dial: "Temp", center: "Zones" };
      case "menu":
        return { label: "App Menu", left: "← Prev", right: "Next →", up: "↑ Row", down: "↓ Row", dial: "Browse", center: "Open" };
      default:
        return { label: "Control Dial", left: "←", right: "→", up: "↑", down: "↓", dial: "Scroll", center: "OK" };
    }
  };

  const hints = getDialHints();

  return (
    <div className="flex items-center justify-center gap-20 px-8 py-6 bg-[hsl(220_22%_5%)] border-t border-border/30">
      {/* Task Switcher - 4-way Joystick */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-28 h-28 rounded-3xl bg-[hsl(var(--surface-elevated))] border border-border/50 shadow-lg">
          {/* Outer ring removed */}


          {/* Direction buttons */}
          {joystickDirs.map(({ key, label, style }) => (
            <button
              key={key}
              className={`absolute ${style} w-8 h-8 flex items-center justify-center rounded-md text-xs transition-all duration-100 ${
                activeJoystick === key
                  ? "bg-primary/30 text-primary scale-110"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
              onPointerDown={() => {
                setActiveJoystick(key);
                handleJoystick(key);
              }}
              onPointerUp={() => setActiveJoystick(null)}
              onPointerLeave={() => setActiveJoystick(null)}
            >
              {label}
            </button>
          ))}

          {/* Center button - toggle app */}
          <button
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border/50 transition-all duration-100 flex items-center justify-center ${
              activeJoystick === "center"
                ? "bg-primary/30 shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                : "bg-[hsl(var(--surface-glass))] hover:bg-secondary"
            }`}
            onPointerDown={() => {
              setActiveJoystick("center");
              handleJoystick("center");
            }}
            onPointerUp={() => setActiveJoystick(null)}
            onPointerLeave={() => setActiveJoystick(null)}
          >
            <span className="text-[7px] font-mono text-muted-foreground">B</span>
          </button>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
          Task Switcher
        </span>
        {/* Show highlighted item name */}
        <span className="text-[10px] font-mono text-primary">
          {currentItem.label}
        </span>
      </div>

      {/* Control Dial */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-32 h-32">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full border-[3px] border-border/50 bg-[hsl(var(--surface-glass))] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_0_20px_rgba(0,0,0,0.3)] transition-transform duration-150"
            style={{ transform: `rotate(${dialRotation}deg)` }}
          >
            {/* Dial notch indicators */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute w-1 h-2 bg-muted-foreground/40 rounded-full top-1 left-1/2 -translate-x-1/2 origin-[50%_calc(64px-4px)]"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
            {/* Primary notch */}
            <div className="absolute w-1.5 h-3 bg-primary rounded-full top-1 left-1/2 -translate-x-1/2" />
          </div>

          {/* Rotate buttons */}
          <button
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-16 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors rounded-l-lg hover:bg-secondary/30"
            onClick={() => handleRotate("ccw")}
            aria-label="Rotate counter-clockwise"
          >
            <span className="text-xs">↺</span>
          </button>
          <button
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-16 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors rounded-r-lg hover:bg-secondary/30"
            onClick={() => handleRotate("cw")}
            aria-label="Rotate clockwise"
          >
            <span className="text-xs">↻</span>
          </button>

          {/* Inner display + joystick area */}
          <div className="absolute inset-5 rounded-full bg-[hsl(var(--surface-elevated))] border border-border/30 shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]">
            {/* 4-way direction buttons with hint labels */}
            {[
              { key: "up", style: "top-0 left-1/2 -translate-x-1/2", hint: hints.up },
              { key: "down", style: "bottom-0 left-1/2 -translate-x-1/2", hint: hints.down },
              { key: "left", style: "left-0 top-1/2 -translate-y-1/2", hint: hints.left },
              { key: "right", style: "right-0 top-1/2 -translate-y-1/2", hint: hints.right },
            ].map(({ key, style, hint }) => (
              <button
                key={key}
                className={`absolute ${style} px-1 h-6 flex items-center justify-center rounded text-[7px] font-mono transition-all duration-100 leading-none whitespace-nowrap ${
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
                {hint}
              </button>
            ))}

            {/* Center press with label */}
            <button
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border/40 transition-all duration-100 flex flex-col items-center justify-center ${
                activeDialDir === "center"
                  ? "bg-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.3)]"
                  : "bg-[hsl(var(--surface-glass))] hover:bg-secondary"
              }`}
              onPointerDown={() => {
                setActiveDialDir("center");
                dialCenter();
              }}
              onPointerUp={() => setActiveDialDir(null)}
              onPointerLeave={() => setActiveDialDir(null)}
            >
              <span className="text-[6px] font-mono text-muted-foreground leading-none">{hints.center}</span>
            </button>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
          {hints.label}
        </span>
        <span className="text-[9px] font-mono text-muted-foreground/70">⟳ {hints.dial}</span>
      </div>
    </div>
  );
};

export default NavigationButtons;
