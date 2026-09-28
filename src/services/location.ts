import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { LatLong } from '../utils/geo';

export type LocationResult =
  | { status: 'ok'; coords: LatLong; accuracy: number | null }
  | { status: 'denied' }
  | { status: 'unavailable'; code: number; message: string };

async function ensureLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      return true;
    }
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

function tryGetPosition(
  enableHighAccuracy: boolean,
  timeout: number,
  maximumAge: number,
): Promise<LocationResult> {
  return new Promise(resolve => {
    try {
      Geolocation.getCurrentPosition(
        position =>
          resolve({
            status: 'ok',
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            accuracy:
              typeof position.coords.accuracy === 'number'
                ? position.coords.accuracy
                : null,
          }),
        error =>
          resolve({
            status: 'unavailable',
            code: error.code,
            message: error.message || 'no message',
          }),
        { enableHighAccuracy, timeout, maximumAge },
      );
    } catch (error) {
      resolve({
        status: 'unavailable',
        code: -1,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

export async function getCurrentPosition(): Promise<LocationResult> {
  const allowed = await ensureLocationPermission();
  if (!allowed) {
    return { status: 'denied' };
  }

  const freshFix = await tryGetPosition(true, 10000, 0);
  if (freshFix.status === 'ok') {
    return freshFix;
  }

  const cachedFix = await tryGetPosition(false, 5000, 600000);
  if (cachedFix.status === 'ok') {
    console.log('[Location] using cached/low-accuracy position');
    return { status: 'ok', coords: cachedFix.coords, accuracy: null };
  }

  return cachedFix;
}