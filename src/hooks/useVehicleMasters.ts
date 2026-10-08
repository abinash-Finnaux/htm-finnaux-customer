import { useEffect, useRef, useState } from 'react';
import {
  masterGetPartnerList,
  masterGetDealerManufactureMap,
  masterGetVehicleCategories,
  masterGetVehicleModels,
  masterGetVehicleVariants,
  masterGetCustomerByLoanNo,
} from '../api/masters';

export type VehicleMasterItem = {
  id: string;
  name: string;
};

type MasterKind = 'dealer' | 'mfg' | 'category' | 'model' | 'variant' | 'customer';

const ID_KEYS: Record<MasterKind, string[]> = {
  dealer: ['Dealer_Id', 'DealerId', 'Partner_Id', 'PartnerId', 'ID', 'Id'],
  mfg: [
    'Manufacture_Id',
    'ManufactureId',
    'Manufacturer_Id',
    'ManufacturerId',
    'Mfg_Id',
    'MfgId',
    'ID',
    'Id',
  ],
  category: ['Category_Id', 'CategoryId', 'Cat_Id', 'CatId', 'ID', 'Id'],
  model: ['Model_Id', 'ModelId', 'ID', 'Id'],
  variant: [
    'Variant_Id',
    'VariantId',
    'Varient_Id',
    'VarientId',
    'ID',
    'Id',
  ],
  customer: ['Cust_Id', 'Customer_Id', 'CustomerId', 'CustId', 'ID', 'Id'],
};

const NAME_KEYS: Record<MasterKind, string[]> = {
  dealer: [
    'Dealer_Name',
    'DealerName',
    'Partner_Name',
    'PartnerName',
    'Partner',
    'Firm_Name',
    'FirmName',
    'Name',
    'Dealer',
  ],
  mfg: [
    'Manufacture_Name',
    'ManufactureName',
    'Manufacturer_Name',
    'ManufacturerName',
    'Mfg_Name',
    'MfgName',
    'Name',
    'Manufacture',
    'Manufacturer',
  ],
  category: [
    'Category_Name',
    'CategoryName',
    'Cat_Name',
    'CatName',
    'Name',
    'Category',
  ],
  model: ['Model_Name', 'ModelName', 'Name', 'Model'],
  variant: [
    'Variant_Name',
    'VariantName',
    'Varient_Name',
    'VarientName',
    'Name',
    'Variant',
  ],
  customer: [
    'Customer_Name',
    'CustomerName',
    'Cust_Name',
    'CustName',
    'Firm_Name',
    'FirmName',
    'Name',
    'Customer',
  ],
};

const pickKey = (obj: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    if (obj[key] != null) return obj[key];
  }
  return undefined;
};

const asText = (value: unknown): string => {
  if (value == null) return '';
  return String(value).trim();
};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const NUMERIC_HINT = /(id|code|no\b|srl|slno)/i;
const NOISE_KEYS = [
  'mobile',
  'phone',
  'contact',
  'manufactures',
  'manu',
  'address',
  'remark',
  'email',
];

function heuristicName(record: Record<string, unknown>): string {
  for (const [key, value] of Object.entries(record)) {
    if (NOISE_KEYS.includes(key.toLowerCase())) continue;
    const text = asText(value);
    if (!text) continue;
    if (/^[0-9]+$/.test(text)) continue;
    return text;
  }
  return '';
}

function heuristicId(record: Record<string, unknown>): string {
  for (const [key, value] of Object.entries(record)) {
    if (NUMERIC_HINT.test(key)) {
      const text = asText(value);
      if (text) return text;
    }
  }
  for (const value of Object.values(record)) {
    const text = asText(value);
    if (/^[0-9]+$/.test(text)) return text;
  }
  return '';
}

