# 🤖 Telegram Bot - dshit.xyz

Telegram bot for the dshit.xyz platform with price alerts, meme submissions, order tracking, and governance participation.

## Features

- **💰 Price Alerts** - Real-time DSHIT price tracking and notifications
- **🎨 Meme Submissions** - Submit memes directly from Telegram
- **📦 Order Notifications** - Track your orders and delivery status
- **🗳️ Governance** - View proposals and vote on DAO decisions
- **👨‍💼 Admin Tools** - Statistics, user management, and broadcasting

## Setup

### Prerequisites
- Node.js 18+
- pnpm 8+
- Telegram Bot Token from [@BotFather](https://t.me/botfather)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Environment Variables

```env
# Telegram
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_ADMIN_ID=YOUR_USER_ID

# API
DSHIT_API_URL=http://localhost:3001
DSHIT_PRICE_API=https://api.example.com/price

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dshit

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

## Development

```bash
# Start bot in development mode (with hot reload)
pnpm dev

# Run tests
pnpm test

# Check types
pnpm type-check

# Lint code
pnpm lint
```

## Production Deployment

### Local Polling (Development)
```bash
pnpm build
pnpm start
```

### Webhook (Production)
```env
TELEGRAM_WEBHOOK_URL=https://your-domain.com
TELEGRAM_WEBHOOK_PORT=3000
```

Then deploy to your server:
```bash
pnpm build
pnpm start
```

## Commands

### User Commands
- `/start` - Start the bot and see available commands
- `/help` - Show all available commands
- `/price` - Get current DSHIT price and market data
- `/subscribe` - Enable price and order notifications
- `/unsubscribe` - Disable notifications
- `/submit` - Submit a meme to the gallery
- `/orders` - Check your order status
- `/proposals` - View active DAO proposals
- `/vote` - Vote on a proposal

### Admin Commands (Admin only)
- `/stats` - View bot statistics
- `/users` - View user statistics
- `/broadcast` - Send a message to all users

## API Integration

The bot integrates with the dshit.xyz API for:

- **Prices:** `GET /api/price`
- **Memes:** `POST /api/memes`, `GET /api/memes`
- **Orders:** `GET /api/orders`, `POST /api/orders`
- **Governance:** `GET /api/governance/proposals`

### Webhooks

The bot can receive webhooks from the API for real-time updates:

- Order status changes
- Governance proposal deadlines
- Price alerts
- New meme approvals

## Architecture

```
src/
├── handlers/           # Command handlers
│   ├── price.ts       # Price alerts & subscriptions
│   ├── memes.ts       # Meme submissions
│   ├── orders.ts      # Order notifications
│   ├── governance.ts  # DAO proposals & voting
│   └── admin.ts       # Admin commands
├── services/          # Business logic (DB, APIs)
├── utils/             # Helpers & formatters
└── types/             # TypeScript definitions
```

## Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test --watch
```

## Error Handling

The bot includes robust error handling:
- API timeouts with exponential backoff
- Graceful degradation for missing services
- User-friendly error messages
- Comprehensive logging
- Admin notifications for critical errors

## Monitoring

The bot logs to:
- Console (development)
- `error.log` (errors only)
- `combined.log` (all logs)

View logs:
```bash
tail -f error.log
tail -f combined.log
```

## Troubleshooting

### Bot not responding
1. Check `TELEGRAM_BOT_TOKEN` is correct
2. Verify bot is started: `pnpm dev`
3. Check logs: `tail -f combined.log`

### Price API errors
1. Verify `DSHIT_API_URL` is accessible
2. Check API status
3. Review API response in logs

### Order notifications not working
1. Ensure API is running
2. Check webhook configuration
3. Verify user ID in database

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Check types: `pnpm type-check`
5. Lint: `pnpm lint`
6. Submit PR

## License

MIT
