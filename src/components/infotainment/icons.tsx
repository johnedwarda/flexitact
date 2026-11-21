import type { ComponentType, ReactNode, SVGProps } from "react";

/**
 * Icons for the infotainment UI. Everything is from lucide-react (the set
 * Lovable generated the app with) except SteeringWheel and SeatHeat, which
 * are custom drawn in the same stroke style because Lucide has no equivalent.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & { size?: number | string };
export type IconType = ComponentType<IconProps>;

export {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Battery,
  BatteryMedium,
  Bluetooth,
  Briefcase,
  CalendarDays,
  Calendar,
  Camera,
  Car,
  CarFront,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  CloudFog,
  CloudRain,
  Delete,
  Disc3,
  Download,
  Eye,
  Film,
  Gamepad2,
  Gauge,
  HardDrive,
  Heart,
  Home,
  Info,
  Languages,
  LayoutGrid,
  ListMusic,
  Lock,
  Map,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  Minus,
  Monitor,
  Moon,
  Music,
  Navigation,
  Palette,
  PanelLeft,
  PanelRight,
  Pause,
  Phone,
  PhoneOff,
  Play,
  Plus,
  Podcast,
  Radio,
  Repeat,
  RotateCcw,
  Search,
  Send,
  Shield,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Snowflake,
  Square,
  Star,
  Sun,
  Thermometer,
  Trophy,
  Users,
  Video,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Wifi,
} from "lucide-react";

const makeStroke = (name: string, children: ReactNode): IconType => {
  const Icon = ({ size = 24, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
};

export const SteeringWheel = makeStroke(
  "SteeringWheel",
  <>
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M2.8 10.5 9.6 11.3M21.2 10.5l-6.8.8M12 14.5V21.5" />
  </>,
);
export const SeatHeat = makeStroke(
  "SeatHeat",
  <>
    <path d="M6 4l2.4 11.5H17a2.5 2.5 0 0 1 2.5 2.5v1.5H6.2" />
    <path d="M12.5 3.5c1.2 1.4-1.2 2.6 0 4s-1.2 2.6 0 4M16.5 3.5c1.2 1.4-1.2 2.6 0 4s-1.2 2.6 0 4" />
  </>,
);

/* Dashboard-style symbols for the driving pane */
export const DriveMode = makeStroke(
  "DriveMode",
  <>
    <circle cx="12" cy="14" r="4.5" />
    <path d="M12 14l2.2-3.7" />
    <path d="M3.8 9.3l1.7 1M7.25 5.8l1 1.7M12 4.5v2M16.75 5.8l-1 1.7M20.2 9.3l-1.7 1" />
  </>,
);
export const Wipers = makeStroke(
  "Wipers",
  <>
    <path d="M2.5 19.5l2.8-12.8a28 28 0 0 1 13.4 0l2.8 12.8z" />
    <path d="M12 19.5L7.5 9.2" />
    <path d="M7.5 9.2l1.4-.6M12 19.5h.01" />
    <path d="M15.5 11.5h.01M17.5 14.5h.01M14 15.5h.01" />
  </>,
);
export const Headlight = makeStroke(
  "Headlight",
  <>
    <path d="M11.5 6.5C8 6.5 5 8.8 5 12s3 5.5 6.5 5.5c.9 0 1.3-.5 1.3-1.6V8.1c0-1.1-.4-1.6-1.3-1.6z" />
    <path d="M16.5 8l4.5 1.5M16.5 12H21.5M16.5 16l4.5-1.5" />
  </>,
);

export const HeatWaves = makeStroke(
  "HeatWaves",
  <path transform="translate(0 2.5)" d="M7 4c1.6 1.8-1.6 3.7 0 5.5s-1.6 3.7 0 5.5M12 4c1.6 1.8-1.6 3.7 0 5.5s-1.6 3.7 0 5.5M17 4c1.6 1.8-1.6 3.7 0 5.5s-1.6 3.7 0 5.5" />,
);
