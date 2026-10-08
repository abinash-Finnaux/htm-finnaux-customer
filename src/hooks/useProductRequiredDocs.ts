import { useCallback, useEffect, useMemo, useState } from 'react';
import { masterGetProductRequiredDoc } from '../api/masters';
import type { ProductRequiredDoc } from '../api/masters';
import type { DocumentConfig } from '../screens/applyLoans/types';

export const FALLBACK_DOCUMENTS: DocumentConfig[] = [
  {
    key: 'aadhaar',
    label: 'Aadhaar Card',
    hint: 'Front & back',
    category: 'KYC',
    required: true,
  },
  {
    key: 'pan',
    label: 'PAN Card',
    hint: 'Clear photograph',
    category: 'KYC',
    required: true,
  },
  {
    key: 'photo',
    label: 'Passport Size Photo',
    hint: 'Recent photograph',
    category: 'Other',
    required: true,
  },
  {
    key: 'signature',
    label: 'Signature',
    hint: 'On white paper',
    category: 'Other',
    required: false,
  },
  {
    key: 'bankStatement',
    label: 'Bank Statement',
    hint: 'Last 6 months (optional)',
    category: 'Income Proof',
    required: false,
  },
];

export const toDocumentConfig = (
  doc: ProductRequiredDoc,
): DocumentConfig => ({
  key: `doc_${doc.DocId}`,
  label: (doc.Doc_Name ?? '').trim() || `Document ${doc.DocId}`,
  hint: doc.Doc_Category ?? '',
  category: doc.Doc_Category || 'Other',
  required: !!doc.IsHMandatory,
});

const cache = new Map<string, ProductRequiredDoc[]>();
const inFlight = new Map<string, Promise<ProductRequiredDoc[]>>();

export function useProductRequiredDocs(productId: number | null) {
  const key = productId != null ? String(productId) : '';
  const [docs, setDocs] = useState<ProductRequiredDoc[] | null>(
    key ? cache.get(key) ?? null : null,
  );
  const [loading, setLoading] = useState(
    () => key !== '' && !cache.has(key),
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (productId == null) {
      return;
    }
    if (inFlight.has(key)) {
      return inFlight.get(key)!;
    }
    setLoading(true);
    setError(null);
    const promise = masterGetProductRequiredDoc({ ProductId: productId })
      .then(items => {
        cache.set(key, items);
        return items;
      })
      .finally(() => {
        inFlight.delete(key);
      });
    inFlight.set(key, promise);
    try {
      const result = await promise;
      setDocs(result);
    } catch {
      setError('Unable to load documents');
    } finally {
      setLoading(false);
    }
  }, [key, productId]);

  useEffect(() => {
    if (!key) {
      setDocs(null);
      setError(null);
      return;
    }
    const cached = cache.get(key);
    if (cached) {
      setDocs(cached);
      return;
    }
    setDocs(null);
    load();
  }, [key, load]);

  const documents = useMemo<DocumentConfig[]>(() => {
    if (docs == null && !error) {
      return key ? [] : FALLBACK_DOCUMENTS;
    }
    if (docs && docs.length > 0) {
      return docs.map(toDocumentConfig);
    }
    return FALLBACK_DOCUMENTS;
  }, [docs, error, key]);

  return { documents, loading, error, refetch: load };
}
