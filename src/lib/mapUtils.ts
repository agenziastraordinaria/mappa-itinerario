import { Stop } from "@/data/mockTrip";

export function stopsToRouteGeoJSON(stops: Stop[]): GeoJSON.Feature<GeoJSON.LineString> {
  const sorted = [...stops].sort((a, b) => a.order - b.order);
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: sorted.map((s) => [s.longitude, s.latitude]),
    },
  };
}

export function stopsToPointsGeoJSON(stops: Stop[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: stops.map((s) => ({
      type: "Feature",
      properties: {
        id: s.id,
        title: s.title,
        order: s.order,
        date: s.date,
        description: s.description,
        image: s.image,
        
      },
      geometry: {
        type: "Point",
        coordinates: [s.longitude, s.latitude],
      },
    })),
  };
}

export function getBounds(stops: Stop[]): [[number, number], [number, number]] {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const s of stops) {
    if (s.longitude < minLng) minLng = s.longitude;
    if (s.latitude < minLat) minLat = s.latitude;
    if (s.longitude > maxLng) maxLng = s.longitude;
    if (s.latitude > maxLat) maxLat = s.latitude;
  }
  return [[minLng, minLat], [maxLng, maxLat]];
}
