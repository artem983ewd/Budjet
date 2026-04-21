import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconSelector } from './IconSelector';
import { AVAILABLE_ICONS, IconName } from './IconRenderer';

vi.mock('@mantine/core', () => ({
  SimpleGrid: ({ children }: any) => <div>{children}</div>,
  ActionIcon: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  ),
  Group: ({ children }: any) => <div>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Box: ({ children }: any) => <div>{children}</div>,
}));

describe('IconSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders icon selector with icons', () => {
    render(<IconSelector value="home" onChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onChange when icon is clicked', () => {
    const onChange = vi.fn();
    render(<IconSelector value="home" onChange={onChange} />);

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 1) {
      fireEvent.click(buttons[1]);
      expect(onChange).toHaveBeenCalled();
    }
  });

  it('shows pagination when there are more icons than ICONS_PER_PAGE (20)', () => {
    render(<IconSelector value="home" onChange={vi.fn()} />);
    const text = screen.queryByText(/\d+ \/ \d+/);
    if (AVAILABLE_ICONS.length > 20) {
      expect(text).toBeInTheDocument();
    }
  });

  it('renders icons in a grid', () => {
    render(<IconSelector value="home" onChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});