import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginCredentials, LoginResponse } from './login';

vi.mock('@/shared/lib/api', () => ({
  apiClient: vi.fn(),
}));

import { apiClient } from '@/shared/lib/api/client';

const mockApiClient = apiClient as unknown as jest.Mock;

describe('loginApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call apiClient with correct endpoint and credentials', async () => {
    const { loginApi } = await import('./login');
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };
    const mockResponse: LoginResponse = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    };

    mockApiClient.mockResolvedValueOnce(mockResponse);

    const result = await loginApi(credentials);

    expect(mockApiClient).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw ApiException on error response', async () => {
    const { loginApi } = await import('./login');
    const { ApiException } = await import('@/shared/lib/api/client');
    const credentials: LoginCredentials = {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    };

    const error = new ApiException({ message: 'Invalid credentials' });
    mockApiClient.mockRejectedValueOnce(error);

    await expect(loginApi(credentials)).rejects.toThrow(ApiException);
  });

  it('should return tokens on successful login', async () => {
    const { loginApi } = await import('./login');
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };
    const mockResponse: LoginResponse = {
      access_token: 'access-token-123',
      refresh_token: 'refresh-token-123',
    };

    mockApiClient.mockResolvedValueOnce(mockResponse);

    const result = await loginApi(credentials);

    expect(result).toEqual(mockResponse);
    expect(mockApiClient).toHaveBeenCalledTimes(1);
  });
});
