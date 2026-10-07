import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  BranchMaster,
  DistrictMaster,
  GetBranchesRequest,
  GetCollectionExecutivesRequest,
  GetCommonMasterRequest,
  GetDistrictsRequest,
  GetProductPageInfoRequest,
  GetTehsilsRequest,
  ProductMaster,
  ProductPageInfo,
  StateMaster,
  TehsilMaster,
} from './types';

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

export async function masterGetProductPageInfo(
  request: GetProductPageInfoRequest,
): Promise<ProductPageInfo[]> {
  const response = await apiClient.post<ProductPageInfo[] | string>(
    API_ENDPOINTS.MASTERS.GET_PRODUCT_PAGE_INFO,
    request,
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as ProductPageInfo[];
  }

  return [];
}

export async function masterGetStates(): Promise<StateMaster[]> {
  const response = await apiClient.post<StateMaster[] | string>(
    API_ENDPOINTS.MASTERS.GET_STATE,
    {},
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as StateMaster[];
  }

  return [];
}

export async function masterGetDistricts(
  request: GetDistrictsRequest,
): Promise<DistrictMaster[]> {
  const response = await apiClient.post<DistrictMaster[] | string>(
    API_ENDPOINTS.MASTERS.GET_DISTRICTS,
    request,
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as DistrictMaster[];
  }

  return [];
}

export async function masterGetTehsils(
  request: GetTehsilsRequest,
): Promise<TehsilMaster[]> {
  const response = await apiClient.post<TehsilMaster[] | string>(
    API_ENDPOINTS.MASTERS.GET_TAHSIL,
    request,
  );

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as TehsilMaster[];
  }

  return [];
}

async function fetchLmsMasterList<T = unknown>(
  endpoint: string,
  request: Record<string, unknown>,
): Promise<T[]> {
  const response = await apiClient.post<T[] | string>(endpoint, request);

  let data: unknown = response.data;
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data as T[];
  }

  const record = data as Record<string, unknown> | null;
  if (record && Array.isArray(record.Item1)) {
    return record.Item1 as T[];
  }
  if (record && Array.isArray(record.Data)) {
    return record.Data as T[];
  }
  if (record && Array.isArray(record.Item2)) {
    return record.Item2 as T[];
  }

  return [];
}

export async function masterGetCommonMaster(
  request: GetCommonMasterRequest,
): Promise<unknown[]> {
  return fetchLmsMasterList<unknown>(
    API_ENDPOINTS.LMS.COMMON_MASTER,
    request,
  );
}

export async function masterGetCollectionExecutives(
  request: GetCollectionExecutivesRequest,
): Promise<unknown[]> {
  return fetchLmsMasterList<unknown>(
    API_ENDPOINTS.LMS.GET_COLLECTION_EXECUTIVE,
    request,
  );
}