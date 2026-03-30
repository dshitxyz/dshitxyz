import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatBox } from '../StatBox';

describe('StatBox Component', () => {
  it('renders number and label', () => {
    render(<StatBox number="$4.2B" label="Total Value Dumped" />);
    expect(screen.getByText('$4.2B')).toBeInTheDocument();
    expect(screen.getByText('Total Value Dumped')).toBeInTheDocument();
  });

  it('renders sub-label when provided', () => {
    render(
      <StatBox
        number="847K"
        label="Degens in the Bowl"
        subLabel="▲ +3.1K today"
      />
    );
    expect(screen.getByText('▲ +3.1K today')).toBeInTheDocument();
  });

  it('renders with all accent color options', () => {
    const colors = ['yellow', 'red', 'green', 'purple', 'orange', 'brown'] as const;

    colors.forEach((color) => {
      const { container } = render(
        <StatBox
          number="100"
          label={`${color} accent`}
          accentColor={color}
        />
      );
      expect(screen.getByText(`${color} accent`)).toBeInTheDocument();
    });
  });

  it('renders with default yellow accent', () => {
    const { container } = render(<StatBox number="123" label="Test" />);
    const accent = container.querySelector('.accentYellow');
    expect(accent).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<StatBox ref={ref} number="99" label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('handles numeric number prop', () => {
    render(<StatBox number={999} label="Test Number" />);
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatBox number="50" label="Test" className="custom-class" />
    );
    const element = container.querySelector('.custom-class');
    expect(element).toBeInTheDocument();
  });
});
