import { User } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

export const PHONE_FAVORITES = [
  { id: "fav1", name: "Alice", color: "bg-primary/20 text-primary" },
  { id: "fav2", name: "Bob", color: "bg-accent/20 text-accent" },
  { id: "fav3", name: "Carol", color: "bg-climate-warm/20 text-climate-warm" },
  { id: "fav4", name: "Dave", color: "bg-climate-cool/20 text-climate-cool" },
];

const PhoneWidget = () => {
  const { phoneIndex, highlightedIndex } = useInfotainment();
  const phoneActive = highlightedIndex === 3;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {PHONE_FAVORITES.map((fav, i) => {
        const isActive = phoneActive && phoneIndex === i;
        return (
          <button
            key={fav.id}
            className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${fav.color} ${
              isActive ? "ring-2 ring-accent" : ""
            }`}
            title={fav.name}
          >
            <User size={14} />
          </button>
        );
      })}
    </div>
  );
};

export default PhoneWidget;
