import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterCredentials, LoginResponse, registerApi } from './register';
import { ApiException } from '@/shared/lib/api/client';

vi.mock('@/shared/lib/api/client', async (importOriginal) => {
  const actual = await importOriginal() as { apiClient: typeof vi.fn; ApiException: typeof ApiException };
  return {
    ...actual,
    apiClient: vi.fn(),
  };
});

import { apiClient } from '@/shared/lib/api/client';

const mockApiClient = apiClient as ReturnType<typeof vi.fn>;

describe('registerApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call apiClient with correct endpoint and credentials', async () => {
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