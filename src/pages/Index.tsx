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

      <div className="flex flex-1 min-h-0 relative">
        {/* Full-width right pane (map or app) */}
        <div className="flex-1 min-w-0">
          {renderRightPane()}
        </div>

        {/* Left: Floating Driving Info */}
        <div className="absolute left-4 top-4 bottom-4 w-[280px] rounded-3xl bg-card/70 backdrop-blur-xl border border-border/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-10 overflow-hidden">
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
