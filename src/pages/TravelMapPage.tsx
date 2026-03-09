import { useState } from "react";
import { mockTrip } from "@/data/mockTrip";
import StopsSidebar from "@/components/StopsSidebar";
import MapView from "@/components/MapView";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

const TravelMapPage = () => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectStop = (id: string) => {
    setSelectedStopId(id);
    if (isMobile) setDrawerOpen(false);
  };

  if (isMobile) {
    return (
      <div className="h-screen w-full relative">
        <MapView trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={setSelectedStopId} />

        {/* Floating button */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] rounded-full w-12 h-12 shadow-lg bg-primary text-primary-foreground"
            >
              <List className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0">
            <StopsSidebar trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={handleSelectStop} />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex">
      <aside className="w-[340px] flex-shrink-0 border-r overflow-hidden">
        <StopsSidebar trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={handleSelectStop} />
      </aside>
      <main className="flex-1">
        <MapView trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={handleSelectStop} />
      </main>
    </div>
  );
};

export default TravelMapPage;
