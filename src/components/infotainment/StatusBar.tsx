import { Signal, Wifi, Battery, Bluetooth, ThermometerSun } from "lucide-react";
import { useState, useEffect } from "react";

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedDate = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-card/80 backdrop-blur-md border-b border-border z-50">
      {/* Left: connectivity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-success">
          <Signal size={14} />
          <span className="text-xs font-mono">5G</span>
        </div>
        <div className="flex items-center gap-1.5 text-primary">
          <Wifi size={14} />
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Bluetooth size={14} />
          <span className="text-xs font-mono">Connected</span>
        </div>
      </div>

      {/* Center: time & date */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-wide font-mono">{formattedTime}</span>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>

      {/* Right: system info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ThermometerSun size={14} />
          <span className="text-xs font-mono">22°C</span>
        </div>
        <div className="flex items-center gap-1.5 text-success">
          <Battery size={14} />
          <span className="text-xs font-mono">87%</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
