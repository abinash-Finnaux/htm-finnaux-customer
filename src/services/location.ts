import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { LatLong } from '../utils/geo';

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

export function getCurrentPosition(): Promise<LatLong | null> {
  return new Promise(resolve => {
    ensureLocationPermission().then(allowed => {
      if (!allowed) {
        resolve(null);
        return;
      }

      try {
        Geolocation.getCurrentPosition(
          position =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          error => {
            console.log('[Location] getCurrentPosition error:', error);
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      } catch (error) {
        console.log('[Location] getCurrentPosition threw:', error);
        resolve(null);
      }
    });
  });
}