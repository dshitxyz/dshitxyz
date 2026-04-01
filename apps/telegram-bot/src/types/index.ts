/**
 * Telegram Bot Type Definitions
 */

export interface UserSubscription {
  userId: number;
  chatId: number;
  priceAlerts: boolean;
  orderUpdates: boolean;
  governanceReminders: boolean;
  createdAt: Date;
  lastActive: Date;
}

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  timestamp: Date;
}

export interface OrderData {
  orderId: string;
  userId: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ProposalData {
  proposalId: string;
  title: string;
  description: string;
  status: 'pending' | 'voting' | 'passed' | 'failed' | 'executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  deadline: Date;
  createdAt: Date;
  proposer: string;
}

export interface MemeSubmission {
  id: string;
  userId: number;
  caption: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
}

export interface BotConfig {
  token: string;
  adminId: number;
  apiUrl: string;
  priceApiUrl: string;
  databaseUrl: string;
  logLevel: string;
  environment: 'development' | 'production' | 'test';
  webhookUrl?: string;
  webhookPort?: number;
}

export interface CommandHandler {
  name: string;
  handler: (ctx: any) => Promise<void>;
  description: string;
  hidden?: boolean;
}
