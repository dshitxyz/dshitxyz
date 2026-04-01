/**
 * Discord Bot Type Definitions
 */

export interface DiscordConfig {
  token: string;
  clientId: string;
  guildId: string;
  apiUrl: string;
  logLevel: string;
  environment: 'development' | 'production' | 'test';
}

export interface Member {
  userId: string;
  username: string;
  discordId: string;
  roles: string[];
  joinedAt: Date;
  reputation: number;
  dshitBalance: number;
}

export interface Vote {
  proposalId: string;
  voterId: string;
  choice: 'for' | 'against' | 'abstain';
  votingPower: number;
  votedAt: Date;
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: 'contest' | 'voting' | 'announcement' | 'raid';
  startDate: Date;
  endDate: Date;
  participants: number;
  prize?: string;
  status: 'active' | 'completed' | 'cancelled';
}
