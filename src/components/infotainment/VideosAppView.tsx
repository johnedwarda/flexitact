import { useState } from "react";
import { Video, Play, Clock } from "lucide-react";

const VIDEOS = [
  { title: "Coastal Drive 4K", channel: "Scenic Routes", length: "12:04" },
  { title: "EV Tech Explained", channel: "Volt Weekly", length: "08:31" },
  { title: "Mountain Pass Timelapse", channel: "Skyline", length: "04:12" },
  { title: "Cabin Sound Check", channel: "Audio Lab", length: "15:47" },
  { title: "City Night Loop", channel: "Urban Frames", length: "22:10" },
  { title: "Winter Test Drive", channel: "Cold Start", length: "09:55" },
];

const VideosAppView = () => {
  const [selected, setSelected] = useState(VIDEOS[0]);

  return (
    <div className="h-full w-full flex flex-col p-6 gap-5">
      <header className="flex items-center gap-3">
        <Video size={18} className="text-muted-foreground" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Videos</h1>
        <span className="ml-auto text-[11px] text-muted-foreground">Playback paused while driving</span>
      </header>

      <div className="flex-1 min-h-0 flex gap-5">
        <div className="flex-[1.4] flex flex-col gap-3 min-w-0">
          <div className="relative flex-1 rounded-2xl border border-border/50 bg-muted/20 flex items-center justify-center">
            <button className="h-14 w-14 rounded-full border border-accent bg-accent/15 text-accent flex items-center justify-center">
              <Play size={20} />
            </button>
          </div>
          <div className="min-w-0">
            <div className="text-sm text-foreground truncate">{selected.title}</div>
            <div className="text-[11px] text-muted-foreground">
              {selected.channel} · {selected.length}
            </div>
          </div>
          <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
            <div className="h-full w-[18%] bg-accent" />
          </div>
        </div>

        <ul className="w-72 flex-shrink-0 min-h-0 overflow-auto divide-y divide-border/40">
          {VIDEOS.map((v) => (
            <li key={v.title}>
              <button
                onClick={() => setSelected(v)}
                className={`w-full flex items-center gap-3 py-3 text-left ${
                  selected.title === v.title ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <div className="h-12 w-20 flex-shrink-0 rounded-lg bg-muted/25 flex items-center justify-center">
                  <Video size={14} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs truncate">{v.title}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> {v.length}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideosAppView;
