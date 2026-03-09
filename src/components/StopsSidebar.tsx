import { useState } from "react";
import { Trip, Stop } from "@/data/mockTrip";
import StopCard from "./StopCard";
import { MapPin } from "lucide-react";

interface StopsSidebarProps {
  trip: Trip;
  selectedStopId: string | null;
  onSelectStop: (id: string) => void;
  onOpenDetail: (stop: Stop) => void;
}

const StopsSidebar = ({ trip, selectedStopId, onSelectStop, onOpenDetail }: StopsSidebarProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    onSelectStop(id);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-5 border-b">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Itinerario
          </span>
        </div>
        <h1 className="text-xl font-bold text-foreground">{trip.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {trip.stops.length} tappe
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {trip.stops.map(stop => (
          <StopCard
            key={stop.id}
            stop={stop}
            isExpanded={expandedId === stop.id}
            onToggle={() => handleToggle(stop.id)}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </div>
  );
};

export default StopsSidebar;
