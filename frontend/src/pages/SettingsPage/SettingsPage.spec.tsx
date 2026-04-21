import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsPage } from '../SettingsPage';

vi.mock('@mantine/core', () => ({
  Container: ({ children }: any) => <div>{children}</div>,
  Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Stack: ({ children }: any) => <div>{children}</div>,
  Switch: ({ label, ...props }: any) => (
    <label>
      <span>{label}</span>
      <input type="checkbox" {...props} />
    </label>
  ),
}));

describe('SettingsPage', () => {
  it('renders settings title', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders settings description', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/manage your preferences/i)).toBeInTheDocument();
  });

  it('renders appearance section', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  it('renders dark mode switch', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/dark mode/i)).toBeInTheDocument();
  });

  it('renders notifications section', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders email notifications switch', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/email notifications/i)).toBeInTheDocument();
  });

  it('renders push notifications switch', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/push notifications/i)).toBeInTheDocument();
  });
});