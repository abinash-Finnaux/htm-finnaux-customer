import { useCallback, useState } from 'react';
import { masterGetProductPageInfo, type ProductPageInfo } from '../api/masters';

export function useProductPages() {
  const [pages, setPages] = useState<ProductPageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const list = await masterGetProductPageInfo({ ProductId: productId });
      const sorted = [...list].sort((a, b) => a.PageOrder - b.PageOrder);
      setPages(sorted);
    } catch (e) {
      setPages([]);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPages([]);
    setLoading(false);
    setError(null);
  }, []);

  return { pages, loading, error, load, reset };
}