import type { LatLong } from '../utils/geo';

const OSRM_TABLE_URL = 'https://router.project-osrm.org/table/v1/driving/';
const REQUEST_TIMEOUT_MS = 10000;

type OsrmTableResponse = {
  code: string;
  distances?: number[][];
};

function fetchWithTimeout(
  url: string,
  ms: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

/**
 * Road (driving) distances, in km, from `origin` to each destination,
 * using the OSRM public routing table. Returns `null` for any leg that
 * could not be routed (same order as `destinations`).
 */
export async function roadDistancesKm(
  origin: LatLong,
  destinations: LatLong[],
): Promise<(number | null)[]> {
  if (destinations.length === 0) {
    return [];
  }

  const coordinates = [origin, ...destinations]
    .map(point => `${point.longitude},${point.latitude}`)
    .join(';');
  const targetIndexes = destinations.map((_, i) => i + 1).join(';');
  const url =
    `${OSRM_TABLE_URL}${coordinates}` +
    `?sources=0&destinations=${targetIndexes}&annotations=distance`;

  try {
    const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
    const body = (await response.json()) as OsrmTableResponse;
    if (body.code !== 'Ok' || !body.distances || body.distances.length === 0) {
      return destinations.map(() => null);
    }
    return destinations.map((_, i) => {
      const meters = body.distances?.[0]?.[i];
      return typeof meters === 'number'
        ? Math.round((meters / 1000) * 10) / 10
        : null;
    });
  } catch (error) {
    console.log('[roadDistance] lookup failed:', error);
    return destinations.map(() => null);
  }
}