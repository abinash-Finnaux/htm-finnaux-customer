export type LatLong = {
  latitude: number;
  longitude: number;
};

export function parseLatLong(value?: string | null): LatLong | null {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const parts = value
    .split(',')
    .map(part => Number(part.trim()))
    .filter(Number.isFinite);
  if (parts.length < 2) {
    return null;
  }
  const [lat, lng] = parts;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return null;
  }
  return { latitude: lat, longitude: lng };
}

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number): number => (deg * Math.PI) / 180;

export function distanceKm(a: LatLong, b: LatLong): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const s =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  const clamped = Math.min(1, Math.max(0, s));
  const centralAngle =
    2 * Math.atan2(Math.sqrt(clamped), Math.sqrt(1 - clamped));
  console.log('centralAngleLOG', centralAngle);

  return EARTH_RADIUS_KM * centralAngle;
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
