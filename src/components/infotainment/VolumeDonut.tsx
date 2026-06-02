import { useEffect, useRef, useState } from "react";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";

interface VolumeDonutProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  muted?: boolean;
  iconSize?: number;
  className?: string;
}

const VolumeDonut = ({
  value,
  size = 26,
  strokeWidth = 1.25,
  muted = false,
  iconSize,
  className,
}: VolumeDonutProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (muted ? 0 : clamped / 100) * circumference;
  const Icon = muted || clamped === 0 ? VolumeX : clamped < 33 ? Volume : clamped < 66 ? Volume1 : Volume2;
  const innerIconSize = iconSize ?? Math.round(size * 0.5);

  const [numberVisibleUntil, setNumberVisibleUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const previousValueRef = useRef(clamped);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showNumber = !muted && now < numberVisibleUntil;

  useEffect(() => {
    if (previousValueRef.current === clamped) {
      return;
    }
    previousValueRef.current = clamped;
    if (muted) return;
    const visibleUntil = Date.now() + 1600;
    setNumberVisibleUntil(visibleUntil);
    setNow(Date.now());
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNow(Date.now()), 1600);
  }, [clamped, muted]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-label={`Volume ${muted ? "muted" : `${clamped}%`}`}
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
          className={muted ? "opacity-0" : "text-primary"}
        />
      </svg>
      {showNumber ? (
        <span
          className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-background/90 font-mono font-black leading-none text-primary tabular-nums ring-1 ring-primary/50"
          style={{ fontSize: Math.max(11, Math.round(size * 0.46)) }}
        >
          {clamped}
        </span>
      ) : (
        <Icon size={innerIconSize} className="relative" />
      )}
    </div>
  );
};

export default VolumeDonut;
