import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";
import VolumeDonut from "./VolumeDonut";

const MediaWidget = () => {
  const { media, setMedia, tracks } = useInfotainment();
  const { playing, volume, muted, trackIndex } = media;
  const currentTrack = tracks[trackIndex];

  return (
    <div className="flex items-center gap-3 px-4 py-2 h-14 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      <Music size={16} className="text-muted-foreground" aria-label="Media" />
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
          className="w-9 h-9 rounded-xl flex items-center justify-center text-accent hover:text-accent/80 transition-colors"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
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
        title={`Volume ${muted ? "muted" : `${volume}%`}`}
      >
        <VolumeDonut value={volume} muted={muted} />
      </button>
    </div>
  );
};

export default MediaWidget;
