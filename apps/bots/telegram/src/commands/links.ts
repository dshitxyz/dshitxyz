/**
 * Links Commands
 * /meme, /shop, /dashboard
 */

import { Context } from 'telegraf';
import { logCommandExecution } from '../utils/errorHandler';

const DSHIT_WEB_URL = process.env.DSHIT_WEB_URL || 'https://dshitxyz.vercel.app';

export async function memeCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('meme', ctx.from?.id);

    await ctx.replyWithMarkdown(
      `🎨 **Create a Meme**

Use our web app to create and share memes with the community!

[Open Meme Creator](${DSHIT_WEB_URL}/meme-creator)

Features:
• Select from templates
• Add custom text
• Upload custom images
• Download as PNG/GIF
• Share on social media`
    );
  } catch (error) {
    await ctx.reply('❌ Error displaying meme creator link. Please try again.');
  }
}

export async function shopCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('shop', ctx.from?.id);

    await ctx.replyWithMarkdown(
      `🛍 **Shop Products**

Browse and purchase products with DSHIT tokens!

[Open Shop](${DSHIT_WEB_URL}/products)

Features:
• Browse product catalog
• Add to cart
• Checkout with DSHIT
• Track orders`
    );
  } catch (error) {
    await ctx.reply('❌ Error displaying shop link. Please try again.');
  }
}

export async function dashboardCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('dashboard', ctx.from?.id);

    await ctx.replyWithMarkdown(
      `📊 **Your Dashboard**

Track your activity, orders, and earnings.

[Open Dashboard](${DSHIT_WEB_URL}/dashboard)

View:
• Your profile
• DSHIT balance
• Order history
• Created memes
• Earnings`
    );
  } catch (error) {
    await ctx.reply('❌ Error displaying dashboard link. Please try again.');
  }
}

export async function galleryCommand(ctx: Context): Promise<void> {
  try {
    logCommandExecution('gallery', ctx.from?.id);

    await ctx.replyWithMarkdown(
      `🎨 **Community Meme Gallery**

Browse memes from the community, vote and share your favorites!

[Open Gallery](${DSHIT_WEB_URL}/gallery)

Features:
• Browse trending memes
• Vote on memes
• Share your favorites
• View creator profiles
• Track top memes`
    );
  } catch (error) {
    await ctx.reply('❌ Error displaying gallery link. Please try again.');
  }
}
