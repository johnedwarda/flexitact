import { Zap, Fuel, Droplets, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

const DrivingInfo = () => {
  const [speed, setSpeed] = useState(72);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(0, Math.min(130, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="absolute top-0 left-0 w-[340px] h-full z-40 pointer-events-none">
      <div className="flex flex-col h-full pointer-events-auto bg-card/70 backdrop-blur-xl border-r border-border/30">
        {/* Top bar: time + temperature */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span className="text-xs font-medium tracking-wide text-foreground">{formattedTime}</span>
          <span className="text-xs text-muted-foreground font-mono">22°C</span>
        </div>

        {/* Main driving info */}
        <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-4">
          {/* Speed + Limit row */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <span className="text-7xl font-bold font-mono tracking-tighter text-foreground animate-speed-pulse">
                {speed}
              </span>
              <div className="flex items-center justify-center w-11 h-11 rounded-full border-[2.5px] border-destructive bg-white">
                <span className="text-base font-bold text-black leading-none">80</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground tracking-widest uppercase mt-1">km/h</span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-[260px]">
            <InfoCard icon={<Fuel size={18} />} label="Battery / Range" value="78% · 342 km" color="text-success" />
            <InfoCard icon={<Zap size={18} />} label="Drive Mode" value="Comfort" color="text-primary" />
            <InfoCard icon={<Droplets size={18} />} label="Wipers" value="Auto" color="text-accent" />
            <InfoCard icon={<Lightbulb size={18} />} label="Lights" value="Auto" color="text-accent" />
          </div>
        </div>
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
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{label}</span>
    <span className="text-sm font-semibold font-mono text-center">{value}</span>
  </div>
);

export default DrivingInfo;
