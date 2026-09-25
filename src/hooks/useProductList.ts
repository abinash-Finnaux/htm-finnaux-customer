import { useCallback, useEffect, useState } from 'react';
import { masterGetProductList, ProductMaster } from '../api/masters';

let cachedProducts: ProductMaster[] | null = null;
let inFlight: Promise<ProductMaster[]> | null = null;

export function useProductList() {
  const [products, setProducts] = useState<ProductMaster[]>(
    cachedProducts ?? [],
  );
  const [loading, setLoading] = useState(cachedProducts === null);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!inFlight) {
        inFlight = masterGetProductList().finally(() => {
          inFlight = null;
        });
      }
      const list = await inFlight;
      cachedProducts = list;
      setProducts(list);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cachedProducts) {
      setProducts(cachedProducts);
      return;
    }
    refetch();
  }, [refetch]);

  return { products, loading, error, refetch };
}