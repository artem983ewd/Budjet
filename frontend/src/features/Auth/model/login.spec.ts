import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from '../model/login';
import * as loginApiModule from '../api/login';
import { ApiException } from '@/shared/lib/api/client';

vi.mock('../api/login');
vi.mock('@/shared/lib/api/client');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('handleSubmit', () => {
    it('should navigate to /main on successful login', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(loginApiModule.loginApi).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          get: vi.fn().mockReturnValue(''),
          querySelector: vi.fn(),
        } as unknown as HTMLFormElement,
      } as unknown as React.FormEvent<HTMLFormElement>;

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');
      
      Object.defineProperty(formEvent, 'currentTarget', {
        value: {
          get: (name: string) => formData.get(name),
        },
      });

      await act(async () => {
        result.current.handleSubmit(formEvent as any);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/main');
      });
    });

    it('should set tokens in localStorage on successful login', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(loginApiModule.loginApi).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          get: (name: string) => formData.get(name),
        },
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        result.current.handleSubmit(formEvent);
      });

      await waitFor(() => {
        expect(localStorage.getItem('access_token')).toBe('mock-access-token');
        expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
      });
    });

    it('should set errors on API exception with errors', async () => {
      const apiError = new ApiException({
        errors: { email: 'Invalid email' },
      });
      vi.mocked(loginApiModule.loginApi).mockRejectedValue(apiError);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('email', 'invalid-email');
      formData.set('password', 'password123');

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          get: (name: string) => formData.get(name),
        },
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        result.current.handleSubmit(formEvent);
      });

      await waitFor(() => {
        expect(result.current.errors).toEqual({ email: 'Invalid email' });
      });
    });

    it('should not set errors when API exception has no errors', async () => {
      const apiError = new ApiException({ message: 'Server error' });
      vi.mocked(loginApiModule.loginApi).mockRejectedValue(apiError);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          get: (name: string) => formData.get(name),
        },
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        result.current.handleSubmit(formEvent);
      });

      await waitFor(() => {
        expect(result.current.errors).toEqual({});
      });
    });

    it('should clear previous errors before submitting', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(loginApiModule.loginApi).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.errors = { email: 'Previous error' };

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          get: (name: string) => formData.get(name),
        },
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        result.current.handleSubmit(formEvent);
      });

      await waitFor(() => {
        expect(result.current.errors).toEqual({});
      });
    });
  });

  describe('loading state', () => {
    it('should be false initially', () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('errors state', () => {
    it('should be empty object initially', () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current.errors).toEqual({});
    });
  });
});
