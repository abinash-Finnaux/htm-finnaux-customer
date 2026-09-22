import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api';
import type { AmortizationChartEntry } from './data';

type AmortizationChartResponse = {
  CODE?: number | string;
  Msg?: string;
  Item1?: AmortizationChartEntry[];
  Item2?: AmortizationChartEntry[];
};

export async function getAmortizationChart(
  ApplicationIdentity: string | number,
): Promise<AmortizationChartEntry[]> {
  const response = await apiClient.post<AmortizationChartResponse | string>(
    API_ENDPOINTS.LMS.AMORTIZATION_CHART,
    { Loan_Id: Number(ApplicationIdentity) || ApplicationIdentity },
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as AmortizationChartEntry[];
  }

  const record = data as AmortizationChartResponse | null;
  console.log('recordLOGOLOG', record);

  if (record && Array.isArray(record.Item1)) {
    return record.Item1 as AmortizationChartEntry[];
  }
  return [];
}

export type LoanDetailsRecord = Record<string, unknown>;

export async function getLoanDetails(
  ApplicationIdentity: string | number,
): Promise<LoanDetailsRecord | null> {
  const response = await apiClient.post<LoanDetailsRecord | string>(
    API_ENDPOINTS.LMS.LOAN_DETAILS,
    { Loan_Id: Number(ApplicationIdentity) || ApplicationIdentity },
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return (data[0] as LoanDetailsRecord) ?? null;
  }

  const record = data as Record<string, unknown> | null;
  if (record && Array.isArray(record.Item1)) {
    return (record.Item1[0] as LoanDetailsRecord) ?? null;
  }
  if (record && typeof record === 'object') {
    return record as LoanDetailsRecord;
  }
  return null;
}
