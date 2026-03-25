import { Settings, Menu } from "lucide-react";
import ClimateWidget from "./ClimateWidget";
import MediaWidget from "./MediaWidget";

const BottomTaskbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card/80 backdrop-blur-md border-t border-border z-50">
      {/* Settings */}
      <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
        <Settings size={20} />
      </button>

      {/* Widgets */}
      <div className="flex items-center gap-3 overflow-x-auto">
        <ClimateWidget />
        <MediaWidget />
      </div>

      {/* Menu */}
      <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
        <Menu size={20} />
      </button>
    </div>
  );
};

export default BottomTaskbar;
