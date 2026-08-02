import { useState } from "react";
import { Camera, Circle, Download, HardDrive, Square } from "lucide-react";

const CLIPS = [
  { label: "Front · 09:41", size: "182 MB" },
  { label: "Rear · 09:12", size: "164 MB" },
  { label: "Front · 08:55", size: "201 MB" },
  { label: "Left · 08:30", size: "143 MB" },
];

const DashcamAppView = () => {
  const [recording, setRecording] = useState(true);
  const [camera, setCamera] = useState("Front");

  return (
    <div className="h-full w-full flex flex-col p-6 gap-5">
      <header className="flex items-center gap-3">
        <Camera size={18} className="text-muted-foreground" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Dashcam</h1>
      </header>

      <div className="flex-1 min-h-0 flex gap-5">
        <div className="flex-1 flex flex-col gap-3">
          <div className="relative flex-1 rounded-2xl border border-border/50 bg-muted/20 overflow-hidden flex items-center justify-center">
            <span className="text-xs text-muted-foreground">{camera} camera live feed</span>
            {recording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[11px] text-destructive">
                <Circle size={8} className="fill-current animate-pulse" /> REC
              </div>
            )}
            <div className="absolute bottom-3 right-3 text-[11px] text-muted-foreground font-mono">1080p · 30fps</div>
          </div>

          <div className="flex items-center gap-2">
            {["Front", "Rear", "Left", "Right"].map((c) => (
              <button
                key={c}
                onClick={() => setCamera(c)}
                className={`px-4 py-2 rounded-2xl text-xs border transition-colors ${
                  camera === c ? "border-accent text-foreground bg-accent/10" : "border-border/60 text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setRecording((r) => !r)}
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-2xl text-xs border ${
                recording ? "border-destructive/60 text-destructive bg-destructive/10" : "border-border/60 text-muted-foreground"
              }`}
            >
              {recording ? <Square size={12} className="fill-current" /> : <Circle size={12} className="fill-current" />}
              {recording ? "Stop" : "Record"}
            </button>
          </div>
        </div>

        <aside className="w-64 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <HardDrive size={13} /> 42 GB of 64 GB used
          </div>
          <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
            <div className="h-full w-[66%] bg-accent" />
          </div>
          <ul className="flex-1 min-h-0 overflow-auto divide-y divide-border/40">
            {CLIPS.map((c) => (
              <li key={c.label} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs text-foreground">{c.label}</div>
                  <div className="text-[10px] text-muted-foreground">{c.size}</div>
                </div>
                <Download size={14} className="text-muted-foreground" />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashcamAppView;
