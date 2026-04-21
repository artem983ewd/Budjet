import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubCategoryCard } from './SubCategoryCard';
import { SubCategory } from '@/entities/Category/model';
import { DomainStore } from '@/features/BudgetUI/types/store';

const mockSubCategory: SubCategory = {
  id: 'sub1',
  name: 'Restaurants',
  iconName: 'pizza',
};

const createMockStore = (overrides: Partial<DomainStore> = {}): DomainStore => ({
  categories: [],
  transactions: [],
  itemToDelete: null,
  getSubTotal: vi.fn(() => 100),
  getMainTotal: vi.fn(() => 0),
  addTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  addMainCategory: vi.fn(),
  addSubCategory: vi.fn(),
  confirmDeleteMainCategory: vi.fn(),
  confirmDeleteSubCategory: vi.fn(),
  setItemToDelete: vi.fn(),
  handleDeleteConfirmed: vi.fn(),
  ...overrides,
});

vi.mock('@mantine/core', () => ({
  Paper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Group: ({ children }: any) => <div>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  UnstyledButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  TextInput: ({ value, onChange, onBlur, onKeyDown, ...props }: any) => (
    <input
      data-testid="amount-input"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      {...props}
    />
  ),
  ActionIcon: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Tooltip: ({ children }: any) => <div>{children}</div>,
  Stack: ({ children }: any) => <div>{children}</div>,
  Box: ({ children }: any) => <div>{children}</div>,
  rem: (n: number) => n,
}));

vi.mock('@/shared/ui/IconRenderer', () => ({
  IconRenderer: ({ name }: { name: string; size?: number }) => (
    <span data-testid="icon-renderer">{name}</span>
  ),
}));

vi.mock('@/features/BudgetUI', () => ({
  useUIStore: () => ({
    openSubModal: vi.fn(),
    openDeleteModal: vi.fn(),
    editingSubId: null,
    amountValue: '',
    setEditingSubId: vi.fn(),
    setAmountValue: vi.fn(),
    hiddenSubs: new Set(),
    toggleSubTransactions: vi.fn(),
  }),
}));

describe('SubCategoryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders subcategory name', () => {
    const store = createMockStore();
    render(<SubCategoryCard sub={mockSubCategory} store={store} />);
    expect(screen.getByText('Restaurants')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const store = createMockStore();
    render(<SubCategoryCard sub={mockSubCategory} store={store} />);
    expect(screen.getByTestId('icon-renderer')).toBeInTheDocument();
  });
});