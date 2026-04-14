import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, User } from "lucide-react";
import { createPortal } from "react-dom";
import { useInfotainment } from "./InfotainmentContext";

const FAVORITES = [
  { id: "fav1", name: "Alice", initials: "A" },
  { id: "fav2", name: "Bob", initials: "B" },
  { id: "fav3", name: "Carol", initials: "C" },
  { id: "fav4", name: "Dan", initials: "D" },
  { id: "fav5", name: "Eve", initials: "E" },
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
    case "incoming": return <PhoneIncoming size={12} className="text-success" />;
    case "outgoing": return <PhoneOutgoing size={12} className="text-primary" />;
    case "missed": return <PhoneMissed size={12} className="text-destructive" />;
    default: return <Phone size={12} />;
  }
};

const PhonePopup = () => {
  const { phoneIndex } = useInfotainment();

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[4.5rem] z-[9999] flex justify-end px-16">
      <div className="pointer-events-auto rounded-2xl border border-border/50 bg-card/95 p-4 shadow-2xl backdrop-blur-xl min-w-[280px]">
        {/* Favorites row */}
        <div className="mb-3">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2 block">Favorites</span>
          <div className="flex items-center gap-3">
            {FAVORITES.map((fav, i) => {
              const isActive = phoneIndex === i;
              return (
                <div key={fav.id} className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {fav.initials}
                  </div>
                  <span className={`text-[9px] mt-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {fav.name}
                  </span>
                  <div
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-6 bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)]"
                        : "w-0 bg-transparent"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border my-2" />

        {/* Recent calls */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1.5 block">Recent</span>
          <div className="flex flex-col gap-1">
            {RECENT_CALLS.map((call, i) => {
              const idx = FAVORITES.length + i;
              const isActive = phoneIndex === idx;
              return (
                <div
                  key={call.id}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-muted/60" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <User size={14} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {call.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {callTypeIcon(call.type)}
                      <span className="text-[10px] text-muted-foreground">{call.time}</span>
                    </div>
                  </div>
                  {isActive && (
                    <Phone size={14} className="text-success" />
                  )}
                  {/* Bright line */}
                  <div
                    className={`absolute -left-0.5 top-1/2 -translate-y-1/2 w-[3px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "h-6 bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)]"
                        : "h-0 bg-transparent"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PhonePopup;
