import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterCredentials, LoginResponse } from './register';

vi.mock('@/shared/lib/api', () => ({
  apiClient: vi.fn(),
}));

import { apiClient } from '@/shared/lib/api/client';

const mockApiClient = apiClient as unknown as jest.Mock;

describe('registerApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call apiClient with correct endpoint and credentials', async () => {
    const { registerApi } = await import('./register');
    const credentials: RegisterCredentials = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
    };
    const mockResponse: LoginResponse = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    };

    mockApiClient.mockResolvedValueOnce(mockResponse);

    const result = await registerApi(credentials);

    expect(mockApiClient).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: credentials,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw ApiException on error response', async () => {
    const { registerApi } = await import('./register');
    const { ApiException } = await import('@/shared/lib/api/client');
    const credentials: RegisterCredentials = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
      password: 'password123',
    };

    const error = new ApiException({ message: 'Email already exists' });
    mockApiClient.mockRejectedValueOnce(error);

    await expect(registerApi(credentials)).rejects.toThrow(ApiException);
  });

  it('should return tokens on successful registration', async () => {
    const { registerApi } = await import('./register');
    const credentials: RegisterCredentials = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
    };
    const mockResponse: LoginResponse = {
      access_token: 'access-token-123',
      refresh_token: 'refresh-token-123',
    };

    mockApiClient.mockResolvedValueOnce(mockResponse);

    const result = await registerApi(credentials);

    expect(result).toEqual(mockResponse);
    expect(mockApiClient).toHaveBeenCalledTimes(1);
  });
});
