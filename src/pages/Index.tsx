import { useEffect } from "react";

import DrivingInfo from "@/components/infotainment/DrivingInfo";
import MapView from "@/components/infotainment/MapView";
import BottomTaskbar from "@/components/infotainment/BottomTaskbar";
import NavigationButtons from "@/components/infotainment/NavigationButtons";
import ClimateAppView from "@/components/infotainment/ClimateAppView";
import MediaAppView from "@/components/infotainment/MediaAppView";
import SettingsAppView from "@/components/infotainment/SettingsAppView";
import { InfotainmentProvider, useInfotainment } from "@/components/infotainment/InfotainmentContext";

const IndexContent = () => {
  const { apps, navigateLeft, navigateRight, toggleApp, dialLeft, dialRight, dialUp, dialDown, dialRotate, dialCenter } = useInfotainment();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        // Task Switcher: v=left, b=toggle, n=right
        case "v":
          e.preventDefault();
          navigateLeft();
          break;
        case "b":
          e.preventDefault();
          toggleApp();
          break;
        case "n":
          e.preventDefault();
          navigateRight();
          break;
        // Control Dial directional: arrow keys
        case "ArrowLeft":
          e.preventDefault();
          dialLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          dialRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          dialUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          dialDown();
          break;
        // Control Dial rotate: PgUp/PgDown
        case "PageUp":
          e.preventDefault();
          dialRotate("ccw");
          break;
        case "PageDown":
          e.preventDefault();
          dialRotate("cw");
          break;
        // Control Dial center: Enter
        case "Enter":
          e.preventDefault();
          dialCenter();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateLeft, navigateRight, toggleApp, dialLeft, dialRight, dialUp, dialDown, dialRotate, dialCenter]);

  const openedAppId = Object.keys(apps).find((id) => apps[id].state === "opened");

  const renderRightPane = () => {
    switch (openedAppId) {
      case "climate":
        return <ClimateAppView />;
      case "media":
        return <MediaAppView />;
      case "settings":
        return <SettingsAppView />;
      default:
        return <MapView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background relative">
      

      <div className="flex flex-1 min-h-0">
        <div className="w-[340px] flex-shrink-0 border-r border-border bg-card/40">
          <DrivingInfo />
        </div>

        <div className="flex-1 min-w-0 relative">
          {renderRightPane()}
        </div>
      </div>

      <BottomTaskbar />
      <NavigationButtons />
    </div>
  );
};

const Index = () => {
  return (
    <InfotainmentProvider>
      <IndexContent />
    </InfotainmentProvider>
  );
};

export default Index;