function normalizeItems(
  raw: unknown[],
  idKeys: string[],
  nameKeys: string[],
): VehicleMasterItem[] {
  return asArray(raw)
    .map(item => {
      if (typeof item === 'string') {
        const text = item.trim();
        return text ? { id: text, name: text } : null;
      }
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        const name =
          asText(pickKey(record, nameKeys)) || heuristicName(record);
        const id = asText(pickKey(record, idKeys)) || heuristicId(record);
        return name ? { id, name } : null;
      }
      return null;
    })
    .filter((item): item is VehicleMasterItem => item != null)
    .reduce<VehicleMasterItem[]>((unique, item) => {
      const existing = unique.find(
        existingItem => existingItem.name === item.name,
      );
      if (existing) {
        return unique;
      }
      unique.push(item);
      return unique;
    }, []);
}

const cache = new Map<string, VehicleMasterItem[]>();
const inFlight = new Map<string, Promise<VehicleMasterItem[]>>();

function useVehicleMasterItems(
  kind: MasterKind,
  enabled: boolean,
  cacheKey: string,
  fetch: () => Promise<unknown[]>,
) {
  const [items, setItems] = useState<VehicleMasterItem[]>(
    cache.get(cacheKey) ?? [],
  );
  const [loading, setLoading] = useState<boolean>(
    enabled && !cache.has(cacheKey),
  );
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const fetchRef = useRef(fetch);
  fetchRef.current = fetch;

  const refetch = () => {
    cache.delete(cacheKey);
    inFlight.delete(cacheKey);
    setNonce(value => value + 1);
  };

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = cache.get(cacheKey);
    if (cached) {
      setItems(cached);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    let promise = inFlight.get(cacheKey);
    if (!promise) {
      promise = fetchRef
        .current()
        .then(raw => {
          console.log('[vehicleMasters]', cacheKey, raw);
          return raw;
        })
        .then(raw => normalizeItems(raw, ID_KEYS[kind], NAME_KEYS[kind]))
        .then(list => {
          cache.set(cacheKey, list);
          return list;
        })
        .finally(() => {
          inFlight.delete(cacheKey);
        });
      inFlight.set(cacheKey, promise);
    }

    promise
      .then(list => {
        if (!cancelled) {
          setItems(list);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to load options',
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, enabled, kind, nonce]);

  return { items, loading, error, refetch };
}

export function useDealerOptions() {
  return useVehicleMasterItems('dealer', true, 'dealer|all', () =>
    masterGetPartnerList({ Type: 'Dealer' }),
  );
}

export function useManufactureOptions(dealerId: string) {
  const enabled = dealerId !== '';
  return useVehicleMasterItems(
    'mfg',
    enabled,
    `mfg|${dealerId}`,
    () => masterGetDealerManufactureMap({ Dealer_Id: Number(dealerId) }),
  );
}

export function useVehicleCategories(manufactureId: string) {
  const enabled = manufactureId !== '';
  return useVehicleMasterItems(
    'category',
    enabled,
    `category|${manufactureId}`,
    () =>
      masterGetVehicleCategories({ ManufactureId: Number(manufactureId) }),
  );
}

export function useVehicleModels(
  manufactureId: string,
  categoryId: string,
) {
  const enabled = manufactureId !== '' && categoryId !== '';
  return useVehicleMasterItems(
    'model',
    enabled,
    `model|${manufactureId}|${categoryId}`,
    () =>
      masterGetVehicleModels({
        ManufactureId: Number(manufactureId),
        CategoryId: Number(categoryId),
      }),
  );
}

export function useVehicleVariants(modelId: string) {
  const enabled = modelId !== '';
  return useVehicleMasterItems(
    'variant',
    enabled,
    `variant|${modelId}`,
    () => masterGetVehicleVariants({ ModelId: Number(modelId) }),
  );
}

export function useCustomerByLoan(loanId: string) {
  const enabled = loanId !== '';
  return useVehicleMasterItems(
    'customer',
    enabled,
    `customer|${loanId}`,
    () =>
      masterGetCustomerByLoanNo({
        Loan_Id: Number(loanId) || loanId,
      }),
  );
}