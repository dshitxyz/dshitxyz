# DSHIT Telegram Bot

Official Telegram bot for dshit.xyz - Get price alerts, submit memes, and stay updated on governance.

## Quick Start

```bash
pnpm install
pnpm dev
```

See parent directory [`../README.md`](../README.md) for full setup and deployment instructions.

## Commands

- `/price` - Current $DSHIT price
- `/alerts` - Set up price alerts
- `/meme` - Submit meme
- `/contest` - View weekly contest
- `/gov` - Governance status
- `/voting <0x...>` - Your voting power

## Features

✅ Real-time price updates  
✅ Meme submission  
✅ Contest notifications  
✅ Governance voting status  
✅ Mobile-friendly  
✅ No auth required

## Environment

```
TELEGRAM_TOKEN=<bot-token>
DSHIT_API_URL=http://localhost:3001
DSHIT_API_KEY=<optional>
```

## Architecture

See [`./src`](./src) for implementation details.
