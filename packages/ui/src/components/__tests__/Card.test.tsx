import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  it('renders with basic content', () => {
    render(<Card title="Test Title">Card content</Card>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with tag', () => {
    render(
      <Card
        title="Tagged Card"
        tag={{ text: 'Featured', type: 'yellow' }}
      />
    );
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders body text', () => {
    render(<Card body="This is the body text" />);
    expect(screen.getByText('This is the body text')).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(<Card footer={<span>Footer content</span>} />);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { container } = render(<Card variant="featured" />);
    const cardElement = container.querySelector('div');
    expect(cardElement).toHaveClass('featured');
  });

  it('renders all tag types', () => {
    const types = ['yellow', 'red', 'green', 'purple', 'orange', 'brown'] as const;

    types.forEach((type) => {
      const { container } = render(
        <Card tag={{ text: `${type} Tag`, type }} />
      );
      expect(screen.getByText(`${type} Tag`)).toBeInTheDocument();
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders children correctly', () => {
    render(
      <Card>
        <div>Custom child content</div>
      </Card>
    );
    expect(screen.getByText('Custom child content')).toBeInTheDocument();
  });
});
