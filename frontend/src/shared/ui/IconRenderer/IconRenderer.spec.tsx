import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { IconRenderer, AVAILABLE_ICONS } from './IconRenderer';

describe('IconRenderer', () => {
  it('renders icon by name', () => {
    const { container } = render(<IconRenderer name="home" size={16} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders icon with custom size', () => {
    const { container } = render(<IconRenderer name="home" size={24} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders default icon (plus) for unknown name', () => {
    const { container } = render(<IconRenderer name="unknown-icon" size={16} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders each icon from AVAILABLE_ICONS', () => {
    AVAILABLE_ICONS.forEach(({ name }) => {
      const { container } = render(<IconRenderer name={name} size={16} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});

describe('AVAILABLE_ICONS', () => {
  it('contains at least 10 icons', () => {
    expect(AVAILABLE_ICONS.length).toBeGreaterThanOrEqual(10);
  });

  it('each icon has name and component', () => {
    AVAILABLE_ICONS.forEach((icon) => {
      expect(icon.name).toBeTruthy();
      expect(icon.component).toBeTruthy();
    });
  });

  it('has expected common icons', () => {
    const iconNames = AVAILABLE_ICONS.map((i) => i.name);
    expect(iconNames).toContain('home');
    expect(iconNames).toContain('car');
    expect(iconNames).toContain('wallet');
  });
});