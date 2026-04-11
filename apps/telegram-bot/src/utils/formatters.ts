/**
 * Format DSHIT amount with commas and decimals
 */
export function formatDSHIT(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

/**
 * Format price in USD
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(price);
}

/**
 * Escape markdown special characters for Telegram
 */
export function escapeMarkdown(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
}

/**
 * Format timestamp in human-readable format
 */
export function formatTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  });
}

/**
 * Create a price alert message
 */
export function formatPriceAlert(
  price: number,
  change24h?: number,
  marketCap?: number
): string {
  let message = `💰 *DSHIT Price Update*\n\n`;
  message += `Price: *${formatPrice(price)}*\n`;

  if (change24h !== undefined) {
    const arrow = change24h >= 0 ? '📈' : '📉';
    message += `24h Change: ${arrow} *${Math.abs(change24h).toFixed(2)}%*\n`;
  }

  if (marketCap !== undefined) {
    message += `Market Cap: *${formatPrice(marketCap)}*\n`;
  }

  message += `\n_Updated at ${formatTime(new Date())}_`;
  return message;
}

/**
 * Create an order notification message
 */
export function formatOrderNotification(orderId: string, status: string, details?: Record<string, string>): string {
  let message = `📦 *Order Update*\n\n`;
  message += `Order ID: \`${orderId}\`\n`;
  message += `Status: *${status}*\n`;

  if (details) {
    Object.entries(details).forEach(([key, value]) => {
      message += `${key}: ${value}\n`;
    });
  }

  return message;
}

/**
 * Create a governance reminder message
 */
export function formatGovernanceReminder(
  proposalId: string,
  title: string,
  timeRemaining: string
): string {
  let message = `🗳️ *Governance Vote Reminder*\n\n`;
  message += `Proposal: *${escapeMarkdown(title)}*\n`;
  message += `ID: \`${proposalId}\`\n`;
  message += `⏰ Time Remaining: *${timeRemaining}*\n`;
  message += `\nUse /vote to cast your vote`;
  return message;
}
