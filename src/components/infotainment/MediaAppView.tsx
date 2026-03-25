import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Podcast,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

const sourceIcons: Record<string, typeof Music> = {
  music: Music,
  radio: Radio,
  podcast: Podcast,
};

const MediaAppView = () => {
  const { media, tracks } = useInfotainment();
  const currentTrack = tracks[media.trackIndex];
  const SourceIcon = sourceIcons[media.source] || Music;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      <h2 className="text-lg font-semibold tracking-wide uppercase text-foreground/80 font-mono">
        Now Playing
      </h2>

      {/* Album art placeholder */}
      <div className="w-32 h-32 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center">
        <SourceIcon size={48} className="text-primary/40" />
      </div>

      {/* Track info */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl font-bold">{currentTrack.title}</span>
        <span className="text-sm text-muted-foreground">{currentTrack.artist}</span>
      </div>

      {/* Progress bar (decorative) */}
      <div className="w-full max-w-[300px] flex items-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground">1:23</span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-primary rounded-full" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">3:45</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <SkipBack size={22} className="text-muted-foreground" />
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          {media.playing ? <Pause size={24} /> : <Play size={24} />}
        </div>
        <SkipForward size={22} className="text-muted-foreground" />
      </div>

      {/* Volume indicator */}
      <div className="flex items-center gap-2">
        {media.muted ? <VolumeX size={16} className="text-muted-foreground" /> : <Volume2 size={16} className="text-muted-foreground" />}
        <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-150"
            style={{ width: `${media.muted ? 0 : media.volume}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
          {media.muted ? 0 : media.volume}%
        </span>
      </div>

      <p className="text-[10px] text-muted-foreground/60 font-mono text-center max-w-[280px]">
        Use Control Dial to adjust volume • Left/Right for prev/next • Center to play/pause
      </p>
    </div>
  );
};

export default MediaAppView;
