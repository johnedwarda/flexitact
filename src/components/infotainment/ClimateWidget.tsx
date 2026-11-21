import { useInfotainment } from "./InfotainmentContext";
import { CloudFog, SeatHeat, SteeringWheel, Thermometer } from "./icons";

const ClimateWidget = () => {
  const { climate, setClimate, apps, toggleAppById } = useInfotainment();
  const { temp, seatHeat, steeringHeat, defogger } = climate;
  const isOpen = apps.climate?.state === "opened";

  return (
    <div className="flex items-center gap-3 px-4 py-2 h-14 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
      <button
        onClick={() => toggleAppById("climate")}
        className={`flex items-center justify-center transition-colors ${
          isOpen ? "text-accent" : "text-foreground/80 hover:text-foreground"
        }`}
        title={isOpen ? "Close climate" : "Open climate"}
      >
        <Thermometer size={24} aria-label="Climate" />
      </button>
      {/* Temperature display */}
      <TempDonut temp={temp} />

      <div className="w-px h-6 bg-border mx-1" />

      {/* Seat heating */}
      <button
        onClick={() =>
          setClimate((c) => {
            const level = (c.seatHeat + 1) % 4;
            return { ...c, seatHeat: level, frontSeatHeat: { ...c.frontSeatHeat, driver: level } };
          })
        }
        className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          seatHeat > 0 ? "text-accent" : "text-muted-foreground hover:text-foreground"
        }`}
        title="Seat Heating"
      >
        <SeatHeat size={16} />
        {seatHeat > 0 && (
          <span className="absolute -top-1 -right-1 text-[9px] font-bold font-mono text-accent">
            {seatHeat}
          </span>
        )}
      </button>

      {/* Steering heat */}
      <button
        onClick={() => setClimate((c) => ({ ...c, steeringHeat: !c.steeringHeat }))}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          steeringHeat ? "text-accent" : "text-muted-foreground hover:text-foreground"
        }`}
        title="Steering Wheel Heating"
      >
        <SteeringWheel size={16} />
      </button>

      {/* Defogger */}
      <button
        onClick={() => setClimate((c) => ({ ...c, defogger: !c.defogger }))}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          defogger ? "text-accent" : "text-muted-foreground hover:text-foreground"
        }`}
        title="Windscreen Defogger"
      >
        <CloudFog size={16} />
      </button>
    </div>
  );
};

const TempDonut = ({ temp }: { temp: number }) => {
  const size = 40;
  const strokeWidth = 1.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const min = 16;
  const max = 30;
  const pct = Math.max(0, Math.min(1, (temp - min) / (max - min)));
  const dash = pct * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center text-accent min-w-[48px]"
      style={{ width: size, height: size }}
      aria-label={`Temperature ${temp}°`}
      role="img"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="relative text-xs font-bold font-mono leading-none">{temp}°</span>
    </div>
  );
};

export default ClimateWidget;
