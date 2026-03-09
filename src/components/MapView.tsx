import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Trip, Stop } from "@/data/mockTrip";
import StopPopup from "./StopPopup";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  trip: Trip;
  selectedStopId: string | null;
  onSelectStop: (id: string) => void;
}

function createIcon(order: number, isActive: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="custom-marker ${isActive ? "active" : ""}">${order}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

function MapController({ stop }: { stop: Stop | null }) {
  const map = useMap();
  useEffect(() => {
    if (stop) {
      map.flyTo([stop.latitude, stop.longitude], 8, { duration: 1 });
    }
  }, [stop, map]);
  return null;
}

function PopupOpener({ stop, markerRefs }: { stop: Stop | null; markerRefs: React.MutableRefObject<Record<string, L.Marker>> }) {
  useEffect(() => {
    if (stop && markerRefs.current[stop.id]) {
      setTimeout(() => markerRefs.current[stop.id]?.openPopup(), 400);
    }
  }, [stop, markerRefs]);
  return null;
}

const MapView = ({ trip, selectedStopId, onSelectStop }: MapViewProps) => {
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const selectedStop = trip.stops.find(s => s.id === selectedStopId) || null;

  const polylinePositions = useMemo(
    () => trip.stops.map(s => [s.latitude, s.longitude] as [number, number]),
    [trip.stops]
  );

  return (
    <MapContainer
      center={trip.mapCenter}
      zoom={trip.zoom}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapController stop={selectedStop} />
      <PopupOpener stop={selectedStop} markerRefs={markerRefs} />

      <Polyline
        positions={polylinePositions}
        pathOptions={{ color: "hsl(210, 70%, 45%)", weight: 3, opacity: 0.5, dashArray: "8 6" }}
      />

      {trip.stops.map(stop => (
        <Marker
          key={stop.id}
          position={[stop.latitude, stop.longitude]}
          icon={createIcon(stop.order, selectedStopId === stop.id)}
          ref={el => { if (el) markerRefs.current[stop.id] = el; }}
          eventHandlers={{ click: () => onSelectStop(stop.id) }}
        >
          <Popup>
            <StopPopup stop={stop} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
