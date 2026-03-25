import StatusBar from "@/components/infotainment/StatusBar";
import DrivingInfo from "@/components/infotainment/DrivingInfo";
import MapView from "@/components/infotainment/MapView";
import BottomTaskbar from "@/components/infotainment/BottomTaskbar";
import NavigationButtons from "@/components/infotainment/NavigationButtons";

const Index = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <StatusBar />

      <div className="flex flex-1 min-h-0">
        {/* Left: Driving Info */}
        <div className="w-[340px] flex-shrink-0 border-r border-border bg-card/40">
          <DrivingInfo />
        </div>

        {/* Right: Map */}
        <div className="flex-1 min-w-0">
          <MapView />
        </div>
      </div>

      <BottomTaskbar />
      <NavigationButtons />
    </div>
  );
};

export default Index;
