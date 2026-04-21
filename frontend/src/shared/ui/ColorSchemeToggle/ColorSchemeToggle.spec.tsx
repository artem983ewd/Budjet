import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorSchemeToggle } from './ColorSchemeToggle';

vi.mock('@mantine/core', () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  Group: ({ children }: any) => <div>{children}</div>,
  useMantineColorScheme: () => ({ setColorScheme: vi.fn() }),
}));

describe('ColorSchemeToggle', () => {
  it('renders light, dark, and auto buttons', () => {
    render(<ColorSchemeToggle />);
    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auto/i })).toBeInTheDocument();
  });

  it('has three buttons', () => {
    render(<ColorSchemeToggle />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });
});