import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainPage } from '../MainPage';
import { Navigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to, replace }: { to: string; replace: boolean }) => (
    <div data-testid="navigate" data-to={to} data-replace={replace} />
  ),
}));

describe('MainPage', () => {
  it('renders Navigate component', () => {
    render(<MainPage />);
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
  });

  it('navigates to /main/dashboard', () => {
    render(<MainPage />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/main/dashboard');
  });

  it('uses replace navigation', () => {
    render(<MainPage />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
  });
});