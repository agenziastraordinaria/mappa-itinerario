import { Trip } from "@/data/mockTrip";
import StopCard from "./StopCard";
import { MapPin } from "lucide-react";

interface StopsSidebarProps {
  trip: Trip;
  selectedStopId: string | null;
  onSelectStop: (id: string) => void;
}

const StopsSidebar = ({ trip, selectedStopId, onSelectStop }: StopsSidebarProps) => {
  const visited = trip.stops.filter(s => s.status === "visited").length;

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-5 border-b">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trip Planner
          </span>
        </div>
        <h1 className="font-display text-xl font-bold text-foreground">{trip.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {visited} of {trip.stops.length} stops visited
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-travel-green rounded-full transition-all"
            style={{ width: `${(visited / trip.stops.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stops list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {trip.stops.map(stop => (
          <StopCard
            key={stop.id}
            stop={stop}
            isActive={selectedStopId === stop.id}
            onClick={() => onSelectStop(stop.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StopsSidebar;
