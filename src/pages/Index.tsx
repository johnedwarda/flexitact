import StatusBar from "@/components/infotainment/StatusBar";
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
  const { apps, appMenuOpen } = useInfotainment();

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
      <StatusBar />

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
