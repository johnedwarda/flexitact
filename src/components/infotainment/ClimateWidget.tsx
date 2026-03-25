import { useInfotainment } from "./InfotainmentContext";
import { Minus, Plus, CircleDot, Heater, Wind } from "lucide-react";

const ClimateWidget = () => {
  const { climate, setClimate } = useInfotainment();
  const { temp, seatHeat, steeringHeat, defogger } = climate;

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {/* Temperature control */}
      <button
        onClick={() => setClimate((c) => ({ ...c, temp: Math.max(16, c.temp - 0.5) }))}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors text-secondary-foreground"
      >
        <Minus size={14} />
      </button>
      <span className="text-lg font-bold font-mono text-climate-warm min-w-[48px] text-center">
        {temp}°
      </span>
      <button
        onClick={() => setClimate((c) => ({ ...c, temp: Math.min(30, c.temp + 0.5) }))}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors text-secondary-foreground"
      >
        <Plus size={14} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Seat heating */}
      <button
        onClick={() => setClimate((c) => ({ ...c, seatHeat: (c.seatHeat + 1) % 4 }))}
        className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          seatHeat > 0 ? "bg-climate-warm/20 text-climate-warm" : "bg-secondary text-muted-foreground"
        }`}
        title="Seat Heating"
      >
        <Heater size={16} />
        {seatHeat > 0 && (
          <span className="absolute -top-1 -right-1 text-[9px] font-bold font-mono text-climate-warm">
            {seatHeat}
          </span>
        )}
      </button>

      {/* Steering heat */}
      <button
        onClick={() => setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          steeringHeat ? "bg-climate-warm/20 text-climate-warm" : "bg-secondary text-muted-foreground"
        }`}
        title="Steering Wheel Heating"
      >
        <CircleDot size={16} />
      </button>

      {/* Defogger */}
      <button
        onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          defogger ? "bg-climate-cool/20 text-climate-cool" : "bg-secondary text-muted-foreground"
        }`}
        title="Windscreen Defogger"
      >
        <Wind size={16} />
      </button>
    </div>
  );
};

export default ClimateWidget;
