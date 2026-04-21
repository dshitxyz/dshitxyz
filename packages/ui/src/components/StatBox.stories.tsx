import type { Meta, StoryObj } from '@storybook/react';
import { StatBox } from './StatBox';

const meta = {
  title: 'Components/StatBox',
  component: StatBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    accentColor: {
      control: 'radio',
      options: ['yellow', 'red', 'green', 'purple', 'orange', 'brown'],
    },
  },
} satisfies Meta<typeof StatBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single stat box with yellow accent
 */
export const Default: Story = {
  args: {
    number: '$4.2B',
    label: 'Total Value Dumped',
    subLabel: '▲ +12.3% since last flush',
    accentColor: 'yellow',
  },
};

/**
 * Stat box with red accent
 */
export const RedAccent: Story = {
  args: {
    number: '847K',
    label: 'Degens in the Bowl',
    subLabel: '▲ +3.1K today alone',
    accentColor: 'red',
  },
};

/**
 * All accent color variations
 */
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
      <StatBox
        number="$4.2B"
        label="Total Value Dumped"
        accentColor="yellow"
      />
      <StatBox
        number="847K"
        label="Degens in the Bowl"
        accentColor="red"
      />
      <StatBox
        number="69M"
        label="Turds Minted"
        accentColor="green"
      />
      <StatBox
        number="0"
        label="Audits Passed"
        accentColor="purple"
      />
      <StatBox
        number="∞"
        label="Supply"
        accentColor="orange"
      />
      <StatBox
        number="100%"
        label="Degenerate"
        accentColor="brown"
      />
    </div>
  ),
};

/**
 * Stat box without sub-label
 */
export const NoSubLabel: Story = {
  args: {
    number: '420',
    label: 'Blocks Processed',
    accentColor: 'orange',
  },
};

/**
 * Stats grid layout
 */
export const StatsGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', border: '3px solid #F4D03F' }}>
      <StatBox
        number="$4.2B"
        label="Total Value Dumped"
        subLabel="▲ +12.3% since last flush"
        accentColor="yellow"
      />
      <StatBox
        number="847K"
        label="Degens in the Bowl"
        subLabel="▲ +3.1K today alone"
        accentColor="red"
      />
      <StatBox
        number="69M"
        label="Turds Minted"
        subLabel="∞ supply. yes, really."
        accentColor="green"
      />
      <StatBox
        number="0"
        label="Audits Passed"
        subLabel="▼ we don't do audits"
        accentColor="purple"
      />
    </div>
  ),
};
