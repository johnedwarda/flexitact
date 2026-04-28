interface VolumeDonutProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  muted?: boolean;
  className?: string;
}

const VolumeDonut = ({ value, size = 18, strokeWidth = 2.5, muted = false, className }: VolumeDonutProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (muted ? 0 : clamped / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`Volume ${muted ? "muted" : `${clamped}%`}`}
      role="img"
    >
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
  );
};

export default VolumeDonut;
