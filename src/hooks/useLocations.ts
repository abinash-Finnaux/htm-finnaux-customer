import { useCallback, useEffect, useState } from 'react';
import {
  masterGetStates,
  masterGetDistricts,
  masterGetTehsils,
  type StateMaster,
  type DistrictMaster,
  type TehsilMaster,
} from '../api/masters';

export type LocationTehsil = {
  id: string;
  name: string;
};

export type LocationDistrict = {
  id: string;
  name: string;
  tehsils: LocationTehsil[];
};

export type LocationState = {
  id: string;
  name: string;
};

const pick = (obj: Record<string, unknown> | undefined | null, keys: string[]) => {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] != null) return obj[key];
  }
  return undefined;
};

const asString = (value: unknown): string => {
  if (value == null) return '';
  return String(value).trim();
};

const asName = (
  obj: Record<string, unknown> | string | undefined | null,
  keys: string[],
): string => {
  if (typeof obj === 'string') return obj.trim();
  if (!obj) return '';
  return asString(pick(obj, keys));
};

const asId = (
  obj: Record<string, unknown> | string | undefined | null,
  keys: string[],
): string => {
  if (typeof obj === 'string') return obj;
  if (!obj) return '';
  return asString(pick(obj, keys));
};

const asArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) return [];
  return value as Record<string, unknown>[];
};

const normalizeTehsils = (value: unknown): LocationTehsil[] =>
  asArray(value)
    .map(tehsil => ({
      id: asId(tehsil, ['TehsilID', 'Tehsil_Id', 'TehsilId', 'ID']),
      name: asName(tehsil, ['Tehsil_Name', 'TehsilName', 'Tehsil', 'Name']),
    }))
    .filter(tehsil => tehsil.name !== '');

const normalizeStates = (raw: StateMaster[]): LocationState[] =>
  asArray(raw as unknown)
    .map(state => ({
      id: asId(state, ['StateID', 'State_Id', 'StateId', 'ID']),
      name: asName(state, ['State_Name', 'StateName', 'State', 'Name']),
    }))
    .filter(state => state.name !== '');

const normalizeDistricts = (raw: DistrictMaster[]): LocationDistrict[] =>
  asArray(raw as unknown)
    .map(district => ({
      id: asId(district, ['DistrictID', 'District_Id', 'DistrictId', 'ID']),
      name: asName(district, [
        'District_Name',
        'DistrictName',
        'District',
        'Name',
      ]),
      tehsils: normalizeTehsils(
        pick(district, ['Tehsils', 'Tehsil_List', 'TehsilList']),
      ),
    }))
    .filter(district => district.name !== '');

const normalizeTehsilList = (raw: TehsilMaster[]): LocationTehsil[] =>
  asArray(raw as unknown)
    .map(tehsil => ({
      id: asId(tehsil, ['TehsilID', 'Tehsil_Id', 'TehsilId', 'ID']),
      name: asName(tehsil, ['Tehsil_Name', 'TehsilName', 'Tehsil', 'Name']),
    }))
    .filter(tehsil => tehsil.name !== '');

let cachedStates: LocationState[] | null = null;
let statesInFlight: Promise<LocationState[]> | null = null;

export function useLocations() {
  const [states, setStates] = useState<LocationState[]>(cachedStates ?? []);
  const [statesLoading, setStatesLoading] = useState<boolean>(
    cachedStates === null,
  );
  const [statesError, setStatesError] = useState<string | null>(null);

  const [districts, setDistricts] = useState<LocationDistrict[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [districtsError, setDistrictsError] = useState<string | null>(null);
  const [loadedStateId, setLoadedStateId] = useState<string | null>(null);

  const [tehsils, setTehsils] = useState<LocationTehsil[]>([]);
  const [tehsilsLoading, setTehsilsLoading] = useState(false);
  const [tehsilsError, setTehsilsError] = useState<string | null>(null);
  const [loadedDistrictId, setLoadedDistrictId] = useState<string | null>(
    null,
  );

  const loadStates = useCallback(async () => {
    if (statesInFlight) return statesInFlight;
    setStatesLoading(true);
    setStatesError(null);
    statesInFlight = masterGetStates()
      .then(raw => {
        const normalized = normalizeStates(raw);
        cachedStates = normalized;
        return normalized;
      })
      .finally(() => {
        statesInFlight = null;
      });
    try {
      const result = await statesInFlight;
      setStates(result);
    } catch {
      setStatesError('Unable to load states');
    } finally {
      setStatesLoading(false);
    }
  }, []);

  const loadDistricts = useCallback(async (stateId: string) => {
    setDistrictsLoading(true);
    setDistrictsError(null);
    setDistricts([]);
    setLoadedStateId(null);
    try {
      const raw = await masterGetDistricts({ StateID: Number(stateId) });
      setDistricts(normalizeDistricts(raw));
      setLoadedStateId(stateId);
    } catch {
      setDistrictsError('Unable to load districts');
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  const loadTehsils = useCallback(async (districtId: string) => {
    setTehsilsLoading(true);
    setTehsilsError(null);
    setTehsils([]);
    setLoadedDistrictId(null);
    try {
      const raw = await masterGetTehsils({ DistrictId: Number(districtId) });
      setTehsils(normalizeTehsilList(raw));
      setLoadedDistrictId(districtId);
    } catch {
      setTehsilsError('Unable to load tehsils');
    } finally {
      setTehsilsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cachedStates === null) {
      loadStates();
    }
  }, [loadStates]);

  return {
    states,
    statesLoading,
    statesError,
    loadStates,
    districts,
    districtsLoading,
    districtsError,
    loadDistricts,
    loadedStateId,
    tehsils,
    tehsilsLoading,
    tehsilsError,
    loadTehsils,
    loadedDistrictId,
  };
}