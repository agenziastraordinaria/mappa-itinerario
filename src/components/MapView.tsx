import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Trip, Stop } from "@/data/mockTrip";
import { stopsToRouteGeoJSON, stopsToPointsGeoJSON, getBounds } from "@/lib/mapUtils";

const MAPBOX_TOKEN = "pk.eyJ1IjoidmluY2dpdXJhIiwiYSI6ImNtbWpueTE2dTA5c2QycnNhZ2Q1ejQwNjYifQ.L9WxOIajAYznHCgugUZxMQ";

const MARKER_LAYER = "stops-symbols";
const MARKER_SOURCE = "stops";
const SELECTED_LAYER = "stops-selected";

interface MapViewProps {
  trip: Trip;
  selectedStopId: string | null;
  onSelectStop: (id: string) => void;
}

/** Generate a numbered circle image for use as a symbol icon */
function generateMarkerImage(
  order: number,
  size: number,
  bg: string,
  border: string
): ImageData {
  const canvas = document.createElement("canvas");
  const ratio = window.devicePixelRatio || 1;
  const px = size * ratio;
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(ratio, ratio);

  const r = size / 2;

  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  ctx.arc(r, r, r - 3, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.lineWidth = 3;
  ctx.strokeStyle = border;
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = `bold ${size * 0.38}px 'DM Sans', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(order), r, r + 1);

  return ctx.getImageData(0, 0, px, px);
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
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const onSelectStopRef = useRef(onSelectStop);
  onSelectStopRef.current = onSelectStop;
  const readyRef = useRef(false);

  // Initialize map once
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
      // Register marker images for each stop
      const markerSize = 38;
      for (const stop of trip.stops) {
        const defaultImg = generateMarkerImage(stop.order, markerSize, "hsl(210, 70%, 45%)", "white");
        const activeImg = generateMarkerImage(stop.order, markerSize + 10, "hsl(24, 80%, 55%)", "white");
        map.addImage(`marker-${stop.order}`, defaultImg, { pixelRatio: window.devicePixelRatio || 1 });
        map.addImage(`marker-active-${stop.order}`, activeImg, { pixelRatio: window.devicePixelRatio || 1 });
      }

      // Route line
      map.addSource("route", { type: "geojson", data: stopsToRouteGeoJSON(trip.stops) });
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

      // Stops source
      map.addSource(MARKER_SOURCE, { type: "geojson", data: stopsToPointsGeoJSON(trip.stops) });

      // Default markers layer
      map.addLayer({
        id: MARKER_LAYER,
        type: "symbol",
        source: MARKER_SOURCE,
        layout: {
          "icon-image": ["concat", "marker-", ["get", "order"]],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
        filter: ["!=", ["get", "id"], ""],
      });

      // Selected marker layer (rendered on top)
      map.addLayer({
        id: SELECTED_LAYER,
        type: "symbol",
        source: MARKER_SOURCE,
        layout: {
          "icon-image": ["concat", "marker-active-", ["get", "order"]],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
        filter: ["==", ["get", "id"], ""],
      });

      // Click handler
      map.on("click", MARKER_LAYER, (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          onSelectStopRef.current(feature.properties.id);
        }
      });
      map.on("click", SELECTED_LAYER, (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          onSelectStopRef.current(feature.properties.id);
        }
      });

      // Pointer cursor on hover
      map.on("mouseenter", MARKER_LAYER, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", MARKER_LAYER, () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", SELECTED_LAYER, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", SELECTED_LAYER, () => { map.getCanvas().style.cursor = ""; });

      // Fit bounds
      const bounds = getBounds(trip.stops);
      map.fitBounds(bounds, { padding: 80, duration: 0 });

      readyRef.current = true;
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selection filter + flyTo + popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) {
      // If map not ready yet, retry after style load
      const handler = () => {
        updateSelection();
        map?.off("load", handler);
      };
      map?.on("load", handler);
      return;
    }
    updateSelection();

    function updateSelection() {
      const map = mapRef.current;
      if (!map) return;

      // Update filters to swap which layer renders the selected marker
      if (map.getLayer(MARKER_LAYER)) {
        map.setFilter(MARKER_LAYER, selectedStopId
          ? ["!=", ["get", "id"], selectedStopId]
          : ["!=", ["get", "id"], ""]
        );
      }
      if (map.getLayer(SELECTED_LAYER)) {
        map.setFilter(SELECTED_LAYER, selectedStopId
          ? ["==", ["get", "id"], selectedStopId]
          : ["==", ["get", "id"], ""]
        );
      }

      if (!selectedStopId) return;

      const stop = trip.stops.find((s) => s.id === selectedStopId);
      if (!stop) return;

      map.flyTo({ center: [stop.longitude, stop.latitude], zoom: 8, duration: 1200 });

      popupRef.current?.remove();
      const popup = new mapboxgl.Popup({ offset: 24, maxWidth: "300px", closeButton: true })
        .setLngLat([stop.longitude, stop.latitude])
        .setHTML(createPopupHTML(stop))
        .addTo(map);
      popupRef.current = popup;
    }
  }, [selectedStopId, trip.stops]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MapView;
