import { Gauge, BatteryMedium, CarFront } from "lucide-react";
import { useState, useEffect } from "react";

const DrivingInfo = () => {
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
        <InfoCard icon={<BatteryMedium size={24} />} label="Battery / Range" value="78% · 342 km" color="text-success" />
        <InfoCard icon={<Gauge size={24} />} label="Drive Mode" value="Comfort" color="text-primary" />
        <InfoCard icon={<WiperIcon />} label="Wipers" value="Auto" color="text-accent" />
        <InfoCard icon={<CarFront size={24} />} label="Lights" value="Auto" color="text-accent" />
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
  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/40">
    <div className="text-muted-foreground">{icon}</div>
    <span className="text-[8px] text-muted-foreground uppercase tracking-wider text-center">{label}</span>
    <span className={`text-[10px] font-semibold font-mono text-center ${color}`}>{value}</span>
  </div>
);

const WiperIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7c0-3 4-5 8-5s8 2 8 5v11H4V7z" />
    <path d="M12 18V11" />
    <path d="M8 15h8" />
  </svg>
);

export default DrivingInfo;
