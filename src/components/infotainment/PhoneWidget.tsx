import { useEffect, useState } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";
import VolumeDonut from "./VolumeDonut";
import aliceImg from "@/assets/contact-alice.jpg";
import bobImg from "@/assets/contact-bob.jpg";
import carolImg from "@/assets/contact-carol.jpg";
import daveImg from "@/assets/contact-dave.jpg";

export const PHONE_FAVORITES = [
  { id: "fav1", name: "Alice", photo: aliceImg },
  { id: "fav2", name: "Bob", photo: bobImg },
  { id: "fav3", name: "Carol", photo: carolImg },
  { id: "fav4", name: "Dave", photo: daveImg },
];

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const PhoneWidget = () => {
  const { phoneIndex, highlightedIndex, activeCallIndex, endCall, callVolume, callMuted, setCallMuted } = useInfotainment();
  const phoneActive = highlightedIndex === 3;

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (activeCallIndex === null) {
      setDuration(0);
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
        <img
          src={contact.photo}
          alt={contact.name}
          width={28}
          height={28}
          loading="lazy"
          className="w-7 h-7 rounded-full object-cover ring-2 ring-accent"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold">{contact.name}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{formatDuration(duration)}</span>
        </div>
        <div className="text-muted-foreground" title={`Call volume ${callVolume}`}>
          <VolumeDonut value={callVolume} muted={callMuted} size={26} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCallMuted(!callMuted);
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            callMuted ? "text-climate-warm" : "text-muted-foreground hover:text-foreground"
          }`}
          title={callMuted ? "Unmute" : "Mute"}
        >
          {callMuted ? <MicOff size={16} /> : <Mic size={16} />}
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
      <Phone size={16} className="text-muted-foreground" />
      {PHONE_FAVORITES.map((fav, i) => {
        const isActive = phoneActive && phoneIndex === i;
        return (
          <div key={fav.id} className="flex flex-col items-center gap-0.5">
            <div
              className={`relative w-7 h-7 rounded-full overflow-hidden transition-all ${
                isActive ? "border-2 border-accent" : "border-2 border-transparent"
              }`}
              title={fav.name}
            >
              <img
                src={fav.photo}
                alt={fav.name}
                width={28}
                height={28}
                loading="lazy"
                className="w-full h-full object-cover opacity-70"
              />
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
