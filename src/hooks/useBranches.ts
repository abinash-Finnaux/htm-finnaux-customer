import { useCallback, useEffect, useState } from 'react';
import { masterGetBranches, type BranchMaster } from '../api/masters';
import { getCurrentPosition } from '../services/location';
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
          coords: null,
        } as RankedBranch;
      }
      const dKm = distanceKm(position, branchPoint);
      return {
        branch,
        distanceKm: dKm,
        distanceText: formatDistance(dKm),
        coords: branchPoint,
      } as RankedBranch;
    })
    .sort((a, b) => {
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
    });
}

export function useBranches() {
  const [ranked, setRanked] = useState<RankedBranch[]>([]);
  const [nearest, setNearest] = useState<NearestBranch | null>(null);
  const [coords, setCoords] = useState<LatLong | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [fallbackCoords, setFallbackCoords] = useState(false);

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

      let position = await getCurrentPosition();
      let usedFallback = false;
      if (!position) {
        position = TEST_COORDS;
        usedFallback = true;
      }
      setCoords(position);
      setFallbackCoords(usedFallback);

      const list = rankBranches(branches, position);
      setRanked(list);
      setNearest(list[0] ?? null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

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
  };
}