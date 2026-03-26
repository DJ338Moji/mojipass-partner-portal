import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from './Logo';

describe('Logo Component', () => {
  it('renders MOJIPASS text when showText is true', () => {
    render(<Logo showText={true} />);
    expect(screen.getByText(/MOJIPASS/i)).toBeInTheDocument();
  });
});
