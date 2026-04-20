import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../LoginPage';
import * as authModule from '@/features/Auth';
import * as router from 'react-router-dom';

vi.mock('@/features/Auth', () => ({
  useLoginForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    }),
    loading: false,
    errors: {},
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>{children}</a>
    ),
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form with email and password fields', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders "Welcome back!" title', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  });

  it('renders "Forgot password?" link', () => {
    render(<LoginPage />);

    const forgotLink = screen.getByText(/forgot password/i);
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.tagName).toBe('A');
  });

  it('renders "Register" link', () => {
    render(<LoginPage />);

    const registerLink = screen.getByText(/register/i);
    expect(registerLink).toBeInTheDocument();
  });

  it('renders "Remember me" checkbox', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<LoginPage />);

    const themeButton = screen.getByRole('button');
    expect(themeButton).toBeInTheDocument();
  });

  it('displays error message when errors.general is present', () => {
    const errorMessage = 'Invalid credentials';
    vi.mocked(authModule.useLoginForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { general: errorMessage },
    });

    render(<LoginPage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays email field error', () => {
    const emailError = 'Email is required';
    vi.mocked(authModule.useLoginForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { email: emailError },
    });

    render(<LoginPage />);

    expect(screen.getByText(emailError)).toBeInTheDocument();
  });

  it('displays password field error', () => {
    const passwordError = 'Password is required';
    vi.mocked(authModule.useLoginForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { password: passwordError },
    });

    render(<LoginPage />);

    expect(screen.getByText(passwordError)).toBeInTheDocument();
  });

  it('shows loading state on submit button', () => {
    vi.mocked(authModule.useLoginForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: true,
      errors: {},
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  it('calls handleSubmit when form is submitted', async () => {
    const handleSubmit = vi.fn().mockImplementation((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    vi.mocked(authModule.useLoginForm).mockReturnValue({
      handleSubmit,
      loading: false,
      errors: {},
    });

    render(<LoginPage />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
