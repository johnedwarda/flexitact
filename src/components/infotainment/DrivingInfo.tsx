import { Gauge, CircleAlert, Zap, Fuel, Navigation } from "lucide-react";
import { useState, useEffect } from "react";

const DrivingInfo = () => {
  const [speed, setSpeed] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(0, Math.min(130, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 py-4">
      {/* Speed + Limit row */}
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center">
          <span className="text-7xl font-bold font-mono tracking-tighter text-foreground animate-speed-pulse">
            {speed}
          </span>
          <span className="text-sm text-muted-foreground tracking-widest uppercase mt-1">km/h</span>
        </div>

        {/* Road sign style speed limit */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full border-[3px] border-destructive bg-white">
          <span className="text-xl font-bold text-black leading-none">80</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[260px]">
        <InfoCard icon={<Zap size={18} />} label="Drive Mode" value="Comfort" color="text-primary" />
        <InfoCard icon={<Gauge size={18} />} label="Range" value="342 km" color="text-success" />
        <InfoCard icon={<Fuel size={18} />} label="Battery" value="78%" color="text-success" />
        <InfoCard icon={<Navigation size={18} />} label="ETA" value="14 min" color="text-accent" />
      </div>

      {/* Gear indicator */}
      <div className="flex items-center gap-3 mt-2">
        {["P", "R", "N", "D"].map((gear) => (
          <span
            key={gear}
            className={`text-lg font-bold font-mono w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              gear === "D"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground bg-muted/50"
            }`}
          >
            {gear}
          </span>
        ))}
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => (
  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/40 border border-border/50">
    <div className={color}>{icon}</div>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-sm font-semibold font-mono">{value}</span>
  </div>
);

export default DrivingInfo;
