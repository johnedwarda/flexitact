import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Plus,
  Minus,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";
import VolumeDonut from "./VolumeDonut";

const MediaWidget = () => {
  const { media, setMedia, tracks } = useInfotainment();
  const { playing, volume, muted, trackIndex } = media;
  const currentTrack = tracks[trackIndex];

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
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
          className="w-9 h-9 rounded-xl flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
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
      <div className="flex items-center gap-1">
        <button
          onClick={() =>
            setMedia((m) => ({
              ...m,
              volume: Math.max(0, m.volume - 5),
              muted: false,
            }))
          }
          className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Minus size={12} />
        </button>
        <button
          onClick={() => setMedia((m) => ({ ...m, muted: !m.muted }))}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          title={`Volume ${muted ? "muted" : `${volume}%`}`}
        >
          {muted || volume === 0 ? <VolumeX size={16} /> : volume < 33 ? <Volume size={16} /> : volume < 66 ? <Volume1 size={16} /> : <Volume2 size={16} />}
          <VolumeDonut value={volume} muted={muted} size={18} />
        </button>
        <button
          onClick={() =>
            setMedia((m) => ({
              ...m,
              volume: Math.min(100, m.volume + 5),
              muted: false,
            }))
          }
          className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
};

export default MediaWidget;
