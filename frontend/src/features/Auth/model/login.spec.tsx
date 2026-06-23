import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from '../model/login';
import * as loginApiModule from '../api/login';
import { ApiException } from '@/shared/lib/api/client';
import { render, fireEvent } from '@testing-library/react';

vi.mock('../api/login');

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
  return ({ children }: { children: unknown }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

function TestForm({ handleSubmit }: { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
      <input name="email" defaultValue="test@example.com" />
      <input name="password" defaultValue="password123" />
      <button type="submit">Submit</button>
    </form>
  );
}

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe('handleSubmit', () => {
    it('should navigate to /main on successful login', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(loginApiModule.loginApi).mockResolvedValue(mockResponse);

      const TestComponent = () => {
        const { handleSubmit } = useLogin();
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

    it('should set tokens in localStorage on successful login', async () => {
      const mockResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      };
      vi.mocked(loginApiModule.loginApi).mockResolvedValue(mockResponse);

      const TestComponent = () => {
        const { handleSubmit } = useLogin();
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

    it('should set errors on API exception with errors', async () => {
      const apiError = new ApiException({
        errors: { email: 'Invalid email' },
      });
      vi.mocked(loginApiModule.loginApi).mockRejectedValue(apiError);

      let hookErrors: Record<string, string> = {};

      const TestComponent = () => {
        const { handleSubmit, errors } = useLogin();
        hookErrors = errors;
        return <TestForm handleSubmit={handleSubmit} />;
      };

      render(<TestComponent />, { wrapper: createWrapper() });

      const form = document.querySelector('form') as HTMLFormElement;
      
      await act(async () => {
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(hookErrors).toEqual({ email: 'Invalid email' });
      });
    });

    it('should not set errors when API exception has no errors', async () => {
      const apiError = new ApiException({ message: 'Server error' });
      vi.mocked(loginApiModule.loginApi).mockRejectedValue(apiError);

      let hookErrors: Record<string, string> = {};

      const TestComponent = () => {
        const { handleSubmit, errors } = useLogin();
        hookErrors = errors;
        return <TestForm handleSubmit={handleSubmit} />;
      };

      render(<TestComponent />, { wrapper: createWrapper() });

      const form = document.querySelector('form') as HTMLFormElement;
      
      await act(async () => {
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(hookErrors).toEqual({});
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