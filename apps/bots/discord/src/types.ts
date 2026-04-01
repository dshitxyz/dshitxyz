import type { Client, Guild, User } from 'discord.js';

export interface DiscordBotConfig {
  token: string;
  clientId: string;
  guildId: string;
  apiUrl: string;
  apiKey?: string;
}

export interface UserVerification {
  discordId: string;
  walletAddress: string;
  signature: string;
  verifiedAt: Date;
}

export interface GuildConfig {
  guildId: string;
  rolesConfig: {
    visitor: string;
    lurker: string;
    native: string;
    whale: string;
  };
  channels: {
    announcements: string;
    governance: string;
    contests: string;
  };
}

export interface DiscordContext {
  client: Client;
  guild?: Guild;
  user?: User;
  config: GuildConfig;
}
