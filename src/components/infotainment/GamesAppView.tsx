import { useState } from "react";
import { Gamepad2, Play, Trophy } from "lucide-react";

const GAMES = [
  { name: "Circuit Rush", genre: "Racing", best: "01:42.6" },
  { name: "Block Drop", genre: "Puzzle", best: "18,420" },
  { name: "Star Sweep", genre: "Arcade", best: "9,780" },
  { name: "Word Lane", genre: "Word", best: "Level 24" },
  { name: "Chess Cabin", genre: "Board", best: "1420 Elo" },
  { name: "Trail Runner", genre: "Endless", best: "3,105 m" },
];

const GamesAppView = () => {
  const [selected, setSelected] = useState(GAMES[0].name);
  const game = GAMES.find((g) => g.name === selected)!;

  return (
    <div className="h-full w-full flex flex-col p-6 gap-5">
      <header className="flex items-center gap-3">
        <Gamepad2 size={18} className="text-muted-foreground" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Games</h1>
        <span className="ml-auto text-[11px] text-muted-foreground">Available while parked</span>
      </header>

      <div className="flex-1 min-h-0 flex gap-5">
        <div className="flex-1 min-h-0 overflow-auto grid grid-cols-3 gap-4 content-start">
          {GAMES.map((g) => (
            <button
              key={g.name}
              onClick={() => setSelected(g.name)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                selected === g.name ? "border-accent bg-accent/10" : "border-border/50 hover:border-border"
              }`}
            >
              <div className="h-20 rounded-xl bg-muted/25 mb-3 flex items-center justify-center">
                <Gamepad2 size={22} className="text-muted-foreground" />
              </div>
              <div className="text-xs text-foreground">{g.name}</div>
              <div className="text-[10px] text-muted-foreground">{g.genre}</div>
            </button>
          ))}
        </div>

        <aside className="w-64 rounded-2xl border border-border/50 p-5 flex flex-col gap-4">
          <div className="text-sm text-foreground">{game.name}</div>
          <div className="text-[11px] text-muted-foreground">{game.genre}</div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Trophy size={13} /> Best: {game.best}
          </div>
          <button className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-accent/15 border border-accent text-accent text-xs">
            <Play size={14} /> Play
          </button>
        </aside>
      </div>
    </div>
  );
};

export default GamesAppView;
