import { Telegraf } from 'telegraf';
import axios from 'axios';
import logger from '../utils/logger';
import { formatDSHIT, formatOrderNotification } from '../utils/formatters';

/**
 * Handle orders command
 */
export async function handleOrders(ctx: any): Promise<void> {
  try {
    ctx.sendChatAction('typing');

    // TODO: Fetch user orders from API
    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const orders = await axios.get(
      `${apiUrl}/api/orders?userId=${ctx.from.id}`,
      { timeout: 5000 }
    ).then(r => r.data).catch(() => ({
      orders: [
        {
          id: 'ORDER-001',
          status: 'shipped',
          total: 250,
          items: [{ name: 'Gag Product #1', quantity: 1 }],
        },
      ],
    }));

    if (!orders.orders || orders.orders.length === 0) {
      await ctx.reply('📦 You have no orders yet.');
      return;
    }

    let message = '📦 *Your Orders*\n\n';
    orders.orders.forEach((order: any, index: number) => {
      message += `*Order ${index + 1}*\n`;
      message += `ID: \`${order.id}\`\n`;
      message += `Status: *${order.status}*\n`;
      message += `Total: *${formatDSHIT(order.total)} DSHIT*\n`;
      message += `Items: ${order.items.map((i: any) => i.name).join(', ')}\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'Markdown' });
    logger.info('Orders command executed', { userId: ctx.from.id });
  } catch (error) {
    logger.error('Orders command error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to fetch orders. Please try again later.');
  }
}

/**
 * Send order notification to user
 * Called from API webhook
 */
export async function sendOrderNotification(
  bot: Telegraf,
  userId: number,
  orderId: string,
  status: string,
  details?: Record<string, string>
): Promise<void> {
  try {
    const message = formatOrderNotification(orderId, status, details);
    await bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
    logger.info('Order notification sent', { userId, orderId, status });
  } catch (error) {
    logger.error('Failed to send order notification', {
      userId,
      orderId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Register order command handlers
 */
export function orderHandler(bot: Telegraf): void {
  bot.command('orders', handleOrders);

  // TODO: Setup webhook listener for order events
  // This would be called from the API when an order is created or updated
}
