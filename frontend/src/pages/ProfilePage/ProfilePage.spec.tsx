import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfilePage } from '../ProfilePage';

vi.mock('@mantine/core', () => ({
  Container: ({ children }: any) => <div>{children}</div>,
  Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Stack: ({ children }: any) => <div>{children}</div>,
  Group: ({ children }: any) => <div>{children}</div>,
}));

describe('ProfilePage', () => {
  it('renders profile title', () => {
    render(<ProfilePage />);
    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
  });

  it('renders profile description', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/profile information/i)).toBeInTheDocument();
  });

  it('renders user name', () => {
    render(<ProfilePage />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders user email', () => {
    render(<ProfilePage />);
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('renders avatar', () => {
    render(<ProfilePage />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});