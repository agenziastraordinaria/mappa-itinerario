import { useRef, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Trip, Stop } from "@/data/mockTrip";
import { stopsToRouteGeoJSON, getBounds } from "@/lib/mapUtils";

const MAPBOX_TOKEN = "pk.eyJ1IjoidmluY2dpdXJhIiwiYSI6ImNtbWpueTE2dTA5c2QycnNhZ2Q1ejQwNjYifQ.L9WxOIajAYznHCgugUZxMQ";

interface MapViewProps {
  trip: Trip;
  selectedStopId: string | null;
  onSelectStop: (id: string) => void;
}

function createMarkerEl(stop: Stop, isActive: boolean): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "mapbox-marker";
  if (isActive) el.classList.add("active");

  el.style.cssText = `
    width: 34px; height: 34px; border-radius: 50%;
    background: ${isActive ? "hsl(24, 80%, 55%)" : "hsl(210, 70%, 45%)"};
    color: white; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px;
    border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.25);
    cursor: pointer; transition: transform 0.2s;
    transform: scale(${isActive ? 1.35 : 1});
    z-index: ${isActive ? 10 : 1};
  `;
  el.textContent = String(stop.order);
  return el;
}

function createPopupHTML(stop: Stop): string {
  return `
    <div style="width:280px;overflow:hidden;font-family:'DM Sans',sans-serif">
      ${stop.image ? `
        <div style="position:relative;height:140px">
          <img src="${stop.image}" alt="${stop.title}" style="width:100%;height:100%;object-fit:cover" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div>
          <div style="position:absolute;bottom:8px;left:12px;right:12px">
            <h3 style="color:white;font-family:'Playfair Display',serif;font-weight:700;font-size:18px;margin:0;line-height:1.2">${stop.title}</h3>
            <p style="color:rgba(255,255,255,0.8);font-size:12px;margin:4px 0 0">${stop.date}</p>
          </div>
        </div>
      ` : `
        <div style="padding:12px 12px 0">
          <h3 style="font-family:'Playfair Display',serif;font-weight:700;font-size:18px;margin:0">${stop.title}</h3>
          <p style="color:#888;font-size:12px;margin:4px 0 0">${stop.date}</p>
        </div>
      `}
      <div style="padding:10px 12px 12px">
        <p style="font-size:13px;line-height:1.5;margin:0;color:#333">${stop.description}</p>
      </div>
    </div>
  `;
}

const MapView = ({ trip, selectedStopId, onSelectStop }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const onSelectStopRef = useRef(onSelectStop);
  onSelectStopRef.current = onSelectStop;

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [trip.mapCenter[1], trip.mapCenter[0]],
      zoom: trip.zoom,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      // Route line
      const routeGeo = stopsToRouteGeoJSON(trip.stops);
      map.addSource("route", { type: "geojson", data: routeGeo });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "hsl(210, 70%, 45%)",
          "line-width": 3,
          "line-dasharray": [2, 2],
          "line-opacity": 0.6,
        },
      });

      // Fit bounds
      const bounds = getBounds(trip.stops);
      map.fitBounds(bounds, { padding: 80, duration: 0 });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create / update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    trip.stops.forEach((stop) => {
      const isActive = selectedStopId === stop.id;
      const el = createMarkerEl(stop, isActive);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectStopRef.current(stop.id);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([stop.longitude, stop.latitude])
        .addTo(map);

      markersRef.current[stop.id] = marker;
    });
  }, [trip.stops, selectedStopId]);

  // Fly to selected stop + show popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedStopId) return;

    const stop = trip.stops.find((s) => s.id === selectedStopId);
    if (!stop) return;

    map.flyTo({ center: [stop.longitude, stop.latitude], zoom: 8, duration: 1200 });

    // Close previous popup
    popupRef.current?.remove();

    const popup = new mapboxgl.Popup({ offset: 24, maxWidth: "300px", closeButton: true })
      .setLngLat([stop.longitude, stop.latitude])
      .setHTML(createPopupHTML(stop))
      .addTo(map);

    popupRef.current = popup;
  }, [selectedStopId, trip.stops]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MapView;
