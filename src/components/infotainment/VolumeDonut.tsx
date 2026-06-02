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

  const [showNumber, setShowNumber] = useState(false);
  const prevValueRef = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      if (!muted) {
        setShowNumber(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShowNumber(false), 1000);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, muted]);

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
      {showNumber && !muted ? (
        <span
          className="relative font-mono font-bold leading-none"
          style={{ fontSize: Math.round(size * 0.42) }}
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
