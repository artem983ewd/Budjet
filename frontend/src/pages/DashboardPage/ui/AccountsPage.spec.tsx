import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccountsPage } from './AccountsPage';

vi.mock('@/features/Accounts', () => ({
  useAccounts: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useCreateAccount: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useUpdateAccount: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useDeleteAccount: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useAccountsStore: vi.fn(() => ({
    createModalOpened: false,
    newAccountName: '',
    newAccountBalance: 0,
    newAccountTarget: 0,
    selectedIcon: 'home',
    editModalOpened: false,
    editingAccount: null,
    editAccountName: '',
    editAccountBalance: 0,
    editAccountTarget: 0,
    editSelectedIcon: 'home',
    openCreateModal: vi.fn(),
    closeCreateModal: vi.fn(),
    setNewAccountName: vi.fn(),
    setNewAccountBalance: vi.fn(),
    setNewAccountTarget: vi.fn(),
    setSelectedIcon: vi.fn(),
    openEditModal: vi.fn(),
    closeEditModal: vi.fn(),
    setEditAccountName: vi.fn(),
    setEditAccountBalance: vi.fn(),
    setEditAccountTarget: vi.fn(),
    setEditSelectedIcon: vi.fn(),
  })),
}));

vi.mock('@/shared/ui/IconRenderer', () => ({
  IconRenderer: ({ name }: { name: string; size?: number }) => (
    <span data-testid="icon-renderer">{name}</span>
  ),
  IconSelector: vi.fn(() => <div data-testid="icon-selector" />),
  IconName: 'home',
}));

vi.mock('@mantine/core', () => ({
  Box: ({ children }: any) => <div>{children}</div>,
  Stack: ({ children }: any) => <div>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Group: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Loader: () => <div data-testid="loader" />,
  Center: ({ children }: any) => <div>{children}</div>,
  Paper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  ActionIcon: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Modal: ({ opened, children }: any) => (opened ? <div>{children}</div> : null),
  NumberInput: ({ value, onChange, ...props }: any) => (
    <input type="number" value={value} onChange={onChange} {...props} />
  ),
  TextInput: ({ value, onChange, ...props }: any) => (
    <input type="text" value={value} onChange={onChange} {...props} />
  ),
  SimpleGrid: ({ children }: any) => <div>{children}</div>,
  Progress: ({ value }: any) => <div data-testid="progress" data-value={value} />,
  UnstyledButton: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  Tooltip: ({ children }: any) => <div>{children}</div>,
}));

describe('AccountsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title', () => {
    render(<AccountsPage />);
    expect(screen.getByText('Счета')).toBeInTheDocument();
  });

  it('renders "Новый счёт" button', () => {
    render(<AccountsPage />);
    expect(screen.getByText('Новый счёт')).toBeInTheDocument();
  });

  it('renders empty state when no accounts', () => {
    render(<AccountsPage />);
    expect(screen.getByText('Нет счетов')).toBeInTheDocument();
  });

  it('renders total balance section', () => {
    render(<AccountsPage />);
    expect(screen.getByText('Общий баланс')).toBeInTheDocument();
  });
});