/**
 * Partnership data model and utilities
 * Enables integration with other projects for cross-promotion and ecosystem growth
 */

export type PartnershipType = 'memecoin' | 'ecosystem' | 'aggregator' | 'community';

export interface Partnership {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: PartnershipType;
  website?: string;
  twitterHandle?: string;
  active: boolean;
  metrics: PartnershipMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface PartnershipMetrics {
  reach: number; // estimated monthly reach
  conversions: number; // total conversions
  conversionRate: number; // percentage
  revenueShare: number; // percentage revenue share
  totalRevenue: number; // total revenue generated
}

export interface PartnershipApplication {
  id: string;
  projectName: string;
  email: string;
  website: string;
  type: PartnershipType;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

/**
 * Sample partnerships data for seeding
 */
export const SAMPLE_PARTNERSHIPS: Partnership[] = [
  {
    id: 'partner-1',
    name: 'Meme Swap Protocol',
    logo: 'https://api.dicebear.com/7.x/pixels/svg?seed=memeswap&backgroundColor=F4D03F',
    description:
      'Cross-chain DEX specializing in meme token swaps. 50K+ daily traders on Base ecosystem.',
    type: 'ecosystem',
    website: 'https://memeswap.xyz',
    twitterHandle: '@MemeSwapXYZ',
    active: true,
    metrics: {
      reach: 50000,
      conversions: 1200,
      conversionRate: 2.4,
      revenueShare: 5,
      totalRevenue: 45000,
    },
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'partner-2',
    name: 'BasePunks Community',
    logo: 'https://api.dicebear.com/7.x/pixels/svg?seed=basepunks&backgroundColor=8B4513',
    description:
      'Major memecoin with 200K holders on Base. Strong marketing reach and community engagement.',
    type: 'memecoin',
    website: 'https://basepunks.xyz',
    twitterHandle: '@BasePunksXYZ',
    active: true,
    metrics: {
      reach: 200000,
      conversions: 8400,
      conversionRate: 4.2,
      revenueShare: 8,
      totalRevenue: 125000,
    },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'partner-3',
    name: 'Memecoin Aggregator Plus',
    logo: 'https://api.dicebear.com/7.x/pixels/svg?seed=aggregator&backgroundColor=FF6600',
    description:
      'Top memecoin tracking platform with 150K+ monthly visitors. Featured meme distribution.',
    type: 'aggregator',
    website: 'https://memeplus.xyz',
    twitterHandle: '@MemeAggPlus',
    active: true,
    metrics: {
      reach: 150000,
      conversions: 4500,
      conversionRate: 3.0,
      revenueShare: 3,
      totalRevenue: 35000,
    },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'partner-4',
    name: 'Base Builders DAO',
    logo: 'https://api.dicebear.com/7.x/pixels/svg?seed=builders&backgroundColor=39FF14',
    description:
      'Active DAO building on Base with 500+ member community. Co-marketing and partnership opportunities.',
    type: 'community',
    website: 'https://basebuilders.xyz',
    twitterHandle: '@BaseBuilders',
    active: true,
    metrics: {
      reach: 75000,
      conversions: 1800,
      conversionRate: 2.4,
      revenueShare: 4,
      totalRevenue: 28000,
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'partner-5',
    name: 'CyberShit Protocol',
    logo: 'https://api.dicebear.com/7.x/pixels/svg?seed=cyber&backgroundColor=BF00FF',
    description:
      'Cyberpunk-themed memecoin with niche audience. 30K holders, strong Discord community.',
    type: 'memecoin',
    website: 'https://cybershit.xyz',
    twitterHandle: '@CyberShitXYZ',
    active: true,
    metrics: {
      reach: 30000,
      conversions: 720,
      conversionRate: 2.4,
      revenueShare: 6,
      totalRevenue: 18000,
    },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get partnership type label for UI
 */
export function getPartnershipTypeLabel(type: PartnershipType): string {
  const labels: Record<PartnershipType, string> = {
    memecoin: 'Memecoin',
    ecosystem: 'Ecosystem',
    aggregator: 'Aggregator',
    community: 'Community',
  };
  return labels[type];
}

/**
 * Get partnership type color for UI badges
 */
export function getPartnershipTypeColor(type: PartnershipType): string {
  const colors: Record<PartnershipType, string> = {
    memecoin: '#F4D03F', // shit-yellow
    ecosystem: '#FF6600', // industrial-orange
    aggregator: '#39FF14', // toxic-green
    community: '#BF00FF', // cyber-purple
  };
  return colors[type];
}
