import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryAccordion } from './CategoryAccordion';
import { MainCategory } from '@/entities/Category/model';
import { type DomainStore } from '@/shared/lib/stores';

const mockMainCategory: MainCategory = {
  id: 'cat1',
  name: 'Food',
  iconName: 'pizza',
  subCategories: [],
};

const createMockStore = (): DomainStore => ({
  categories: [],
  transactions: [],
  itemToDelete: null,
  getSubTotal: vi.fn(() => 0),
  getMainTotal: vi.fn(() => 0),
  addTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  addMainCategory: vi.fn(),
  addSubCategory: vi.fn(),
  confirmDeleteMainCategory: vi.fn(),
  confirmDeleteSubCategory: vi.fn(),
  setItemToDelete: vi.fn(),
  handleDeleteConfirmed: vi.fn(),
});

vi.mock('@mantine/core', () => ({
  Accordion: {
    Item: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Control: ({ children }: any) => <div data-testid="accordion-control">{children}</div>,
    Panel: ({ children }: any) => <div data-testid="accordion-panel">{children}</div>,
  },
  Stack: ({ children }: any) => <div>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Group: ({ children }: any) => <div>{children}</div>,
  UnstyledButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Tooltip: ({ children }: any) => <div>{children}</div>,
  Paper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('@/shared/ui/IconRenderer', () => ({
  IconRenderer: ({ name }: { name: string; size?: number }) => (
    <span data-testid="icon-renderer">{name}</span>
  ),
}));

vi.mock('@/shared/lib/stores', () => ({
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

vi.mock('../../SubCategoryCard', () => ({
  SubCategoryCard: () => <div data-testid="subcategory-card" />,
}));

describe('CategoryAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders category name', () => {
    const store = createMockStore();
    render(<CategoryAccordion cat={mockMainCategory} store={store} />);
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  it('renders category icon', () => {
    const store = createMockStore();
    render(<CategoryAccordion cat={mockMainCategory} store={store} />);
    expect(screen.getByTestId('icon-renderer')).toBeInTheDocument();
  });

  it('renders accordion control', () => {
    const store = createMockStore();
    render(<CategoryAccordion cat={mockMainCategory} store={store} />);
    expect(screen.getByTestId('accordion-control')).toBeInTheDocument();
  });
});