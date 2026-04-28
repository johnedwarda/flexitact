import { useEffect, useState } from "react";
import { User, Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

export const PHONE_FAVORITES = [
  { id: "fav1", name: "Alice", color: "bg-primary/20 text-primary" },
  { id: "fav2", name: "Bob", color: "bg-accent/20 text-accent" },
  { id: "fav3", name: "Carol", color: "bg-climate-warm/20 text-climate-warm" },
  { id: "fav4", name: "Dave", color: "bg-climate-cool/20 text-climate-cool" },
];

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const PhoneWidget = () => {
  const { phoneIndex, highlightedIndex, activeCallIndex, endCall } = useInfotainment();
  const phoneActive = highlightedIndex === 3;

  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (activeCallIndex === null) {
      setDuration(0);
      setMuted(false);
      return;
    }
    setDuration(0);
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [activeCallIndex]);

  if (activeCallIndex !== null) {
    const contact = PHONE_FAVORITES[activeCallIndex];
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${contact.color}`}>
          <User size={14} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold">{contact.name}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{formatDuration(duration)}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMuted((m) => !m);
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            muted ? "text-climate-warm" : "text-muted-foreground hover:text-foreground"
          }`}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            endCall();
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
          title="End call"
        >
          <PhoneOff size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {PHONE_FAVORITES.map((fav, i) => {
        const isActive = phoneActive && phoneIndex === i;
        return (
          <div key={fav.id} className="flex flex-col items-center gap-0.5">
            <div
              className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all ${fav.color} ${
                isActive ? "ring-2 ring-accent" : ""
              }`}
              title={fav.name}
            >
              {isActive ? <Phone size={12} /> : <User size={12} />}
            </div>
            <span
              className={`text-[9px] leading-none transition-colors ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {fav.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PhoneWidget;
