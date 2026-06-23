import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainLayout } from '../MainLayout';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet" />,
  useLocation: () => ({ pathname: '/main/dashboard' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('@mantine/core', () => {
  const MockAppShell = ({ children }: any) => <div data-testid="appshell">{children}</div>;
  MockAppShell.Header = ({ children }: any) => <div data-testid="header">{children}</div>;
  MockAppShell.Navbar = ({ children }: any) => <div data-testid="navbar">{children}</div>;
  MockAppShell.Main = ({ children }: any) => <div data-testid="main">{children}</div>;
  return {
    AppShell: MockAppShell,
    Burger: ({ opened, onClick }: any) => (
      <button data-testid="burger" onClick={onClick}>{opened ? 'open' : 'closed'}</button>
    ),
    Group: ({ children }: any) => <div>{children}</div>,
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    Drawer: ({ opened, children }: any) =>
      opened ? <div data-testid="drawer">{children}</div> : null,
    NavLink: ({ label, onClick }: any) => (
      <button onClick={onClick} data-testid={`nav-${label}`}>{label}</button>
    ),
    Stack: ({ children }: any) => <div>{children}</div>,
    ActionIcon: ({ children, onClick }: any) => (
      <button onClick={onClick}>{children}</button>
    ),
    Divider: () => <div data-testid="divider" />,
    useMantineColorScheme: () => ({ setColorScheme: vi.fn() }),
    useComputedColorScheme: () => 'light',
  };
});

vi.mock('@mantine/hooks', () => ({
  useMediaQuery: vi.fn(() => false),
}));

vi.mock('../model/sidebarItems', () => ({
  sidebarItems: [
    { path: '/main/dashboard', label: 'Dashboard', icon: () => null },
    { path: '/main/accounts', label: 'Accounts', icon: () => null },
    { path: '/main/settings', label: 'Settings', icon: () => null },
  ],
}));

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders AppShell', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('appshell')).toBeInTheDocument();
  });

  it('renders Outlet for nested routes', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders sidebar navigation items', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('nav-Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-Settings')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<MainLayout />);
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });

  it('renders burger menu', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('burger')).toBeInTheDocument();
  });

  it('clears tokens and navigates to / on logout', async () => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('refresh_token', 'test-refresh');

    render(<MainLayout />);

    const logoutButton = screen.getByText('Выйти');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});