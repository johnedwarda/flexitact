import { useInfotainment } from "./InfotainmentContext";
import { Thermometer, Wind, Heater } from "lucide-react";

const ClimateWidget = () => {
  const { climate, setClimate } = useInfotainment();
  const { tempLeft, tempRight, zones, seatHeat, defogger } = climate;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {/* Driver temp */}
      <button
        onClick={() =>
          setClimate((c) => ({
            ...c,
            activeZone: "left",
            tempLeft: Math.max(16, c.tempLeft - 0.5),
            ...(c.zones === "single" ? { tempRight: Math.max(16, c.tempLeft - 0.5) } : {}),
          }))
        }
        className="text-muted-foreground hover:text-foreground transition-colors text-xs px-1"
      >
        −
      </button>
      <div className="flex items-center gap-1">
        <span className="text-base font-bold font-mono text-climate-warm">{tempLeft}°</span>
        {zones === "dual" && (
          <>
            <span className="text-[9px] text-muted-foreground/60">|</span>
            <span className="text-base font-bold font-mono text-climate-warm">{tempRight}°</span>
          </>
        )}
      </div>
      <button
        onClick={() =>
          setClimate((c) => ({
            ...c,
            activeZone: zones === "dual" ? c.activeZone : "left",
            tempLeft: zones === "single" ? Math.min(30, c.tempLeft + 0.5) : c.tempLeft,
            tempRight: zones === "single" ? Math.min(30, c.tempLeft + 0.5) : c.tempRight,
            ...(zones === "dual" && c.activeZone === "left"
              ? { tempLeft: Math.min(30, c.tempLeft + 0.5) }
              : zones === "dual"
              ? { tempRight: Math.min(30, c.tempRight + 0.5) }
              : {}),
          }))
        }
        className="text-muted-foreground hover:text-foreground transition-colors text-xs px-1"
      >
        +
      </button>

      <div className="w-px h-5 bg-border" />

      {/* Seat heat indicator */}
      <button
        onClick={() => setClimate((c) => ({ ...c, seatHeat: (c.seatHeat + 1) % 4 }))}
        className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          seatHeat > 0 ? "text-climate-warm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heater size={14} />
        {seatHeat > 0 && (
          <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold font-mono text-climate-warm">
            {seatHeat}
          </span>
        )}
      </button>

      {/* Defogger */}
      <button
        onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          defogger ? "text-climate-cool" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Wind size={14} />
      </button>
    </div>
  );
};

export default ClimateWidget;
