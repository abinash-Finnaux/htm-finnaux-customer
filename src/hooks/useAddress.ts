import { useEffect, useState } from 'react';
import { reverseGeocode } from '../services/reverseGeocode';
import type { LatLong } from '../utils/geo';

export function useAddress(coords: LatLong | null) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const latitude = coords?.latitude;
  const longitude = coords?.longitude;

  useEffect(() => {
    let cancelled = false;
    if (coords === null || latitude === undefined || longitude === undefined) {
      setAddress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    reverseGeocode({ latitude, longitude }).then(addr => {
      if (!cancelled) {
        setAddress(addr);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [coords, latitude, longitude]);

  return { address, loading };
}