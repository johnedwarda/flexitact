import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Minus,
  Plus,
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
  const displayVol = muted ? 0 : volume;

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
                ? "text-primary"
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

      {/* Volume +/- */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setMedia((m) => ({ ...m, muted: !m.muted }))}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={() => setMedia((m) => ({ ...m, volume: Math.max(0, m.volume - 5), muted: false }))}
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="text-xs font-mono min-w-[24px] text-center text-muted-foreground">{displayVol}</span>
        <button
          onClick={() => setMedia((m) => ({ ...m, volume: Math.min(100, m.volume + 5), muted: false }))}
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
};

export default MediaWidget;
