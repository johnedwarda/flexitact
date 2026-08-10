import { useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Delete, Star, Clock, Users } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";
import alice from "@/assets/contact-alice.jpg";
import bob from "@/assets/contact-bob.jpg";
import carol from "@/assets/contact-carol.jpg";
import dave from "@/assets/contact-dave.jpg";

const CONTACTS = [
  { name: "Alice", number: "+1 415 555 0134", photo: alice },
  { name: "Bob", number: "+1 415 555 0192", photo: bob },
  { name: "Carol", number: "+1 415 555 0177", photo: carol },
  { name: "Dave", number: "+1 415 555 0148", photo: dave },
];

const RECENTS = [
  { name: "Alice", when: "10:24", dir: "Incoming" },
  { name: "Dave", when: "09:02", dir: "Outgoing" },
  { name: "Carol", when: "Yesterday", dir: "Missed" },
  { name: "Bob", when: "Yesterday", dir: "Outgoing" },
];

const TABS = [
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "recents", label: "Recents", icon: Clock },
  { id: "keypad", label: "Keypad", icon: Users },
] as const;

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

const PhoneAppView = () => {
  const { activeCallIndex, startCall, endCall, callMuted, setCallMuted } = useInfotainment();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("favorites");
  const [dialed, setDialed] = useState("");

  const inCall = activeCallIndex !== null && activeCallIndex !== undefined;
  const callee = inCall ? CONTACTS[activeCallIndex as number] : null;

  return (
    <div className="h-full w-full flex flex-col px-6 pt-3 pb-6 gap-5">
      <header className="flex h-6 items-center gap-3">
        <Phone size={18} className="text-muted-foreground" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Phone</h1>
      </header>

      {inCall && callee ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <img
            src={callee.photo}
            alt={`${callee.name} contact portrait`}
            className="w-28 h-28 rounded-full object-cover opacity-80"
          />
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">{callee.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{callee.number}</div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCallMuted(!callMuted)}
              className={`h-14 w-14 rounded-full flex items-center justify-center border transition-colors ${
                callMuted ? "bg-accent/20 border-accent text-accent" : "border-border text-muted-foreground"
              }`}
              aria-label={callMuted ? "Unmute call" : "Mute call"}
            >
              {callMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={() => endCall()}
              className="h-14 w-14 rounded-full flex items-center justify-center bg-destructive/20 border border-destructive/60 text-destructive"
              aria-label="End call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <nav className="flex gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs border transition-colors ${
                  tab === id
                    ? "border-accent text-foreground bg-accent/10"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-h-0 overflow-auto">
            {tab === "favorites" && (
              <div className="grid grid-cols-4 gap-4">
                {CONTACTS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => startCall(i)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 hover:border-accent transition-colors"
                  >
                    <img
                      src={c.photo}
                      alt={`${c.name} contact portrait`}
                      className="w-16 h-16 rounded-full object-cover opacity-70"
                    />
                    <span className="text-xs text-foreground">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.number}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === "recents" && (
              <ul className="divide-y divide-border/40">
                {RECENTS.map((r, i) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm text-foreground">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground">{r.dir}</div>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{r.when}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "keypad" && (
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 text-xl tracking-widest text-foreground">{dialed || "\u00A0"}</div>
                <div className="grid grid-cols-3 gap-3">
                  {KEYS.map((k) => (
                    <button
                      key={k}
                      onClick={() => setDialed((d) => d + k)}
                      className="h-14 w-14 rounded-full border border-border/60 text-foreground text-lg"
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDialed((d) => d.slice(0, -1))}
                    className="h-12 px-5 rounded-2xl border border-border/60 text-muted-foreground flex items-center gap-2 text-xs"
                  >
                    <Delete size={14} /> Delete
                  </button>
                  <button
                    onClick={() => startCall(0)}
                    className="h-12 px-5 rounded-2xl bg-accent/15 border border-accent text-accent flex items-center gap-2 text-xs"
                  >
                    <Phone size={14} /> Call
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PhoneAppView;
