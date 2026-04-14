import { createPortal } from "react-dom";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, User } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

const FAVORITES = [
  { id: "fav1", name: "Alice", color: "bg-primary/20 text-primary" },
  { id: "fav2", name: "Bob", color: "bg-accent/20 text-accent" },
  { id: "fav3", name: "Carol", color: "bg-climate-warm/20 text-climate-warm" },
  { id: "fav4", name: "Dave", color: "bg-climate-cool/20 text-climate-cool" },
  { id: "fav5", name: "Eve", color: "bg-muted-foreground/20 text-muted-foreground" },
];

const RECENT_CALLS = [
  { id: "r1", name: "Alice", time: "2 min ago", type: "incoming" as const },
  { id: "r2", name: "Bob", time: "15 min ago", type: "outgoing" as const },
  { id: "r3", name: "Unknown", time: "1 hr ago", type: "missed" as const },
  { id: "r4", name: "Carol", time: "3 hrs ago", type: "incoming" as const },
];

export const PHONE_ITEMS_COUNT = FAVORITES.length + RECENT_CALLS.length;

const callTypeIcon = (type: string) => {
  switch (type) {
    case "incoming": return <PhoneIncoming size={12} className="text-green-400" />;
    case "outgoing": return <PhoneOutgoing size={12} className="text-primary" />;
    case "missed": return <PhoneMissed size={12} className="text-destructive" />;
    default: return <Phone size={12} />;
  }
};

const PhonePopup = ({ phoneIndex }: { phoneIndex: number }) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[5rem] z-[9999] flex justify-center px-4">
      <div className="pointer-events-auto rounded-2xl border border-border/50 bg-card/95 p-3 shadow-2xl backdrop-blur-xl min-w-[280px] mb-2">
        {/* Favorites */}
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-1">Favorites</div>
        <div className="flex items-center justify-center gap-3 mb-3">
          {FAVORITES.map((fav, i) => {
            const isActive = phoneIndex === i;
            return (
              <div key={fav.id} className="relative flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${fav.color} transition-all ${
                    isActive ? "ring-2 ring-accent" : ""
                  }`}
                >
                  <User size={18} />
                </div>
                <span className={`text-[9px] ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                  {fav.name}
                </span>
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
                    isActive ? "w-6 bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)]" : "w-0 bg-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="h-px bg-border/50 mb-2" />

        {/* Recent calls */}
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 px-1">Recent</div>
        <div className="flex flex-col gap-0.5">
          {RECENT_CALLS.map((call, i) => {
            const idx = FAVORITES.length + i;
            const isActive = phoneIndex === idx;
            return (
              <div
                key={call.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                  isActive ? "bg-accent/10" : ""
                }`}
              >
                {callTypeIcon(call.type)}
                <span className={`text-xs flex-1 ${isActive ? "text-accent font-semibold" : "text-foreground"}`}>
                  {call.name}
                </span>
                <span className="text-[10px] text-muted-foreground">{call.time}</span>
                {isActive && (
                  <Phone size={12} className="text-green-400 ml-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PhonePopup;
