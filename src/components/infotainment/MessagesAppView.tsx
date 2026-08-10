import { useState } from "react";
import { MessageSquare, Send, Mic } from "lucide-react";

const THREADS = [
  {
    name: "Alice",
    preview: "See you at 7?",
    messages: [
      { from: "them", text: "Hey, are you on the road?" },
      { from: "me", text: "Just left the office." },
      { from: "them", text: "See you at 7?" },
    ],
  },
  {
    name: "Bob",
    preview: "Charger on level 2 is free",
    messages: [
      { from: "them", text: "Charger on level 2 is free" },
    ],
  },
  {
    name: "Carol",
    preview: "Thanks for the ride!",
    messages: [{ from: "them", text: "Thanks for the ride!" }],
  },
  {
    name: "Dave",
    preview: "Call me when you park",
    messages: [{ from: "them", text: "Call me when you park" }],
  },
];

const QUICK = ["On my way", "Running late", "Can't talk, driving", "OK"];

const MessagesAppView = () => {
  const [active, setActive] = useState(THREADS[0].name);
  const thread = THREADS.find((t) => t.name === active)!;

  return (
    <div className="h-full w-full flex flex-col px-6 pt-3 pb-6 gap-5">
      <header className="flex h-6 items-center gap-3">
        <MessageSquare size={18} className="text-muted-foreground" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Messages</h1>
      </header>

      <div className="flex-1 min-h-0 flex gap-5">
        <ul className="w-60 flex-shrink-0 min-h-0 overflow-auto divide-y divide-border/40">
          {THREADS.map((t) => (
            <li key={t.name}>
              <button
                onClick={() => setActive(t.name)}
                className={`w-full text-left py-3 px-2 rounded-xl ${
                  active === t.name ? "bg-accent/10 text-foreground" : "text-muted-foreground"
                }`}
              >
                <div className="text-xs">{t.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{t.preview}</div>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0 overflow-auto flex flex-col gap-2 pr-1">
            {thread.messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-xs ${
                  m.from === "me"
                    ? "self-end bg-accent/15 border border-accent/50 text-foreground"
                    : "self-start bg-muted/25 border border-border/40 text-foreground"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button
                key={q}
                className="px-4 py-2 rounded-2xl border border-border/60 text-[11px] text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border/50 px-4 py-2">
            <Mic size={15} className="text-muted-foreground" />
            <span className="flex-1 text-[11px] text-muted-foreground">Dictate a reply…</span>
            <Send size={15} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesAppView;
