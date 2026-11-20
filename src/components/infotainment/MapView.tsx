import { useState } from "react";
import { Home, Briefcase, Search, Square, Navigation2, MapPin } from "lucide-react";

// Static, hand-drawn navigation scene (no map provider, no API key).
const ARTERIAL_A =
  "M 300 720 C 325 600 335 520 330 455 C 325 400 320 360 350 325 C 385 285 450 292 505 268 C 565 242 600 225 622 178 C 638 142 668 118 690 110 C 720 98 760 90 830 60";
// Route follows the arterial from the car's position onward.
const ROUTE =
  "M 330 455 C 325 400 320 360 350 325 C 385 285 450 292 505 268 C 565 242 600 225 622 178 C 638 142 668 118 690 110";
const CAR = { x: 330, y: 455 };
const DEST = { x: 690, y: 110 };

const ARTERIALS = [
  ARTERIAL_A,
  "M -200 540 C -60 520 100 480 200 435 C 290 395 380 425 470 452 C 560 480 650 470 760 410 C 820 378 870 360 920 340",
];
const SECONDARY = [
  "M -200 300 C -80 290 40 335 120 300 C 200 265 285 335 350 325",
  "M 150 -60 C 175 100 140 200 160 300 C 178 385 140 440 120 525 C 105 585 112 660 90 740",
  "M 505 268 C 525 340 495 405 545 458",
  "M 622 178 C 560 150 540 90 470 60 C 430 40 385 55 335 15",
  "M 545 458 C 585 525 640 565 665 740",
  "M 200 435 C 235 500 230 580 270 740",
];
const LOCAL = [
  "M 160 300 C 210 250 240 190 300 170",
  "M 120 525 C 60 560 20 590 -40 600",
  "M 350 325 C 400 360 410 400 395 440",
  "M 470 452 C 450 520 470 580 450 650",
  "M 540 330 C 600 330 650 310 700 330 C 740 345 770 330 800 340",
  "M 622 178 C 680 200 720 190 780 220",
  "M 270 200 C 300 230 300 270 330 300",
  "M 40 400 C 80 380 100 340 120 300",
  "M 690 110 C 650 60 640 20 600 -20",
  "M 760 410 C 740 480 760 540 730 620",
  "M 330 560 C 380 570 430 560 470 580",
];

