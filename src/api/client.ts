import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from './endpoints';

const BASE_URL = 'https://demo.finnaux.in/api/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const isCustomerLoginEndpoint = (url: string = '') =>
  url.includes(API_ENDPOINTS.AUTH.VERIFY_USER) ||
  url.includes(API_ENDPOINTS.AUTH.LOGIN);

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (!isCustomerLoginEndpoint(config.url)) {
        const token = await AsyncStorage.getItem('@finnaux_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // Silently fail - token might not exist yet
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !isCustomerLoginEndpoint(originalRequest?.url) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(
          '@finnaux_refresh_token',
        );

        if (refreshToken) {
          const response = await axios.post(
            `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            {
              refreshToken,
            },
          );

          const { token } = response.data.data;
          await AsyncStorage.setItem('@finnaux_token', token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.removeMany([
          '@finnaux_token',
          '@finnaux_refresh_token',
        ]);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
