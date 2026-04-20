import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegisterPage } from '../RegisterPage';
import * as authModule from '@/features/Auth';

vi.mock('@/features/Auth', () => ({
  useRegisterForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    }),
    loading: false,
    errors: {},
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>{children}</a>
    ),
  };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders registration form with all fields', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('renders "Create account" title', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders "Login" link', () => {
    render(<RegisterPage />);

    const loginLink = screen.getByText(/login/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<RegisterPage />);

    const themeButton = screen.getByRole('button');
    expect(themeButton).toBeInTheDocument();
  });

  it('displays general error message', () => {
    const errorMessage = 'Registration failed';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { general: errorMessage },
    });

    render(<RegisterPage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays firstName field error', () => {
    const firstNameError = 'Введите имя';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { firstName: firstNameError },
    });

    render(<RegisterPage />);

    expect(screen.getByText(firstNameError)).toBeInTheDocument();
  });

  it('displays lastName field error', () => {
    const lastNameError = 'Введите фамилию';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { lastName: lastNameError },
    });

    render(<RegisterPage />);

    expect(screen.getByText(lastNameError)).toBeInTheDocument();
  });

  it('displays email field error', () => {
    const emailError = 'Введите корректный email';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { email: emailError },
    });

    render(<RegisterPage />);

    expect(screen.getByText(emailError)).toBeInTheDocument();
  });

  it('displays password field error', () => {
    const passwordError = 'Пароль должен быть не менее 6 символов';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { password: passwordError },
    });

    render(<RegisterPage />);

    expect(screen.getByText(passwordError)).toBeInTheDocument();
  });

  it('displays confirmPassword field error', () => {
    const confirmError = 'Пароли не совпадают';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { confirmPassword: confirmError },
    });

    render(<RegisterPage />);

    expect(screen.getByText(confirmError)).toBeInTheDocument();
  });

  it('shows loading state on submit button', () => {
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: true,
      errors: {},
    });

    render(<RegisterPage />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  it('calls handleSubmit when form is submitted', () => {
    const handleSubmit = vi.fn().mockImplementation((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit,
      loading: false,
      errors: {},
    });

    render(<RegisterPage />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
