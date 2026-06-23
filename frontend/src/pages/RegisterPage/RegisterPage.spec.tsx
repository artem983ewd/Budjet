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

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

vi.mock('@mantine/core', () => {
  const TextInput = ({ label, name, error, ...props }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} name={name} data-testid={name} aria-invalid={!!error} {...props} />
      {error && <span data-testid={`${name}-error`}>{error}</span>}
    </div>
  );

  const PasswordInput = ({ label, name, error, ...props }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type="password" id={name} name={name} data-testid={name} aria-invalid={!!error} {...props} />
      {error && <span data-testid={`${name}-error`}>{error}</span>}
    </div>
  );

  const Button = ({ children, loading, ...props }: any) => (
    <button disabled={loading} aria-busy={loading} {...props}>{children}</button>
  );

  return {
    useMantineColorScheme: () => ({ setColorScheme: vi.fn() }),
    useComputedColorScheme: () => 'dark',
    useMantineTheme: () => ({}),
    Center: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ActionIcon: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Paper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    Text: ({ children, ...props }: any) => {
      if (props.c === 'red') {
        return <span style={{ color: 'red' }} {...props}>{children}</span>;
      }
      return <span {...props}>{children}</span>;
    },
    PasswordInput,
    TextInput,
    Button,
    Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Anchor: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    Divider: () => <hr />,
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

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
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

    const errorElement = screen.getByTestId('firstName-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(firstNameError);
  });

  it('displays lastName field error', () => {
    const lastNameError = 'Введите фамилию';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { lastName: lastNameError },
    });

    render(<RegisterPage />);

    const errorElement = screen.getByTestId('lastName-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(lastNameError);
  });

  it('displays email field error', () => {
    const emailError = 'Введите корректный email';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { email: emailError },
    });

    render(<RegisterPage />);

    const errorElement = screen.getByTestId('email-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(emailError);
  });

  it('displays password field error', () => {
    const passwordError = 'Пароль должен быть не менее 6 символов';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { password: passwordError },
    });

    render(<RegisterPage />);

    const errorElement = screen.getByTestId('password-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(passwordError);
  });

  it('displays confirmPassword field error', () => {
    const confirmError = 'Пароли не совпадают';
    vi.mocked(authModule.useRegisterForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { confirmPassword: confirmError },
    });

    render(<RegisterPage />);

    const errorElement = screen.getByTestId('confirmPassword-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(confirmError);
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

    const submitButton = screen.getByRole('button', { name: /register/i });
    const form = submitButton.closest('form')!;
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
});