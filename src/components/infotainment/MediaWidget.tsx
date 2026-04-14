import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

const MediaWidget = () => {
  const { media, setMedia, tracks } = useInfotainment();
  const { playing, volume, muted, trackIndex } = media;
  const currentTrack = tracks[trackIndex];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      {/* Track info */}
      <div className="flex flex-col min-w-[80px] max-w-[100px]">
        <span className="text-[11px] font-semibold truncate">{currentTrack.title}</span>
        <span className="text-[9px] text-muted-foreground truncate">{currentTrack.artist}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() =>
            setMedia((m) => ({
              ...m,
              trackIndex: (m.trackIndex - 1 + tracks.length) % tracks.length,
            }))
          }
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <SkipBack size={13} />
        </button>
        <button
          onClick={() => setMedia((m) => ({ ...m, playing: !m.playing }))}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
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
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <SkipForward size={13} />
        </button>
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Volume */}
      <button
        onClick={() => setMedia((m) => ({ ...m, muted: !m.muted }))}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
      <span className="text-[9px] font-mono text-muted-foreground min-w-[16px] text-center">
        {muted ? 0 : volume}
      </span>
    </div>
  );
};

export default MediaWidget;
