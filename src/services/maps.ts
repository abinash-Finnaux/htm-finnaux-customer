import { Linking } from 'react-native';
import type { LatLong } from '../utils/geo';

export async function openInMaps(point: LatLong): Promise<boolean> {
  if (
    !point ||
    !Number.isFinite(point.latitude) ||
    !Number.isFinite(point.longitude)
  ) {
    return false;
  }
  const url = `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`;
  try {
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.log('[openInMaps] error:', error);
    return false;
  }
}