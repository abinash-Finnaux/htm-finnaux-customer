import apiClient from './client';
import { ApiResponse, PaginatedResponse, RequestConfig } from './types';

export const apiService = {
  get: async <T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.get<ApiResponse<T>>(url, {
      params: config?.params,
      headers: config?.headers,
      timeout: config?.timeout,
    });
    return response.data;
  },

  post: async <T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, {
      headers: config?.headers,
      timeout: config?.timeout,
    });
    return response.data;
  },

  put: async <T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, {
      headers: config?.headers,
      timeout: config?.timeout,
    });
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, {
      headers: config?.headers,
      timeout: config?.timeout,
    });
    return response.data;
  },

  delete: async <T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, {
      params: config?.params,
      headers: config?.headers,
      timeout: config?.timeout,
    });
    return response.data;
  },

  getPaginated: async <T>(
    url: string,
    page: number = 1,
    pageSize: number = 10,
    config?: RequestConfig,
  ): Promise<PaginatedResponse<T>> => {
    const response = await apiClient.get<PaginatedResponse<T>>(url, {
      params: {
        ...config?.params,
        page,
        pageSize,
      },
      headers: config?.headers,
      timeout: config?.timeout,
    });
    return response.data;
  },
};
