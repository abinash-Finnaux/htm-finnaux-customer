import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { BranchMaster, GetBranchesRequest, ProductMaster } from './types';

export async function masterGetProductList(): Promise<ProductMaster[]> {
  const response = await apiClient.post<ProductMaster[] | string>(
    API_ENDPOINTS.MASTERS.GET_PRODUCT_LIST,
    {},
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as ProductMaster[];
  }

  return [];
}

export async function masterGetBranches(
  request: GetBranchesRequest = { ZoneId: 0, DistrictId: 0 },
): Promise<BranchMaster[]> {
  const response = await apiClient.post<BranchMaster[] | string>(
    API_ENDPOINTS.MASTERS.GET_BRANCHES,
    request,
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as BranchMaster[];
  }

  return [];
}