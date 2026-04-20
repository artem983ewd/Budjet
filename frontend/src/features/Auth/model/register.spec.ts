import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegister } from '../model/register';
import * as registerApiModule from '../api/register';
import { ApiException } from '@/shared/lib/api/client';

vi.mock('../api/register');
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

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('handleSubmit', () => {
    it('should set confirmPassword error when passwords do not match', async () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('firstName', 'John');
      formData.set('lastName', 'Doe');
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');
      formData.set('confirmPassword', 'differentpassword');

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          get: (name: string) => formData.get(name),
        },
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        result.current.handleSubmit(formEvent);
      });

      expect(result.current.errors).toEqual({ confirmPassword: 'Пароли не совпадают' });
    });

    it('should navigate to /main on successful registration', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(registerApiModule.registerApi).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('firstName', 'John');
      formData.set('lastName', 'Doe');
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');
      formData.set('confirmPassword', 'password123');

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
        expect(mockNavigate).toHaveBeenCalledWith('/main');
      });
    });

    it('should set tokens in localStorage on successful registration', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(registerApiModule.registerApi).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('firstName', 'John');
      formData.set('lastName', 'Doe');
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');
      formData.set('confirmPassword', 'password123');

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

    it('should translate Russian error messages from API', async () => {
      const apiError = new ApiException({
        errors: { email: 'email already exists' },
      });
      vi.mocked(registerApiModule.registerApi).mockRejectedValue(apiError);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('firstName', 'John');
      formData.set('lastName', 'Doe');
      formData.set('email', 'existing@example.com');
      formData.set('password', 'password123');
      formData.set('confirmPassword', 'password123');

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
        expect(result.current.errors).toEqual({
          email: 'Пользователь с таким email уже зарегистрирован',
        });
      });
    });

    it('should clear previous errors before submitting', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(registerApiModule.registerApi).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      result.current.errors = { email: 'Previous error' };

      const formData = new FormData();
      formData.set('firstName', 'John');
      formData.set('lastName', 'Doe');
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');
      formData.set('confirmPassword', 'password123');

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

    it('should not call API when passwords do not match', async () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      const formData = new FormData();
      formData.set('firstName', 'John');
      formData.set('lastName', 'Doe');
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');
      formData.set('confirmPassword', 'differentpassword');

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          get: (name: string) => formData.get(name),
        },
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        result.current.handleSubmit(formEvent);
      });

      expect(registerApiModule.registerApi).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should be false initially', () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('errors state', () => {
    it('should be empty object initially', () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      expect(result.current.errors).toEqual({});
    });
  });
});
