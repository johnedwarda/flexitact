import {
  Music,
  Radio,
  Podcast,
  ListMusic,
  Heart,
  Disc3,
  Search,
  Shuffle,
  Repeat,
} from "lucide-react";
import { useState } from "react";
import { useInfotainment } from "./InfotainmentContext";

const SOURCES = [
  { id: "music", icon: Music, label: "Music" },
  { id: "radio", icon: Radio, label: "Radio" },
  { id: "podcast", icon: Podcast, label: "Podcasts" },
];

const LIBRARY: Record<string, { title: string; artist: string; album: string; duration: string; liked: boolean }[]> = {
  music: [
    { title: "Midnight Drive", artist: "Synthwave FM", album: "Night Cruise", duration: "3:45", liked: true },
    { title: "Neon Horizons", artist: "Retrowave Radio", album: "Cyber City", duration: "4:12", liked: false },
    { title: "Electric Dreams", artist: "Cyber Pulse", album: "Digital Dawn", duration: "3:28", liked: true },
    { title: "Starlight Highway", artist: "Astral Beats", album: "Cosmic Ride", duration: "5:01", liked: false },
    { title: "Chrome Sunset", artist: "Synthwave FM", album: "Night Cruise", duration: "4:33", liked: false },
    { title: "Digital Rain", artist: "Neon Flux", album: "Binary", duration: "3:15", liked: true },
    { title: "Turbo Night", artist: "Retro Driver", album: "Speed", duration: "3:58", liked: false },
    { title: "Vapor Trail", artist: "Astral Beats", album: "Cosmic Ride", duration: "4:47", liked: true },
  ],
  radio: [
    { title: "BBC Radio 1", artist: "FM 98.8", album: "Live", duration: "LIVE", liked: true },
    { title: "Jazz FM", artist: "FM 102.2", album: "Live", duration: "LIVE", liked: false },
    { title: "Classic Rock", artist: "FM 100.7", album: "Live", duration: "LIVE", liked: true },
    { title: "Capital", artist: "FM 95.8", album: "Live", duration: "LIVE", liked: false },
    { title: "Heart", artist: "FM 106.2", album: "Live", duration: "LIVE", liked: false },
    { title: "Kiss FM", artist: "FM 100.0", album: "Live", duration: "LIVE", liked: false },
  ],
  podcast: [
    { title: "The Daily", artist: "NYT", album: "News", duration: "24:10", liked: true },
    { title: "Lex Fridman Show", artist: "Lex Fridman", album: "Conversations", duration: "2:15:00", liked: true },
    { title: "Hard Fork", artist: "NYT", album: "Tech", duration: "58:22", liked: false },
    { title: "Acquired", artist: "Ben & David", album: "Business", duration: "3:42:11", liked: false },
    { title: "How I Built This", artist: "NPR", album: "Founders", duration: "47:30", liked: false },
  ],
};

const MediaAppView = () => {
  const { media, setMedia, tracks } = useInfotainment();
  const currentTrack = tracks[media.trackIndex];
  const SourceIcon = SOURCES.find((s) => s.id === media.source)?.icon || Music;
  const items = LIBRARY[media.source] ?? LIBRARY.music;
  const [query, setQuery] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");

  const filtered = items.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header: source pills + search */}
      <div className="flex flex-col gap-3 px-5 pt-5 pb-3 border-b border-border/40 bg-card/40">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground/70 font-mono">
            Media
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            <ListMusic size={12} /> {filtered.length} {media.source === "radio" ? "stations" : "items"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {SOURCES.map((s) => {
            const active = media.source === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setMedia((m) => ({ ...m, source: s.id }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-colors ${
                  active
                    ? "bg-primary/15 text-primary border-primary/40"
                    : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground"
                }`}
              >
                <s.icon size={13} />
                {s.label}
              </button>
            );
          })}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border border-border/40">
            <Search size={13} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-transparent outline-none text-xs font-mono placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </div>

      {/* Combined library list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {filtered.map((track, i) => {
          const isCurrent = i % 4 === media.trackIndex;
          return (
            <button
              key={`${media.source}-${i}`}
              onClick={() => setMedia((m) => ({ ...m, trackIndex: i % 4, playing: true }))}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isCurrent
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-muted/40 border border-transparent"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                {isCurrent && media.playing ? (
                  <Disc3 size={16} className="text-primary animate-spin" style={{ animationDuration: "3s" }} />
                ) : (
                  <SourceIcon size={14} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold truncate">{track.title}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {track.artist} • {track.album}
                </div>
              </div>
              <Heart
                size={14}
                className={track.liked ? "text-accent fill-accent" : "text-muted-foreground/30"}
              />
              <span className="text-[10px] font-mono text-muted-foreground w-12 text-right">
                {track.duration}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-xs font-mono text-muted-foreground">
            No results
          </div>
        )}
      </div>

      {/* Persistent mini bar: now-playing + shuffle/repeat */}
      <div className="border-t border-border/40 bg-card/60 px-5 py-3 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {media.playing ? (
            <Disc3 size={18} className="text-primary animate-spin" style={{ animationDuration: "3s" }} />
          ) : (
            <SourceIcon size={18} className="text-primary/70" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{currentTrack.title}</div>
          <div className="text-[10px] text-muted-foreground truncate">{currentTrack.artist}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-colors ${
              shuffle
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground"
            }`}
            title="Shuffle"
          >
            <Shuffle size={13} />
            Shuffle
          </button>
          <button
            onClick={() => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-colors ${
              repeat !== "off"
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground"
            }`}
            title="Repeat"
          >
            <Repeat size={13} />
            {repeat === "one" ? "Repeat 1" : "Repeat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaAppView;
