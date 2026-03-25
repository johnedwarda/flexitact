import {
  Thermometer,
  Wind,
  CircleDot,
  Heater,
  Columns2,
  Square,
} from "lucide-react";
import { useInfotainment } from "./InfotainmentContext";

const ClimateAppView = () => {
  const { climate } = useInfotainment();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      <h2 className="text-lg font-semibold tracking-wide uppercase text-foreground/80 font-mono">
        Climate Control
      </h2>

      {/* Large temp display */}
      <div className="flex flex-col items-center">
        <span className="text-6xl font-bold font-mono text-climate-warm">
          {climate.temp}°
        </span>
        <span className="text-sm text-muted-foreground mt-1 font-mono">
          {climate.zones === "dual" ? `Zone: ${climate.activeZone}` : "Single Zone"}
        </span>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[300px]">
        <StatusCard
          icon={<Heater size={20} />}
          label="Seat Heat"
          value={climate.seatHeat > 0 ? `Level ${climate.seatHeat}` : "Off"}
          active={climate.seatHeat > 0}
          color="text-climate-warm"
        />
        <StatusCard
          icon={<CircleDot size={20} />}
          label="Steering"
          value={climate.steeringHeat ? "On" : "Off"}
          active={climate.steeringHeat}
          color="text-climate-warm"
        />
        <StatusCard
          icon={<Wind size={20} />}
          label="Defogger"
          value={climate.defogger ? "Active" : "Off"}
          active={climate.defogger}
          color="text-climate-cool"
        />
        <StatusCard
          icon={climate.zones === "dual" ? <Columns2 size={20} /> : <Square size={20} />}
          label="Zones"
          value={climate.zones === "dual" ? "Dual" : "Single"}
          active={true}
          color="text-primary"
        />
      </div>

      <p className="text-[10px] text-muted-foreground/60 font-mono text-center max-w-[280px]">
        Use Control Dial to adjust temperature • Left/Right to switch zones • Center for single zone
      </p>
    </div>
  );
};

const StatusCard = ({
  icon,
  label,
  value,
  active,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  color: string;
}) => (
  <div
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
      active
        ? "bg-muted/60 border-border/60"
        : "bg-muted/20 border-border/20"
    }`}
  >
    <div className={active ? color : "text-muted-foreground/40"}>{icon}</div>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-sm font-semibold font-mono">{value}</span>
  </div>
);

export default ClimateAppView;
