import { useCallback, useEffect, useState } from 'react';
import { masterGetCollectionExecutives } from '../api/masters';

const NAME_KEYS = [
  'Executive_Name',
  'ExecutiveName',
  'Employee_Name',
  'EmployeeName',
  'Emp_Name',
  'EmpName',
  'Name',
  'Description',
  'Value',
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

export function useCollectionExecutives(
  branchId: string,
  productId: number | null,
  fallback: string[] = [],
) {
  const key = `${branchId}|${productId ?? ''}`;
  const [options, setOptions] = useState<string[]>(cache.get(key) ?? fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!branchId || productId == null) return;
    if (inFlight.has(key)) return inFlight.get(key)!;
    setLoading(true);
    setError(null);
    const promise = masterGetCollectionExecutives({
      Branch_Id: Number(branchId),
      ProductId: productId,
    })
      .then(items => {
        const names = items.map(extractName).filter(name => name !== '');
        cache.set(key, names);
        return names;
      })
      .finally(() => {
        inFlight.delete(key);
      });
    inFlight.set(key, promise);
    try {
      const result = await promise;
      setOptions(result.length ? result : fallback);
    } catch {
      setError('Unable to load options');
    } finally {
      setLoading(false);
    }
  }, [key, branchId, productId, fallback]);

  useEffect(() => {
    setOptions(cache.get(key) ?? fallback);
    if (!cache.has(key)) {
      load();
    }
  }, [key, load, fallback]);

  return { options, loading, error, refetch: load };
}