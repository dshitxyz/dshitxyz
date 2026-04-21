import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['error', 'warning', 'success', 'info'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Error alert - Red, for critical issues
 */
export const Error: Story = {
  args: {
    type: 'error',
    title: 'MEGA DUMP EVENT',
    message: 'The protocol has entered Massive Dump Mode. All transactions processed in order of stench.',
  },
};

/**
 * Warning alert - Orange, for warnings
 */
export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'LOW FLUSH PRESSURE',
    message: 'The bowl is running low. Please add more liquidity to maintain operations.',
  },
};

/**
 * Success alert - Green, for success messages
 */
export const Success: Story = {
  args: {
    type: 'success',
    title: 'TRANSACTION CONFIRMED',
    message: 'Your dump was successful. Tracking ID: 0x42069...',
  },
};

/**
 * Info alert - Purple, for informational messages
 */
export const Info: Story = {
  args: {
    type: 'info',
    title: 'NEW FEATURE LIVE',
    message: 'The flush meter is now live. Check the dashboard for real-time stats.',
  },
};

/**
 * All alert types
 */
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Alert
        type="error"
        title="ERROR"
        message="SOMETHING WENT WRONG. PLEASE TRY AGAIN."
      />
      <Alert
        type="warning"
        title="WARNING"
        message="PROCEED WITH CAUTION. THIS ACTION CANNOT BE UNDONE."
      />
      <Alert
        type="success"
        title="SUCCESS"
        message="OPERATION COMPLETED SUCCESSFULLY."
      />
      <Alert
        type="info"
        title="INFO"
        message="HERE IS SOME USEFUL INFORMATION FOR YOU."
      />
    </div>
  ),
};

/**
 * Alert with custom icon
 */
export const CustomIcon: Story = {
  args: {
    type: 'info',
    title: 'CUSTOM ICON',
    message: 'This alert has a custom emoji icon',
    icon: '🎉',
  },
};

/**
 * Alert with long message
 */
export const LongMessage: Story = {
  args: {
    type: 'error',
    title: 'CRITICAL ERROR',
    message: 'The protocol has encountered a critical error. All transactions have been paused. The dev team has been notified and is investigating. Please do not attempt to perform any transactions at this time. Your funds are safe.',
  },
};
