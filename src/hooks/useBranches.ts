import { useCallback, useEffect, useState } from 'react';
import { masterGetBranches, type BranchMaster } from '../api/masters';
import {
  getCurrentPosition,
  type LocationResult,
} from '../services/location';
import { roadDistancesKm } from '../services/roadDistance';
import {
  distanceKm,
  formatDistance,
  parseLatLong,
  type LatLong,
} from '../utils/geo';

let cachedBranches: BranchMaster[] | null = null;
let inFlight: Promise<BranchMaster[]> | null = null;

export type RankedBranch = {
  branch: BranchMaster;
  distanceKm: number | null;
  distanceText: string;
  straightDistanceKm: number | null;
  roadDistanceKm: number | null;
  coords: LatLong | null;
};

export type NearestBranch = RankedBranch;

export const TEST_COORDS: LatLong = { latitude: 26.9124, longitude: 75.7873 };

function rankBranches(
  branches: BranchMaster[],
  position: LatLong,
): RankedBranch[] {
  return branches
    .map(branch => {
      const branchPoint = parseLatLong(branch.Branch_LatLong);
      if (!branchPoint) {
        return {
          branch,
          distanceKm: null,
          distanceText: '',
          straightDistanceKm: null,
          roadDistanceKm: null,
          coords: null,
        } as RankedBranch;
      }
      const dKm = distanceKm(position, branchPoint);
      return {
        branch,
        distanceKm: dKm,
        distanceText: formatDistance(dKm),
        straightDistanceKm: dKm,
        roadDistanceKm: null,
        coords: branchPoint,
      } as RankedBranch;
    })
    .sort(byDistance);
}

function byDistance(a: RankedBranch, b: RankedBranch): number {
  if (a.distanceKm === null && b.distanceKm === null) {
    return 0;
  }
  if (a.distanceKm === null) {
    return 1;
  }
  if (b.distanceKm === null) {
    return -1;
  }
  return a.distanceKm - b.distanceKm;
}

export function useBranches() {
  const [ranked, setRanked] = useState<RankedBranch[]>([]);
  const [nearest, setNearest] = useState<NearestBranch | null>(null);
  const [coords, setCoords] = useState<LatLong | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [fallbackCoords, setFallbackCoords] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>('');

  const upgradeToRoadDistances = useCallback(
    (position: LatLong, list: RankedBranch[]) => {
      const destinations: LatLong[] = [];
      const destIndexes: number[] = [];
      list.forEach((branch, index) => {
        if (branch.coords) {
          destinations.push(branch.coords);
          destIndexes.push(index);
        }
      });
      if (destinations.length === 0) {
        return;
      }
      roadDistancesKm(position, destinations).then(roadKmList => {
        const upgraded = list.map((branch, index) => {
          const destPosition = destIndexes.indexOf(index);
          const roadKm = destPosition >= 0 ? roadKmList[destPosition] : null;
          if (roadKm == null) {
            return branch;
          }
          return {
            ...branch,
            roadDistanceKm: roadKm,
            distanceKm: roadKm,
            distanceText: formatDistance(roadKm),
          } as RankedBranch;
        });
        setRanked(upgraded);
        setNearest(upgraded[0] ?? null);
      });
    },
    [],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let branches = cachedBranches;
      if (!branches) {
        if (!inFlight) {
          inFlight = masterGetBranches({ ZoneId: 0, DistrictId: 0 }).finally(
            () => {
              inFlight = null;
            },
          );
        }
        branches = await inFlight;
        cachedBranches = branches;
      }

      let position: LatLong | null = null;
      let usedFallback = false;
      const result: LocationResult = await getCurrentPosition();
      if (result.status === 'ok') {
        position = result.coords;
        setGpsStatus(
          result.accuracy != null
            ? `GPS fix (accuracy ±${Math.round(result.accuracy)}m)`
            : 'GPS fix (cached)',
        );
      } else {
        position = TEST_COORDS;
        usedFallback = true;
        setGpsStatus(
          result.status === 'denied'
            ? 'GPS: permission denied'
            : `GPS: error #${result.code} (${result.message})`,
        );
      }
      setCoords(position);
      setFallbackCoords(usedFallback);

      const list = rankBranches(branches, position);
      setRanked(list);
      setNearest(list[0] ?? null);
      if (usedFallback) {
        console.log(
          '[useBranches] GPS unavailable; using TEST_COORDS (Jaipur). ' +
            'Distance shown is from the test point, NOT your device.',
        );
      } else {
        upgradeToRoadDistances(position, list);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [upgradeToRoadDistances]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    branches: ranked,
    nearest,
    coords,
    loading,
    error,
    refetch,
    fallbackCoords,
    gpsStatus,
  };
}