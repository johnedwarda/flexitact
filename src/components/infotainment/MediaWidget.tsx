import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Music,
  Podcast,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

const sources = [
  { id: "music", icon: Music, label: "Music" },
  { id: "radio", icon: Radio, label: "Radio" },
  { id: "podcast", icon: Podcast, label: "Podcast" },
];

const MediaWidget = () => {
  const { media, setMedia, tracks } = useInfotainment();
  const { playing, volume, muted, source, trackIndex } = media;
  const currentTrack = tracks[trackIndex];

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {/* Source selector */}
      <div className="flex items-center gap-1">
        {sources.map((s) => (
          <button
            key={s.id}
            onClick={() => setMedia((m) => ({ ...m, source: s.id }))}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              source === s.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={s.label}
          >
            <s.icon size={14} />
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Track info */}
      <div className="flex flex-col min-w-[100px]">
        <span className="text-xs font-semibold truncate">{currentTrack.title}</span>
        <span className="text-[10px] text-muted-foreground truncate">{currentTrack.artist}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() =>
            setMedia((m) => ({
              ...m,
              trackIndex: (m.trackIndex - 1 + tracks.length) % tracks.length,
            }))
          }
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={() => setMedia((m) => ({ ...m, playing: !m.playing }))}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() =>
            setMedia((m) => ({
              ...m,
              trackIndex: (m.trackIndex + 1) % tracks.length,
            }))
          }
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <SkipForward size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Volume */}
      <button
        onClick={() => setMedia((m) => ({ ...m, muted: !m.muted }))}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={muted ? 0 : volume}
        onChange={(e) => {
          setMedia((m) => ({ ...m, volume: Number(e.target.value), muted: false }));
        }}
        className="w-16 h-1 accent-primary cursor-pointer"
      />
    </div>
  );
};

export default MediaWidget;
