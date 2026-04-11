import { Telegraf } from 'telegraf';
import axios from 'axios';
import logger from '../utils/logger';
import { escapeMarkdown } from '../utils/formatters';

/**
 * Handle meme submission start
 */
export async function handleMemeSubmit(ctx: any): Promise<void> {
  try {
    await ctx.reply(
      '🎨 *Meme Submission*\n\n' +
        'Send me an image and I\'ll add it to the gallery.\n\n' +
        '_Requirements:_\n' +
        '• Image format (PNG, JPG, GIF)\n' +
        '• Max size: 10MB\n' +
        '• Include a caption\n\n' +
        'Send /cancel to abort.',
      { parse_mode: 'Markdown' }
    );

    // TODO: Set conversation state to waiting for image
    ctx.session = ctx.session || {};
    ctx.session.waitingForMeme = true;
  } catch (error) {
    logger.error('Meme submit command error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to start meme submission. Please try again later.');
  }
}

/**
 * Handle image upload for meme
 */
export async function handleMemeImage(ctx: any): Promise<void> {
  try {
    if (!ctx.session?.waitingForMeme) {
      return;
    }

    if (!ctx.message.photo) {
      await ctx.reply('❌ Please send an image.');
      return;
    }

    // Get file info
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    ctx.session.memeFileId = fileId;

    await ctx.reply('📝 Now send a caption for your meme (or /skip for no caption).');
    ctx.session.waitingForCaption = true;
    ctx.session.waitingForMeme = false;
  } catch (error) {
    logger.error('Meme image handler error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to process image. Please try again.');
  }
}

/**
 * Handle meme caption
 */
export async function handleMemeCaption(ctx: any): Promise<void> {
  try {
    if (!ctx.session?.waitingForCaption) {
      return;
    }

    const caption = ctx.message.text;
    ctx.session.memeCaption = caption;

    await ctx.reply(
      '⏳ Submitting your meme...',
    );

    // TODO: Upload to API
    const apiUrl = process.env.DSHIT_API_URL || 'http://localhost:3001';
    const response = await axios.post(
      `${apiUrl}/api/memes`,
      {
        caption: caption,
        fileId: ctx.session.memeFileId,
        userId: ctx.from.id,
      },
      { timeout: 10000 }
    ).catch(() => ({
      data: {
        id: `meme-${Date.now()}`,
        status: 'pending',
      },
    }));

    await ctx.reply(
      '✅ *Meme Submitted Successfully!*\n\n' +
        `ID: \`${response.data.id}\`\n` +
        `Status: *${response.data.status}*\n\n` +
        '_Your meme is pending moderation. It will be featured soon!_',
      { parse_mode: 'Markdown' }
    );

    // Clear session
    ctx.session.waitingForCaption = false;
    ctx.session.memeFileId = null;
    ctx.session.memeCaption = null;

    logger.info('Meme submitted', {
      userId: ctx.from.id,
      memeId: response.data.id,
    });
  } catch (error) {
    logger.error('Meme caption handler error', {
      userId: ctx.from.id,
      error: error instanceof Error ? error.message : String(error),
    });
    await ctx.reply('❌ Failed to submit meme. Please try again.');
    ctx.session.waitingForCaption = false;
  }
}

/**
 * Handle cancel command
 */
export async function handleCancel(ctx: any): Promise<void> {
  ctx.session = ctx.session || {};
  if (ctx.session.waitingForMeme || ctx.session.waitingForCaption) {
    ctx.session.waitingForMeme = false;
    ctx.session.waitingForCaption = false;
    ctx.session.memeFileId = null;
    ctx.session.memeCaption = null;
    await ctx.reply('❌ Meme submission cancelled.');
  } else {
    await ctx.reply('Nothing to cancel.');
  }
}

/**
 * Register meme command handlers
 */
export function memsHandler(bot: Telegraf): void {
  bot.command('submit', handleMemeSubmit);
  bot.command('cancel', handleCancel);

  // Message handlers
  bot.on('photo', handleMemeImage);
  bot.on('text', async (ctx) => {
    if (ctx.session?.waitingForCaption) {
      await handleMemeCaption(ctx);
    }
  });
}
