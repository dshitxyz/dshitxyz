/**
 * Telegram Bot Message Formatting Utilities
 */

export interface TokenData {
  price: string;
  marketCap: string;
  volume24h: string;
  change24h: string;
  change7d: string;
  holders: number;
  supply: string;
  circulating: string;
}

export interface PlatformStats {
  totalMemes: number;
  totalCreators: number;
  totalVotes: number;
  avgVotesPerMeme: number;
  memesCreatedToday: number;
  deployedNetwork: string;
  contractAddress: string;
}

export interface LeaderboardEntry {
  creator: string;
  totalVotes: number;
  memesCount: number;
  earnings: string;
}

/**
 * Format price data into markdown message
 */
export function formatPriceMessage(token: TokenData): string {
  return `
💰 **DSHIT Token Price**

Price: ${token.price}
Market Cap: ${token.marketCap}
24h Volume: ${token.volume24h}
24h Change: ${token.change24h}
7d Change: ${token.change7d}

Holders: ${token.holders.toLocaleString()}
Supply: ${token.supply}
Circulating: ${token.circulating}

[Buy on Uniswap](https://uniswap.exchange) | [View Chart](https://dexscreener.com)
  `.trim();
}

/**
 * Format platform stats into markdown message
 */
export function formatStatsMessage(stats: PlatformStats): string {
  return `
📊 **dshit.xyz Platform Stats**

Total Memes: ${stats.totalMemes.toLocaleString()}
Active Creators: ${stats.totalCreators.toLocaleString()}
Total Votes: ${stats.totalVotes.toLocaleString()}
Avg Votes/Meme: ${stats.avgVotesPerMeme}
Memes Today: ${stats.memesCreatedToday}

Network: ${stats.deployedNetwork}
Contract: \`${stats.contractAddress.substring(0, 6)}...${stats.contractAddress.substring(-4)}\`

[View Dashboard](https://dshitxyz.vercel.app/dashboard)
  `.trim();
}

/**
 * Format leaderboard into markdown message
 */
export function formatLeaderboardMessage(entries: LeaderboardEntry[]): string {
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  let message = '🏆 **Top Meme Creators**\n\n';

  entries.forEach((entry, index) => {
    const medal = medals[index] || `${index + 1}️⃣`;
    message += `${medal} **${entry.creator}**
   Votes: ${entry.totalVotes.toLocaleString()}
   Memes: ${entry.memesCount}
   Earnings: ${entry.earnings}\n\n`;
  });

  message += '[Full Leaderboard](https://dshitxyz.vercel.app/gallery)';

  return message;
}

/**
 * Format error message with context
 */
export function formatErrorMessage(context: string, error?: Error): string {
  let message = `❌ Error: Failed to ${context}`;

  if (error?.message) {
    message += `\n\nDetails: ${error.message}`;
  }

  message += '\n\nPlease try again later or use /help for assistance.';

  return message;
}

/**
 * Format success message
 */
export function formatSuccessMessage(message: string, details?: string): string {
  let fullMessage = `✅ ${message}`;

  if (details) {
    fullMessage += `\n\n${details}`;
  }

  return fullMessage;
}

/**
 * Format alert created message
 */
export function formatAlertCreatedMessage(
  alertId: string,
  targetPrice: number
): string {
  return formatSuccessMessage(
    'Price alert created!',
    `Alert ID: \`${alertId}\`
Target Price: $${targetPrice}

You'll be notified when DSHIT reaches this price.
Use /alerts to view all your alerts.`
  );
}

/**
 * Format alert triggered message
 */
export function formatAlertTriggeredMessage(targetPrice: number): string {
  return `🔔 **Price Alert Triggered!**

DSHIT has reached your target price of $${targetPrice}

[View Chart](https://dexscreener.com) | [Buy Now](https://uniswap.exchange)`;
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars: number = 6): string {
  return `${address.substring(0, chars)}...${address.substring(-chars)}`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
