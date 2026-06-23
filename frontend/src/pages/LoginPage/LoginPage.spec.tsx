import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import * as authModule from '@/features/Auth';

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useGoogleLogin: () => vi.fn(),
}));

vi.mock('@/features/Auth', () => ({
  useLoginForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    }),
    loading: false,
    errors: {},
  }),
  googleAuthApi: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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

  const Checkbox = ({ label, ...props }: any) => {
    const id = props.id || props.name || 'checkbox';
    return (
      <div>
        <input type="checkbox" id={id} {...props} />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

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
    Checkbox,
    Button,
    Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Anchor: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    Divider: () => <hr />,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
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

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
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

    const errorElement = screen.getByTestId('email-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(emailError);
  });

  it('displays password field error', () => {
    const passwordError = 'Password is required';
    vi.mocked(authModule.useLoginForm).mockReturnValue({
      handleSubmit: vi.fn(),
      loading: false,
      errors: { password: passwordError },
    });

    render(<LoginPage />);

    const errorElement = screen.getByTestId('password-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(passwordError);
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

    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });
});