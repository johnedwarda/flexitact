import StatusBar from "@/components/infotainment/StatusBar";
import DrivingInfo from "@/components/infotainment/DrivingInfo";
import MapView from "@/components/infotainment/MapView";
import BottomTaskbar from "@/components/infotainment/BottomTaskbar";
import NavigationButtons from "@/components/infotainment/NavigationButtons";
import ClimateAppView from "@/components/infotainment/ClimateAppView";
import MediaAppView from "@/components/infotainment/MediaAppView";
import { InfotainmentProvider, useInfotainment } from "@/components/infotainment/InfotainmentContext";

const IndexContent = () => {
  const { apps } = useInfotainment();

  // Find which app is currently opened
  const openedAppId = Object.keys(apps).find((id) => apps[id].state === "opened");

  const renderRightPane = () => {
    switch (openedAppId) {
      case "climate":
        return <ClimateAppView />;
      case "media":
        return <MediaAppView />;
      default:
        return <MapView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <StatusBar />

      <div className="flex flex-1 min-h-0">
        {/* Left: Driving Info */}
        <div className="w-[340px] flex-shrink-0 border-r border-border bg-card/40">
          <DrivingInfo />
        </div>

        {/* Right: Map or App */}
        <div className="flex-1 min-w-0">
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
