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
        console.log('url:', config.url, 'token exists:', token);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        console.log('[API] login endpoint, skipping token:', config.url);
      }
    } catch (error) {
      console.log('[API] interceptor error:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default apiClient;
