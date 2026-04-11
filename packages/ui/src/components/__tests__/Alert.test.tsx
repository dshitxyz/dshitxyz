import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert } from '../Alert';

describe('Alert Component', () => {
  it('renders title and message', () => {
    render(
      <Alert title="Error" message="Something went wrong" type="error" />
    );
    expect(screen.getByText(/ERROR/)).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders all alert types', () => {
    const types = ['error', 'warning', 'success', 'info'] as const;

    types.forEach((type) => {
      const { container } = render(
        <Alert
          title={type}
          message={`${type} message`}
          type={type}
        />
      );
      expect(container.querySelector(`.type${type.charAt(0).toUpperCase() + type.slice(1)}`)).toBeInTheDocument();
    });
  });

  it('renders custom icon', () => {
    render(
      <Alert
        title="Custom"
        message="With custom icon"
        icon="🎉"
        type="info"
      />
    );
    expect(screen.getByText(/🎉/)).toBeInTheDocument();
  });

  it('renders default icons when not provided', () => {
    const { rerender } = render(
      <Alert title="Error" message="Error alert" type="error" />
    );
    expect(screen.getByText(/⚠️/)).toBeInTheDocument();

    rerender(<Alert title="Warning" message="Warning alert" type="warning" />);
    expect(screen.getByText(/⚡/)).toBeInTheDocument();

    rerender(<Alert title="Success" message="Success alert" type="success" />);
    expect(screen.getByText(/✅/)).toBeInTheDocument();

    rerender(<Alert title="Info" message="Info alert" type="info" />);
    expect(screen.getByText(/ℹ️/)).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} title="Test" message="Test message" type="info" />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Alert
        title="Test"
        message="Test message"
        type="info"
        className="custom-class"
      />
    );
    const element = container.querySelector('.custom-class');
    expect(element).toBeInTheDocument();
  });

  it('uppercases title in output', () => {
    render(<Alert title="warning" message="Test" type="warning" />);
    expect(screen.getByText(/WARNING/)).toBeInTheDocument();
  });
});
