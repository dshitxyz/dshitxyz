import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'featured', 'alert'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card variant
 */
export const Default: Story = {
  args: {
    variant: 'default',
    title: 'TURD SEASON 3',
    tag: { text: 'FEATURED DROP', type: 'yellow' },
    body: '10,000 generative turds, each unique. Some are corn. Some are smooth. One is platinum.',
    footer: <span>by anon_plumber_0x3f • 4,200/10,000 minted</span>,
  },
};

/**
 * Featured card variant - displays larger
 */
export const Featured: Story = {
  args: {
    variant: 'featured',
    title: 'TURD SEASON 3: THE GREAT DUMP',
    tag: { text: 'FEATURED DROP', type: 'yellow' },
    body: '10,000 generative turds, each unique. Some are corn. Some are smooth. One is platinum. All are worthless, except financially.',
    footer: <span>by anon_plumber_0x3f • 4,200/10,000 minted</span>,
  },
};

/**
 * Alert variant
 */
export const AlertVariant: Story = {
  args: {
    variant: 'alert',
    title: 'HOT DROP',
    tag: { text: 'HOT DROP', type: 'red' },
    body: 'Cross-chain bridge. No audit. Deployed on a Friday after taco night.',
  },
};

/**
 * Card with different tag types
 */
export const WithDifferentTags: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <Card tag={{ text: 'Yellow', type: 'yellow' }} title="Yellow Tag" />
      <Card tag={{ text: 'Red', type: 'red' }} title="Red Tag" />
      <Card tag={{ text: 'Green', type: 'green' }} title="Green Tag" />
      <Card tag={{ text: 'Purple', type: 'purple' }} title="Purple Tag" />
      <Card tag={{ text: 'Orange', type: 'orange' }} title="Orange Tag" />
      <Card tag={{ text: 'Brown', type: 'brown' }} title="Brown Tag" />
    </div>
  ),
};

/**
 * Card grid layout
 */
export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <Card variant="default" title="Card 1" />
      <Card variant="featured" title="Card 2 (Featured - spans 2 cols)" />
      <Card variant="default" title="Card 3" />
      <Card variant="default" title="Card 4" />
      <Card variant="default" title="Card 5" />
    </div>
  ),
};
