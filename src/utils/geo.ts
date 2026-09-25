export type LatLong = {
  latitude: number;
  longitude: number;
};

export function parseLatLong(value?: string | null): LatLong | null {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const [lat, lng] = value
    .split(',')
    .map(part => Number(part.trim()))
    .filter(Number.isFinite);
  if (lat === undefined || lng === undefined) {
    return null;
  }
  return { latitude: lat, longitude: lng };
}

export function distanceKm(a: LatLong, b: LatLong): number {
  const R = 6371;
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}