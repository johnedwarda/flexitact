import { Gauge, BatteryMedium, CloudRain, CarFront } from "lucide-react";
import { useState, useEffect } from "react";
import { useInfotainment } from "./InfotainmentContext";

const DrivingInfo = () => {
  const { openSettingsSection } = useInfotainment();
  const [speed, setSpeed] = useState(72);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="relative flex flex-col items-center justify-center h-full gap-6 px-6 py-4">
      {/* Time */}
      <div className="absolute top-3 left-3 text-xs font-medium tracking-wide text-foreground">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      {/* Outside temperature */}
      <div className="absolute top-3 right-3 text-xs text-muted-foreground font-mono">22°C</div>
      {/* Speed + Limit row */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4">
          <span className="text-7xl font-bold font-mono tracking-tighter text-foreground animate-speed-pulse">
            {speed}
          </span>
          {/* Road sign style speed limit */}
          <div className="flex items-center justify-center w-11 h-11 rounded-full border-[2.5px] border-destructive bg-white">
            <span className="text-base font-bold text-black leading-none">80</span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground tracking-widest uppercase mt-1">km/h</span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[260px]">
        <InfoCard icon={<BatteryMedium size={24} />} label="Battery / Range" value="78% · 342 km" color="text-success" onClick={() => openSettingsSection("battery")} />
        <InfoCard icon={<Gauge size={24} />} label="Drive Mode" value="Comfort" color="text-primary" onClick={() => openSettingsSection("vehicle")} />
        <InfoCard icon={<CloudRain size={24} />} label="Wipers" value="Auto" color="text-accent" onClick={() => openSettingsSection("safety")} />
        <InfoCard icon={<CarFront size={24} />} label="Lights" value="Auto" color="text-accent" onClick={() => openSettingsSection("vehicle")} />
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/40 transition-colors hover:bg-muted/70 active:bg-muted"
  >
    <div className="text-muted-foreground">{icon}</div>
    <span className="text-[8px] text-muted-foreground uppercase tracking-wider text-center">{label}</span>
    <span className="text-[10px] font-semibold font-mono text-center">{value}</span>
  </button>
);

export default DrivingInfo;
