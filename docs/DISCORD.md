# 🤖 Discord Bot Setup Guide

**dshit.xyz** Discord bot enables community engagement with token price updates, meme gallery browsing, platform statistics, and holder verification.

---

## 📋 Features

### Slash Commands

#### `/price` - Token Price Updates
Shows current DSHIT price with 24h change, market cap, and volume.

**Output:**
```
💩 DSHIT Token Price
Current Price: $0.00000050
24h Change: 📈 +12.34%
Market Cap: $500K
24h Volume: $25K
```

#### `/memes [sort]` - Meme Gallery Browser
Browse top memes from the community gallery.

**Options:**
- `sort` (optional): `trending`, `newest`, or `voted`

**Output:**
Shows top 5 memes with vote counts and link to full gallery.

#### `/stats` - Platform Statistics
Display real-time platform metrics including holder count, meme count, orders, and supply info.

**Output:**
```
📊 Platform Statistics
Total Holders: 2,500
Total Memes: 15,000
Total Orders: 8,500
Market Cap: $500K
```

#### `/leaderboard [type]` - Creator & Holder Rankings
View top creators or holders on the platform.

**Options:**
- `type` (optional): `creators` or `holders`

**Output:**
```
🏆 Top Creators
1. anon_memegod - 245 memes
2. shit_poster - 189 memes
3. degen_lord - 156 memes
...
```

#### `/verify` - Token Holder Verification
Instructions for verifying token holdings and getting Discord roles.

**Steps:**
1. Visit dshit.xyz and connect wallet
2. Link Discord account to your dashboard
3. Return here for automatic role assignment

**Tiers:**
- 🐻 Degen: 1,000+ DSHIT
- 🦁 Whale: 100,000+ DSHIT
- 👑 Mega: 1,000,000+ DSHIT

---

## 🚀 Setup Instructions

### 1. Create Discord Bot on Discord Developer Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "dshit.xyz"
4. Go to "Bot" section and click "Add Bot"
5. Copy the **TOKEN** - save this securely

### 2. Configure Bot Permissions

**OAuth2 Settings:**
1. Go to OAuth2 > URL Generator
2. Select scopes:
   - `bot`
3. Select permissions:
   - `Send Messages`
   - `Embed Links`
   - `Read Message History`
   - `Use Slash Commands`

4. Copy the generated URL and invite the bot to your server

### 3. Get Guild ID

1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click your server and select "Copy Server ID"

### 4. Environment Configuration

Create `.env` file in `apps/bots/discord/`:

```bash
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_server_id_here
API_BASE_URL=http://localhost:3001
ENABLE_VERIFICATION=true
LOG_LEVEL=info
```

### 5. Install Dependencies

```bash
pnpm install
```

### 6. Build & Start Bot

```bash
# Development (with hot reload)
pnpm --filter @dshit/discord-bot dev

# Production
pnpm --filter @dshit/discord-bot build
pnpm --filter @dshit/discord-bot start
```

---

## 🔧 API Integration

The bot fetches data from the public API endpoints:

- **GET** `/api/public/stats` - Platform statistics
- **GET** `/api/public/memes` - Meme gallery data
- **GET** `/api/public/leaderboard` - Creator/holder rankings
- **GET** `/api/public/health` - Service status

**Base URL:** `http://localhost:3001` (development) or `https://dshitxyz.vercel.app/api` (production)

---

## 🧪 Testing Commands

Once the bot is running and invited to your server:

```
/price
/stats
/memes trending
/leaderboard creators
/verify
```

---

## 🐛 Troubleshooting

### Bot Not Responding

1. Check environment variables are set correctly
2. Verify bot has permissions in the Discord server
3. Check logs: `docker logs discord-bot`

### Commands Not Showing

1. Ensure bot has `applications.commands` scope
2. Invite bot with correct OAuth2 permissions
3. Restart bot after inviting

### API Connection Errors

1. Verify API is running: `pnpm --filter @dshit/api dev`
2. Check `API_BASE_URL` matches actual API endpoint
3. Look at bot logs for detailed error messages

---

## 🔐 Security Notes

- Never commit `.env` file with real token
- Use Discord Developer Portal to rotate token if compromised
- Bot should only have minimal required permissions
- All user data interactions logged for audit trail

---

## 📈 Metrics & Monitoring

The bot logs:
- Command usage statistics
- API response times
- Error rates per command
- User interaction counts

Check logs:
```bash
# View recent logs
docker logs -f discord-bot

# Search for errors
docker logs discord-bot | grep ERROR
```

---

## 🚀 Production Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY apps/bots/discord ./

RUN npm install
RUN npm run build

CMD ["npm", "start"]
```

### Environment Variables (Production)

```bash
DISCORD_TOKEN=<production_token>
DISCORD_CLIENT_ID=<production_client_id>
DISCORD_GUILD_ID=<production_guild_id>
API_BASE_URL=https://dshitxyz.vercel.app/api
LOG_LEVEL=info
NODE_ENV=production
```

---

## 📞 Support

For issues or feature requests:
1. Check troubleshooting section above
2. Review bot logs for error details
3. Open issue on GitHub: [dshitxyz/issues](https://github.com/dshitxyz/dshitxyz/issues)

---

**Last Updated:** 2026-03-31
**Bot Version:** 0.1.0
**Status:** ✅ Ready for Production
