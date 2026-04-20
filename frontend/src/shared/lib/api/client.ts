import axios from 'axios';

const apiClientInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

apiClientInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClientInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClientInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/api/auth/refresh', { refresh_token: refreshToken });
        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);
        
        onTokenRefreshed(access_token);
        isRefreshing = false;
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClientInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    const errorData = error.response?.data || { message: error.message || 'API Error' };
    throw new ApiException(errorData as ApiError);
  }
);

interface RequestOptions {
  body?: unknown;
  method?: string;
}

export interface ApiError {
  errors?: Record<string, string>;
  message?: string;
}

export class ApiException extends Error {
  constructor(public readonly errorData: ApiError) {
    super(errorData.message || 'API Error');
    this.name = 'ApiException';
  }
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, method = 'GET' } = options;

  const response = await apiClientInstance.request<T>({
    url: endpoint,
    method,
    data: body,
  });

  return response.data;
}