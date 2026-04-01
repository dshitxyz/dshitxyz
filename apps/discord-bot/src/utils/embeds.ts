import { EmbedBuilder } from 'discord.js';

const COLORS = {
  primary: 0xf4d03f,    // Shit Yellow
  secondary: 0x8b4513,   // Poop Brown
  success: 0x39ff14,     // Toxic Green
  error: 0xff0000,       // Glitch Red
  info: 0xbf00ff,        // Cyberpunk Purple
};

/**
 * Create a price embed
 */
export function createPriceEmbed(
  price: number,
  change24h: number,
  marketCap: number
): EmbedBuilder {
  const arrow = change24h >= 0 ? '📈' : '📉';
  return new EmbedBuilder()
    .setColor(change24h >= 0 ? COLORS.success : COLORS.error)
    .setTitle('💰 DSHIT Price Update')
    .setFields(
      { name: 'Price', value: `$${price.toFixed(6)}`, inline: true },
      { name: '24h Change', value: `${arrow} ${Math.abs(change24h).toFixed(2)}%`, inline: true },
      { name: 'Market Cap', value: `$${marketCap.toLocaleString()}`, inline: true }
    )
    .setTimestamp()
    .setFooter({ text: 'dshit.xyz' });
}

/**
 * Create a proposal embed
 */
export function createProposalEmbed(
  title: string,
  proposalId: string,
  votesFor: number,
  votesAgainst: number,
  deadline: Date
): EmbedBuilder {
  const total = votesFor + votesAgainst;
  const percentFor = total > 0 ? ((votesFor / total) * 100).toFixed(1) : '0';

  return new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(`🗳️ ${title}`)
    .setFields(
      { name: 'Proposal ID', value: `\`${proposalId}\``, inline: false },
      { name: 'For', value: `${votesFor} (${percentFor}%)`, inline: true },
      { name: 'Against', value: `${votesAgainst} (${(100 - parseFloat(percentFor)).toFixed(1)}%)`, inline: true },
      { name: 'Deadline', value: `<t:${Math.floor(deadline.getTime() / 1000)}:R>`, inline: false }
    )
    .setTimestamp()
    .setFooter({ text: 'dshit.xyz Governance' });
}

/**
 * Create a leaderboard embed
 */
export function createLeaderboardEmbed(
  users: Array<{ rank: number; name: string; score: number }>,
  title: string
): EmbedBuilder {
  const fields = users.map((u) => ({
    name: `${u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : `#${u.rank}`} ${u.name}`,
    value: `${u.score.toLocaleString()} points`,
    inline: false,
  }));

  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`🏆 ${title}`)
    .setFields(fields)
    .setTimestamp()
    .setFooter({ text: 'dshit.xyz Leaderboard' });
}

/**
 * Create an order embed
 */
export function createOrderEmbed(
  orderId: string,
  status: string,
  total: number
): EmbedBuilder {
  const statusColor =
    status === 'delivered' ? COLORS.success :
    status === 'shipped' ? COLORS.info :
    status === 'pending' ? COLORS.primary :
    COLORS.error;

  return new EmbedBuilder()
    .setColor(statusColor)
    .setTitle('📦 Order Update')
    .setFields(
      { name: 'Order ID', value: `\`${orderId}\``, inline: true },
      { name: 'Status', value: status.toUpperCase(), inline: true },
      { name: 'Total', value: `${total} DSHIT`, inline: true }
    )
    .setTimestamp()
    .setFooter({ text: 'dshit.xyz Commerce' });
}

/**
 * Create an error embed
 */
export function createErrorEmbed(message: string, details?: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(COLORS.error)
    .setTitle('❌ Error')
    .setDescription(message);

  if (details) {
    embed.addFields({ name: 'Details', value: `\`\`\`${details}\`\`\`` });
  }

  return embed.setTimestamp().setFooter({ text: 'dshit.xyz' });
}
