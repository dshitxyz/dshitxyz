# DSHIT Bot Infrastructure

This directory contains official bots for the dshit.xyz platform:

- **Telegram Bot** - Price alerts, meme submissions, governance updates
- **Discord Bot** - Community verification, contests, governance voting

---

## 🤖 Telegram Bot

**Location:** `./telegram/`

### Features

- 💰 **Price Alerts** - Get real-time $DSHIT price updates
- 🎨 **Meme Submissions** - Submit memes directly to the platform
- 🏆 **Contest Notifications** - Weekly contest updates and leaderboards
- 🏛️ **Governance Reminders** - Proposal notifications and voting status
- 📊 **Trading Links** - Direct links to DEXs and exchanges

### Commands

```
/start           - Welcome and help
/help            - Full command list
/price           - Current $DSHIT price
/alerts          - Set up price alerts
/meme            - Submit a meme
/contest         - View contest info
/gov             - Governance status
/voting <0x...>  - Your voting power
```

### Setup

```bash
cd telegram
pnpm install
```

**Environment Variables:**
```bash
TELEGRAM_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=https://yourdomain.com/webhook/telegram
DSHIT_API_URL=http://localhost:3001
LOG_LEVEL=info
```

**Run Locally:**
```bash
pnpm dev
```

**Deploy to Production:**
```bash
pnpm build
pnpm start
```

### Architecture

```
telegram/
├── src/
│   ├── index.ts              # Main bot entry point
│   ├── types.ts              # TypeScript types
│   ├── handlers/
│   │   ├── price.ts          # Price alerts handler
│   │   ├── memes.ts          # Meme submission handler
│   │   └── governance.ts     # Governance handler
│   └── lib/
│       ├── dshit-api.ts      # API client
│       └── logger.ts         # Logging utility
└── package.json
```

### Development

```bash
# Watch mode (auto-reload)
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint
```

---

## 🎮 Discord Bot

**Location:** `./discord/`

### Features

- ✅ **Wallet Verification** - Token-gated role assignment
- 🏆 **Contest Announcements** - Weekly contest updates
- 🗳️ **Governance Integration** - Proposal notifications and voting
- 👥 **Role Management** - Auto-assign roles based on $DSHIT holdings
- 📢 **Announcements** - Official platform updates

### Commands

**Slash Commands:**

```
/verify <wallet>              - Verify your wallet address
/contests current             - Current contest info
/contests leaderboard         - Top meme creators
/govote active               - Active governance proposals
/govote voting-power <0x...> - Your voting power
```

### Setup

```bash
cd discord
pnpm install
```

**Environment Variables:**
```bash
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here
DSHIT_API_URL=http://localhost:3001
LOG_LEVEL=info
```

**Run Locally:**
```bash
pnpm dev
```

**Deploy to Production:**
```bash
pnpm build
pnpm start
```

### Architecture

```
discord/
├── src/
│   ├── index.ts              # Main bot entry point
│   ├── types.ts              # TypeScript types
│   ├── commands/
│   │   ├── verify.ts         # Wallet verification command
│   │   ├── contests.ts       # Contest commands
│   │   └── govote.ts         # Governance voting command
│   └── lib/
│       ├── client.ts         # Discord client setup
│       └── token-gate.ts     # Token verification logic
└── package.json
```

### Development

```bash
# Watch mode (auto-reload)
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint
```

---

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
# Dockerfile for Telegram Bot
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
CMD ["pnpm", "start"]
```

### Environment Configuration

Create `.env` file in each bot directory:

**telegram/.env:**
```
TELEGRAM_TOKEN=<your-token>
DSHIT_API_URL=http://api:3001
DSHIT_API_KEY=<your-api-key>
LOG_LEVEL=info
```

**discord/.env:**
```
DISCORD_TOKEN=<your-token>
DISCORD_CLIENT_ID=<your-client-id>
DISCORD_GUILD_ID=<your-guild-id>
DSHIT_API_URL=http://api:3001
DSHIT_API_KEY=<your-api-key>
LOG_LEVEL=info
```

### Docker Compose

```yaml
version: '3.8'

services:
  telegram-bot:
    build: ./telegram
    env_file: ./telegram/.env
    restart: unless-stopped
    
  discord-bot:
    build: ./discord
    env_file: ./discord/.env
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## 🔌 API Integration

Both bots use the dshit.xyz Public API:

### Endpoints Used

**Token Stats:**
```
GET /api/public/stats
GET /api/public/token-stats
```

**Memes:**
```
GET /api/public/memes
POST /api/memes (authenticated)
```

**Governance:**
```
GET /api/public/governance-proposals
GET /api/public/governance-status/:address
POST /api/governance/vote (authenticated)
```

**Leaderboards:**
```
GET /api/public/leaderboard/creators
GET /api/public/leaderboard/memes
```

For full API documentation, see: [`docs/API.md`](../docs/API.md)

---

## 🧪 Testing

### Telegram Bot Testing

Use BotFather to create a test bot:
1. Message @BotFather on Telegram
2. `/newbot` - Create new bot
3. Set token in `.env`
4. Run `pnpm dev`

### Discord Bot Testing

1. Create Discord server for testing
2. Create bot application at Discord Developer Portal
3. Add bot to test server
4. Set tokens in `.env`
5. Run `pnpm dev`

---

## 📊 Monitoring

Both bots log to stdout with Winston logger. Logs include:
- Request/response information
- Error tracking with stack traces
- User interaction logging
- API call metrics

### Log Levels

```
ERROR    - Critical errors only
WARN     - Warnings and errors
INFO     - Info, warnings, errors (default)
DEBUG    - Detailed debug information
```

Set via `LOG_LEVEL` environment variable.

---

## 🔒 Security

### Best Practices

1. **Never commit tokens** - Use `.env` files
2. **Validate user input** - Check wallet addresses, message content
3. **Rate limiting** - Implemented in handlers
4. **Error handling** - Don't expose internal errors to users
5. **API authentication** - Use API keys for authenticated endpoints

### Wallet Verification

Discord bot implements wallet verification:
1. User provides wallet address
2. Bot generates signing message
3. User signs with their wallet
4. Bot verifies signature on-chain
5. Roles assigned based on $DSHIT balance

---

## 📚 Resources

- **Telegram Bot API:** https://core.telegram.org/bots
- **Telegraf Library:** https://telegraf.js.org
- **Discord.js Docs:** https://discord.js.org
- **dshit.xyz API:** `docs/API.md`

---

## 🤝 Contributing

Contributions welcome! Please:
1. Follow TypeScript conventions
2. Add tests for new features
3. Document new commands/handlers
4. Update this README if needed
5. Submit PR with clear description

---

## 📝 License

MIT License - See LICENSE in root directory

---

**Status:** ✅ Phase 5 Implementation  
**Last Updated:** 2026-04-01  
**Maintainer:** @dshitxyz
