import { useCallback, useEffect, useState } from 'react';
import { masterGetCommonMaster } from '../api/masters';

const NAME_KEYS = [
  'Value',
  'Name',
  'M_Name',
  'Master_Name',
  'Description',
  'Label',
  'Code',
];

const extractName = (item: unknown): string => {
  if (typeof item === 'string') return item.trim();
  if (item && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    for (const key of NAME_KEYS) {
      const value = record[key];
      if (value != null && value !== '') return String(value).trim();
    }
  }
  return '';
};

const cache = new Map<string, string[]>();
const inFlight = new Map<string, Promise<string[]>>();

export function useCommonMasterOptions(type: string, fallback: string[] = []) {
  const [options, setOptions] = useState<string[]>(cache.get(type) ?? fallback);
  const [loading, setLoading] = useState<boolean>(!cache.has(type));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (inFlight.has(type)) return inFlight.get(type)!;
    setLoading(true);
    setError(null);
    const promise = masterGetCommonMaster({
      Commands: 'Select',
      Type: type,
    })
      .then(items => {
        const names = items.map(extractName).filter(name => name !== '');
        cache.set(type, names);
        return names;
      })
      .finally(() => {
        inFlight.delete(type);
      });
    inFlight.set(type, promise);
    try {
      const result = await promise;
      setOptions(result);
    } catch {
      setError('Unable to load options');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (!cache.has(type)) {
      load();
    }
  }, [type, load]);

  return { options, loading, error, refetch: load };
}
