import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['main', 'ghost'],
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Main variant button - used for primary actions
 * Features yellow background with brown shadow
 */
export const Main: Story = {
  args: {
    variant: 'main',
    children: '💩 TAKE THE PLUNGE',
  },
};

/**
 * Ghost variant button - used for secondary actions
 * Features transparent background with yellow border
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'READ THE STINKPAPER',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    variant: 'main',
    disabled: true,
    children: 'DISABLED BUTTON',
  },
};

/**
 * Button as link
 */
export const AsLink: Story = {
  args: {
    variant: 'main',
    href: '#',
    children: 'GO TO PAGE',
  },
};

/**
 * All variants together
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="main">Main Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="main" disabled>
        Disabled Main
      </Button>
      <Button variant="ghost" disabled>
        Disabled Ghost
      </Button>
    </div>
  ),
};
