import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '../DashboardPage';

vi.mock('@mantine/core', () => {
  const MockAppShell = ({ children, footer }: any) => (
    <div>
      <div data-testid="appshell-content">{children}</div>
      {footer}
    </div>
  );
  MockAppShell.Footer = ({ children }: any) => <div data-testid="appshell-footer">{children}</div>;
  return {
    AppShell: MockAppShell,
    Container: ({ children }: any) => <div>{children}</div>,
    Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Stack: ({ children }: any) => <div>{children}</div>,
    Group: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  };
});

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('renders welcome text', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument();
  });

  it('renders tab 1 button', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('button', { name: /tab 1/i })).toBeInTheDocument();
  });

  it('renders tab 2 button', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('button', { name: /tab 2/i })).toBeInTheDocument();
  });

  it('renders tab 1 content by default', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/tab 1 content/i)).toBeInTheDocument();
  });
});