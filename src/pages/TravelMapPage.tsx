import { useState } from "react";
import { mockTrip, Stop } from "@/data/mockTrip";
import StopsSidebar from "@/components/StopsSidebar";
import MapView from "@/components/MapView";
import StopDetailPanel from "@/components/StopDetailPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

const TravelMapPage = () => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailStop, setDetailStop] = useState<Stop | null>(null);
  const isMobile = useIsMobile();

  const handleSelectStop = (id: string) => {
    setSelectedStopId(id);
    if (isMobile) setDrawerOpen(false);
  };

  const handleOpenDetail = (stop: Stop) => {
    setDetailStop(stop);
  };

  if (isMobile) {
    return (
      <div className="h-screen w-full relative">
        <MapView trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={setSelectedStopId} />

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
            <StopsSidebar trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={handleSelectStop} onOpenDetail={handleOpenDetail} />
          </SheetContent>
        </Sheet>

        <StopDetailPanel stop={detailStop} onClose={() => setDetailStop(null)} />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex">
      <aside className="w-[340px] flex-shrink-0 border-r overflow-hidden">
        <StopsSidebar trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={handleSelectStop} onOpenDetail={handleOpenDetail} />
      </aside>
      <main className="flex-1 relative">
        <MapView trip={mockTrip} selectedStopId={selectedStopId} onSelectStop={handleSelectStop} />
      </main>
      <StopDetailPanel stop={detailStop} onClose={() => setDetailStop(null)} />
    </div>
  );
};

export default TravelMapPage;
