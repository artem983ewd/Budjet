import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegister } from '../model/register';
import * as registerApiModule from '../api/register';
import { ApiException } from '@/shared/lib/api/client';
import { render, fireEvent } from '@testing-library/react';

vi.mock('../api/register');

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
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

function TestForm({ handleSubmit }: { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
      <input name="firstName" defaultValue="John" />
      <input name="lastName" defaultValue="Doe" />
      <input name="email" defaultValue="test@example.com" />
      <input name="password" defaultValue="password123" />
      <input name="confirmPassword" defaultValue="password123" />
      <button type="submit">Submit</button>
    </form>
  );
}

function TestFormWithDifferentPasswords({ handleSubmit }: { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
      <input name="firstName" defaultValue="John" />
      <input name="lastName" defaultValue="Doe" />
      <input name="email" defaultValue="test@example.com" />
      <input name="password" defaultValue="password123" />
      <input name="confirmPassword" defaultValue="differentpassword" />
      <button type="submit">Submit</button>
    </form>
  );
}

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe('handleSubmit', () => {
    it('should set confirmPassword error when passwords do not match', async () => {
      let hookErrors: Record<string, string> = {};

      const TestComponent = () => {
        const { handleSubmit, errors } = useRegister();
        hookErrors = errors;
        return <TestFormWithDifferentPasswords handleSubmit={handleSubmit} />;
      };

      render(<TestComponent />, { wrapper: createWrapper() });

      const form = document.querySelector('form') as HTMLFormElement;
      
      await act(async () => {
        fireEvent.submit(form);
      });

      expect(hookErrors).toEqual({ confirmPassword: 'Пароли не совпадают' });
    });

    it('should navigate to /main on successful registration', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(registerApiModule.registerApi).mockResolvedValue(mockResponse);

      const TestComponent = () => {
        const { handleSubmit } = useRegister();
        return <TestForm handleSubmit={handleSubmit} />;
      };

      render(<TestComponent />, { wrapper: createWrapper() });

      const form = document.querySelector('form') as HTMLFormElement;
      
      await act(async () => {
        fireEvent.submit(form);
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

      const TestComponent = () => {
        const { handleSubmit } = useRegister();
        return <TestForm handleSubmit={handleSubmit} />;
      };

      render(<TestComponent />, { wrapper: createWrapper() });

      const form = document.querySelector('form') as HTMLFormElement;
      
      await act(async () => {
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(localStorage.getItem('access_token')).toBe('mock-access-token');
        expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
      });
    });

    it('should translate Russian error messages from API', async () => {
      const apiError = new ApiException({
        errors: { email: 'email уже существует' },
      });
      vi.mocked(registerApiModule.registerApi).mockRejectedValue(apiError);

      let hookErrors: Record<string, string> = {};

      const TestComponent = () => {
        const { handleSubmit, errors } = useRegister();
        hookErrors = errors;
        return <TestForm handleSubmit={handleSubmit} />;
      };

      render(<TestComponent />, { wrapper: createWrapper() });

      const form = document.querySelector('form') as HTMLFormElement;
      
      await act(async () => {
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(hookErrors).toEqual({
          email: 'Пользователь с таким email уже зарегистрирован',
        });
      });
    });

    it('should not call API when passwords do not match', async () => {
      const TestComponent = () => {
        const { handleSubmit } = useRegister();
        return <TestFormWithDifferentPasswords handleSubmit={handleSubmit} />;
      };

      render(<TestComponent />, { wrapper: createWrapper() });

      const form = document.querySelector('form') as HTMLFormElement;
      
      await act(async () => {
        fireEvent.submit(form);
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