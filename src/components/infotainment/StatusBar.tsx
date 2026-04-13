import { useState, useEffect } from "react";

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="absolute top-3 right-4 z-50 flex items-center gap-3 px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-border/30">
      <span className="text-xs font-medium tracking-wide">{formattedTime}</span>
      <span className="text-[10px] text-muted-foreground font-mono">22°C</span>
    </div>
  );
};

export default StatusBar;