const StaticMap = () => (
  <svg
    viewBox="-70 0 800 640"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 h-full w-full"
    role="img"
    aria-label="Navigation map"
  >
    <defs>
      <radialGradient id="map-fade" cx="50%" cy="70%" r="75%">
        <stop offset="55%" stopColor="hsl(220 20% 7%)" stopOpacity="0" />
        <stop offset="100%" stopColor="hsl(220 20% 7%)" stopOpacity="0.85" />
      </radialGradient>
      <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <path id="road-a" d={ARTERIAL_A} />
      <path id="road-b" d={ARTERIALS[1]} />
    </defs>

    <rect x="-200" y="-100" width="1200" height="900" fill="hsl(220 20% 8%)" />

    {/* river */}
    <path
      d="M -200 80 C 0 130 110 30 280 70 C 440 105 520 15 660 40 C 760 58 830 0 920 -30"
      fill="none"
      stroke="hsl(215 30% 11.5%)"
      strokeWidth="56"
      strokeLinecap="round"
    />

    {/* parks */}
    <path d="M 385 365 C 405 335 455 340 478 368 C 498 395 478 430 435 432 C 392 428 368 396 385 365 Z" fill="hsl(150 16% 10.5%)" />
    <path d="M 20 330 C 40 300 100 305 105 345 C 108 385 60 400 30 380 C 10 365 8 345 20 330 Z" fill="hsl(150 16% 10.5%)" />
    <path d="M 570 520 C 600 495 680 500 700 540 C 715 580 650 610 600 595 C 560 580 550 540 570 520 Z" fill="hsl(150 16% 10.5%)" />

    {/* road casings */}
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke="hsl(220 20% 6%)">
      {LOCAL.map((d) => <path key={d} d={d} strokeWidth="6" />)}
      {SECONDARY.map((d) => <path key={d} d={d} strokeWidth="11" />)}
      {ARTERIALS.map((d) => <path key={d} d={d} strokeWidth="17" />)}
    </g>
    {/* road fills */}
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {LOCAL.map((d) => <path key={d} d={d} stroke="hsl(220 10% 15%)" strokeWidth="3" />)}
      {SECONDARY.map((d) => <path key={d} d={d} stroke="hsl(220 11% 19%)" strokeWidth="6" />)}
      {ARTERIALS.map((d) => <path key={d} d={d} stroke="hsl(220 12% 24%)" strokeWidth="11" />)}
    </g>

    {/* route */}
    <path d={ROUTE} fill="none" stroke="hsl(205 100% 55%)" strokeOpacity="0.55" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" filter="url(#route-glow)" />
    <path d={ROUTE} fill="none" stroke="hsl(205 100% 58%)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

    {/* street labels */}
    <g fill="hsl(215 12% 42%)" fontSize="10" letterSpacing="2" fontFamily="Inter, sans-serif">
      <text dy="-9">
        <textPath href="#road-b" startOffset="30%">RUE DE RIVOLI</textPath>
      </text>
    </g>

    <rect x="-70" width="800" height="640" fill="url(#map-fade)" pointerEvents="none" />

    {/* destination */}
    <g transform={`translate(${DEST.x - 12} ${DEST.y - 30})`}>
      <circle cx="12" cy="30" r="10" fill="hsl(205 100% 55%)" fillOpacity="0.25" />
      <MapPin x="0" y="0" width="24" height="24" color="hsl(30 95% 55%)" fill="hsl(30 95% 55% / 0.25)" />
    </g>

    {/* vehicle */}
    <g transform={`translate(${CAR.x} ${CAR.y})`}>
      <circle r="26" fill="hsl(205 100% 55%)" fillOpacity="0.15" />
      <circle r="16" fill="hsl(220 20% 7%)" stroke="hsl(205 100% 60%)" strokeWidth="2" />
      <Navigation2 x="-9" y="-10" width="18" height="18" color="hsl(205 100% 60%)" fill="hsl(205 100% 60%)" />
    </g>
  </svg>
);

const MapView = () => {
  const [tripActive, setTripActive] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <StaticMap />

      {tripActive ? (
        <>
          <div className="absolute left-4 top-4 z-[1000]">
            <div className="flex w-[280px] flex-col gap-3 rounded-2xl border border-border/50 bg-card/90 px-4 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <span className="text-base text-primary">↑</span>
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold">Champs-Élysées</span>
                  <span className="text-xs text-muted-foreground">Continue for 1.2 km</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">2.1 km total</span>
                  <span className="font-mono text-primary">1.2 km</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: "65%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>ETA 14:32</span>
                  <span>3 min left</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 z-[1000]">
            <button
              type="button"
              onClick={() => setTripActive(false)}
              className="flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md transition-colors hover:bg-card hover:text-foreground"
            >
              <Square className="h-3.5 w-3.5 fill-current text-destructive/80" />
              Stop Trip
            </button>
          </div>
        </>
      ) : (
        <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
          <button
            type="button"
            onClick={() => setTripActive(true)}
            className="flex items-center gap-2 rounded-full border border-border/50 bg-card/90 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-card"
          >
            <Home className="h-4 w-4 text-primary" />
            Home
          </button>
          <button
            type="button"
            onClick={() => setTripActive(true)}
            className="flex items-center gap-2 rounded-full border border-border/50 bg-card/90 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-card"
          >
            <Briefcase className="h-4 w-4 text-primary" />
            Office
          </button>
          <button
            type="button"
            aria-label="Search destinations"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/90 text-foreground backdrop-blur-md transition-colors hover:bg-card"
          >
            <Search className="h-4 w-4 text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MapView;
