import type { LatLong } from '../utils/geo';

const ADDRESS_CACHE = new Map<string, string>();

type AddressParts = {
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city_district?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

function cleanPart(value?: string): string {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function buildAddress(input?: AddressParts): string {
  const parts: AddressParts = input ?? {};
  const line1 = [
    cleanPart(parts.road),
    cleanPart(parts.neighbourhood),
    cleanPart(parts.suburb),
  ]
    .filter(Boolean)
    .join(', ');

  const city =
    cleanPart(parts.city) ||
    cleanPart(parts.town) ||
    cleanPart(parts.village) ||
    cleanPart(parts.municipality) ||
    cleanPart(parts.city_district);

  const pin = cleanPart(parts.postcode);
  const line2 = [city, pin ? `- ${pin}` : ''].filter(Boolean).join(' ');

  const region = [
    cleanPart(parts.state_district) || cleanPart(parts.county),
    cleanPart(parts.state),
    cleanPart(parts.country),
  ]
    .filter(Boolean)
    .join(', ');

  return [line1, line2, region].filter(Boolean).join('\n');
}

export async function reverseGeocode(
  point: LatLong,
): Promise<string | null> {
  if (
    !point ||
    !Number.isFinite(point.latitude) ||
    !Number.isFinite(point.longitude)
  ) {
    return null;
  }

  const key = `${point.latitude.toFixed(6)},${point.longitude.toFixed(6)}`;
  const cached = ADDRESS_CACHE.get(key);
  if (cached) {
    return cached;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${point.latitude}&lon=${point.longitude}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      console.log('[reverseGeocode] response not ok:', response.status);
      return null;
    }
    const data = await response.json();
    const result = buildAddress(data?.address as AddressParts | undefined);
    if (!result) {
      return null;
    }
    ADDRESS_CACHE.set(key, result);
    return result;
  } catch (error) {
    console.log('[reverseGeocode] error:', error);
    return null;
  }
}