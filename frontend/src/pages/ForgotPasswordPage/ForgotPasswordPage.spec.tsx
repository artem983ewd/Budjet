import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ForgotPasswordPage } from '../ForgotPasswordPage';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

vi.mock('@mantine/core', () => ({
  Anchor: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Paper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  TextInput: ({ label, placeholder, id, ...props }: any) => (
    <div>
      <label htmlFor={id || 'email'}>{label}</label>
      <input placeholder={placeholder} id={id || 'email'} {...props} />
    </div>
  ),
  Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Container: ({ children }: any) => <div>{children}</div>,
  ActionIcon: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Center: ({ children }: any) => <div>{children}</div>,
  useMantineColorScheme: () => ({ setColorScheme: vi.fn() }),
  useComputedColorScheme: () => 'light',
}));

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders forgot password title', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('renders send reset link button', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('renders back to login link', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/remember your password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
  });
});