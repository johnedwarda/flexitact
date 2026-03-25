import { useState } from "react";
import { Minus, Plus, CircleDot, Heater, Wind } from "lucide-react";

const ClimateWidget = () => {
  const [temp, setTemp] = useState(22);
  const [seatHeat, setSeatHeat] = useState(1);
  const [steeringHeat, setSteeringHeat] = useState(false);
  const [defogger, setDefogger] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {/* Temperature control */}
      <button
        onClick={() => setTemp((t) => Math.max(16, t - 0.5))}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors text-secondary-foreground"
      >
        <Minus size={14} />
      </button>
      <span className="text-lg font-bold font-mono text-climate-warm min-w-[48px] text-center">
        {temp}°
      </span>
      <button
        onClick={() => setTemp((t) => Math.min(30, t + 0.5))}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors text-secondary-foreground"
      >
        <Plus size={14} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Seat heating */}
      <button
        onClick={() => setSeatHeat((s) => (s + 1) % 4)}
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
        onClick={() => setSteeringHeat((s) => !s)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          steeringHeat ? "bg-climate-warm/20 text-climate-warm" : "bg-secondary text-muted-foreground"
        }`}
        title="Steering Wheel Heating"
      >
        <CircleDot size={16} />
      </button>

      {/* Defogger */}
      <button
        onClick={() => setDefogger((d) => !d)}
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
