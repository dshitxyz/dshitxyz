// Types for Telegram Bot

export interface TokenPrice {
  current: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
}

export interface MemeSubmission {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  submitterTelegramId: number;
  createdAt: string;
}

export interface OrderNotification {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  productName: string;
  amount: string;
  estimatedDelivery: string;
}

export interface GovernanceStatus {
  activeProposals: number;
  votingPower: string;
  stakedAmount: string;
  nextProposalDeadline: string;
}

export interface UserState {
  telegramId: number;
  walletAddress?: string;
  preferences: {
    priceAlerts: boolean;
    contestReminders: boolean;
    govReminders: boolean;
  };
}
