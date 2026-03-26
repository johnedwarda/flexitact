import { useState } from "react";
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
  ListMusic,
  Heart,
  Shuffle,
  Repeat,
  Clock,
  Disc3,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

const SOURCES = [
  { id: "music", icon: Music, label: "Music" },
  { id: "radio", icon: Radio, label: "Radio" },
  { id: "podcast", icon: Podcast, label: "Podcast" },
];

const LIBRARY = [
  { title: "Midnight Drive", artist: "Synthwave FM", album: "Night Cruise", duration: "3:45", liked: true },
  { title: "Neon Horizons", artist: "Retrowave Radio", album: "Cyber City", duration: "4:12", liked: false },
  { title: "Electric Dreams", artist: "Cyber Pulse", album: "Digital Dawn", duration: "3:28", liked: true },
  { title: "Starlight Highway", artist: "Astral Beats", album: "Cosmic Ride", duration: "5:01", liked: false },
  { title: "Chrome Sunset", artist: "Synthwave FM", album: "Night Cruise", duration: "4:33", liked: false },
  { title: "Digital Rain", artist: "Neon Flux", album: "Binary", duration: "3:15", liked: true },
  { title: "Turbo Night", artist: "Retro Driver", album: "Speed", duration: "3:58", liked: false },
  { title: "Vapor Trail", artist: "Astral Beats", album: "Cosmic Ride", duration: "4:47", liked: true },
];

type Tab = "playing" | "library" | "sources";

const MediaAppView = () => {
  const { media, setMedia, tracks } = useInfotainment();
  const currentTrack = tracks[media.trackIndex];
  const SourceIcon = SOURCES.find((s) => s.id === media.source)?.icon || Music;
  const [activeTab, setActiveTab] = useState<Tab>("playing");
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof Music }[] = [
    { id: "playing", label: "Now Playing", icon: Disc3 },
    { id: "library", label: "Library", icon: ListMusic },
    { id: "sources", label: "Sources", icon: Radio },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-border/40 bg-card/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "playing" && (
          <NowPlayingView
            media={media}
            setMedia={setMedia}
            currentTrack={currentTrack}
            SourceIcon={SourceIcon}
            tracks={tracks}
            shuffle={shuffle}
            setShuffle={setShuffle}
            repeat={repeat}
            setRepeat={setRepeat}
          />
        )}
        {activeTab === "library" && (
          <LibraryView
            media={media}
            setMedia={setMedia}
            currentTrackIndex={media.trackIndex}
          />
        )}
        {activeTab === "sources" && (
          <SourcesView media={media} setMedia={setMedia} />
        )}
      </div>
    </div>
  );
};

const NowPlayingView = ({
  media,
  setMedia,
  currentTrack,
  SourceIcon,
  tracks,
  shuffle,
  setShuffle,
  repeat,
  setRepeat,
}: any) => (
  <div className="flex flex-col items-center justify-center h-full gap-5 p-6">
    {/* Album art */}
    <div className="w-36 h-36 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
      <SourceIcon size={48} className="text-primary/40 relative z-10" />
    </div>

    {/* Track info */}
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl font-bold">{currentTrack.title}</span>
      <span className="text-sm text-muted-foreground">{currentTrack.artist}</span>
    </div>

    {/* Progress */}
    <div className="w-full max-w-[320px] flex items-center gap-3">
      <span className="text-[10px] font-mono text-muted-foreground">1:23</span>
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-primary rounded-full" />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">3:45</span>
    </div>

    {/* Controls */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => setShuffle(!shuffle)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${shuffle ? "text-primary" : "text-muted-foreground"}`}
      >
        <Shuffle size={16} />
      </button>
      <button
        onClick={() => setMedia((m: any) => ({ ...m, trackIndex: (m.trackIndex - 1 + tracks.length) % tracks.length }))}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <SkipBack size={20} />
      </button>
      <button
        onClick={() => setMedia((m: any) => ({ ...m, playing: !m.playing }))}
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {media.playing ? <Pause size={26} /> : <Play size={26} />}
      </button>
      <button
        onClick={() => setMedia((m: any) => ({ ...m, trackIndex: (m.trackIndex + 1) % tracks.length }))}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <SkipForward size={20} />
      </button>
      <button
        onClick={() => setRepeat(!repeat)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${repeat ? "text-primary" : "text-muted-foreground"}`}
      >
        <Repeat size={16} />
      </button>
    </div>

    {/* Volume */}
    <div className="flex items-center gap-3 w-full max-w-[280px]">
      <button onClick={() => setMedia((m: any) => ({ ...m, muted: !m.muted }))} className="text-muted-foreground hover:text-foreground transition-colors">
        {media.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-150" style={{ width: `${media.muted ? 0 : media.volume}%` }} />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{media.muted ? 0 : media.volume}%</span>
    </div>
  </div>
);

const LibraryView = ({ media, setMedia, currentTrackIndex }: any) => (
  <div className="p-4 space-y-1">
    <div className="flex items-center gap-2 px-2 pb-3">
      <ListMusic size={16} className="text-muted-foreground" />
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Library • {LIBRARY.length} tracks</span>
    </div>
    {LIBRARY.map((track, i) => (
      <button
        key={i}
        onClick={() => setMedia((m: any) => ({ ...m, trackIndex: i % 4, playing: true }))}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
          i % 4 === currentTrackIndex
            ? "bg-primary/10 border border-primary/30"
            : "hover:bg-muted/40 border border-transparent"
        }`}
      >
        <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
          {i % 4 === currentTrackIndex && media.playing ? (
            <Disc3 size={16} className="text-primary animate-spin" style={{ animationDuration: "3s" }} />
          ) : (
            <Music size={14} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-semibold truncate">{track.title}</div>
          <div className="text-[10px] text-muted-foreground truncate">{track.artist} • {track.album}</div>
        </div>
        <Heart
          size={14}
          className={track.liked ? "text-accent fill-accent" : "text-muted-foreground/30"}
        />
        <span className="text-[10px] font-mono text-muted-foreground">{track.duration}</span>
      </button>
    ))}
  </div>
);

const SourcesView = ({ media, setMedia }: any) => (
  <div className="p-6 space-y-3">
    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider px-1">Select Source</span>
    {SOURCES.map((source) => (
      <button
        key={source.id}
        onClick={() => setMedia((m: any) => ({ ...m, source: source.id }))}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
          media.source === source.id
            ? "bg-primary/10 border-primary/40"
            : "bg-muted/20 border-border/30 hover:bg-muted/40"
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          media.source === source.id ? "bg-primary/20" : "bg-muted/40"
        }`}>
          <source.icon size={24} className={media.source === source.id ? "text-primary" : "text-muted-foreground"} />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold">{source.label}</div>
          <div className="text-[10px] text-muted-foreground">
            {source.id === "music" && "Your music library"}
            {source.id === "radio" && "FM / AM / DAB+"}
            {source.id === "podcast" && "Subscribed podcasts"}
          </div>
        </div>
        {media.source === source.id && (
          <div className="w-2 h-2 rounded-full bg-primary" />
        )}
      </button>
    ))}
  </div>
);

export default MediaAppView;
