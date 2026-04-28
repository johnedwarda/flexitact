import { User, Phone, PhoneOff } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

export const PHONE_FAVORITES = [
  { id: "fav1", name: "Alice", color: "bg-primary/20 text-primary" },
  { id: "fav2", name: "Bob", color: "bg-accent/20 text-accent" },
  { id: "fav3", name: "Carol", color: "bg-climate-warm/20 text-climate-warm" },
  { id: "fav4", name: "Dave", color: "bg-climate-cool/20 text-climate-cool" },
];

const PhoneWidget = () => {
  const { phoneIndex, highlightedIndex, activeCallIndex } = useInfotainment();
  const phoneActive = highlightedIndex === 3;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {PHONE_FAVORITES.map((fav, i) => {
        const isActive = phoneActive && phoneIndex === i;
        const isInCall = activeCallIndex === i;
        return (
          <div key={fav.id} className="flex flex-col items-center gap-0.5">
            <div
              className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all ${fav.color} ${
                isActive ? "ring-2 ring-accent" : ""
              }`}
              title={fav.name}
            >
              {isInCall ? <PhoneOff size={12} /> : isActive ? <Phone size={12} /> : <User size={12} />}
            </div>
            <span
              className={`text-[9px] leading-none transition-colors ${
                isInCall ? "text-destructive" : isActive ? "text-accent" : "text-muted-foreground"
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
