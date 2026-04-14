import { useEffect } from "react";
import DrivingInfo from "@/components/infotainment/DrivingInfo";
import MapView from "@/components/infotainment/MapView";
import BottomTaskbar from "@/components/infotainment/BottomTaskbar";
import NavigationButtons from "@/components/infotainment/NavigationButtons";
import ClimateAppView from "@/components/infotainment/ClimateAppView";
import MediaAppView from "@/components/infotainment/MediaAppView";
import SettingsAppView from "@/components/infotainment/SettingsAppView";
import AppMenuPopup from "@/components/infotainment/AppMenuPopup";
import { InfotainmentProvider, useInfotainment } from "@/components/infotainment/InfotainmentContext";

const IndexContent = () => {
  const { apps, appMenuOpen, navigateLeft, navigateRight, openApp, minimizeApp } = useInfotainment();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navigateLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          openApp();
          break;
        case "ArrowDown":
          e.preventDefault();
          minimizeApp();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateLeft, navigateRight, openApp, minimizeApp]);

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
      {/* Full-width right pane */}
      <div className="flex-1 min-h-0 relative">
        {renderRightPane()}
      </div>

      {/* Driving info as overlay on left */}
      <DrivingInfo />

      <BottomTaskbar />
      <NavigationButtons />

      {appMenuOpen && <AppMenuPopup />}
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
