# 🤖 Telegram Bot Setup Guide

**dshit.xyz Telegram Bot** - Community engagement, price alerts, and platform updates.

---

## 📋 Overview

The Telegram bot enables community members to:
- 📊 Get real-time DSHIT token prices
- 📈 View platform statistics
- 🏆 Check creator leaderboards
- 🔔 Set custom price alerts
- 🎨 Access meme creator links
- 📦 Browse product catalog
- 📊 View personal dashboard
- 🎨 Explore community galleries

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for development)
- Telegram account
- DSHIT Bot API Token (from Telegram BotFather)

### Installation (Development)

```bash
# 1. Navigate to telegram bot directory
cd apps/bots/telegram

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your bot token

# 4. Start the bot
npm run dev
```

### Environment Setup

Create `.env` file:

```env
# Required: Telegram Bot Token from BotFather
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Optional: API base URL (defaults to http://localhost:3001)
API_BASE_URL=http://localhost:3001

# Optional: Web URL for links (defaults to https://dshitxyz.vercel.app)
DSHIT_WEB_URL=https://dshitxyz.vercel.app
```

---

## 🤖 Creating a Telegram Bot

### Step 1: Open BotFather

1. Open Telegram and search for **@BotFather**
2. Start a conversation with BotFather
3. Type `/newbot` to create a new bot

### Step 2: Configure Bot

BotFather will ask for:
- **Bot name:** `dshit.xyz Bot` (display name)
- **Bot username:** `dshitxyz_bot` (must be unique, ends with `_bot`)

### Step 3: Get API Token

BotFather will provide a token like:
```
123456789:ABCDefGhiJklMnoPqrStUvWxYz123456789
```

Copy this token to your `.env` file as `TELEGRAM_BOT_TOKEN`.

### Step 4: Configure Commands

In BotFather, send:
```
/setcommands
```

Select your bot, then send this command list:

```
price - Get DSHIT token price
stats - Platform statistics
leaderboard - Top creators
meme - Create a meme
shop - Browse products
dashboard - Your dashboard
gallery - Community memes
set_alert - Set price alert
alerts - View your alerts
remove_alert - Remove alert
help - Show help message
```

### Step 5: Set Description

Send to BotFather:
```
/setdescription
```

Enter:
```
🚀 dshit.xyz Community Bot

Get real-time token prices, platform stats, create memes, and manage price alerts!

Commands: /price /stats /leaderboard /meme /shop /set_alert /help
```

---

## 📖 Command Reference

### Information Commands

#### `/price`
Get current DSHIT token price and market data.

**Response:**
- Current price
- Market cap
- 24h trading volume
- Price change (24h and 7d)
- Holder count
- Token supply info
- Links to trading platforms

#### `/stats`
View platform statistics.

**Response:**
- Total memes created
- Active creators
- Total votes
- Average votes per meme
- Memes created today
- Network info
- Smart contract address

#### `/leaderboard`
Display top 5 meme creators.

**Response:**
- Creator rankings by votes
- Meme count per creator
- Creator earnings
- Medal emojis (🥇 🥈 🥉)
- Link to full gallery

### Action Commands

#### `/meme`
Get link to meme creator web app.

**Response:**
- Direct link to meme creator
- Feature list
- Available templates

#### `/shop`
Get link to product shop.

**Response:**
- Direct link to shop
- Feature list
- Wallet integration info

#### `/dashboard`
Get link to personal dashboard.

**Response:**
- Direct link to user dashboard
- Profile, balance, orders, earnings

#### `/gallery`
Get link to community meme gallery.

**Response:**
- Direct link to gallery
- Browsing features
- Voting and sharing info

### Alert Commands

#### `/set_alert <price>`
Create a price alert for DSHIT token.

**Usage:**
```
/set_alert 0.50
/set_alert 1.25
```

**Response:**
- Confirmation with alert ID
- Target price
- Instructions to view alerts

**Validation:**
- Price must be a valid number
- Price must be greater than 0
- Price cannot exceed $1,000,000

#### `/alerts`
View all your active price alerts.

**Response:**
- List of all alerts
- Alert status (Active/Triggered)
- Price targets
- Creation dates
- Alert IDs for removal

**Example:**
```
🔔 Your Price Alerts (2 active)

1. Alert alert_1
   Price: $0.50
   Status: ⏳ Active
   Created: 3/31/2026
```

#### `/remove_alert <id>`
Remove a specific alert.

**Usage:**
```
/remove_alert alert_1
```

**Response:**
- Confirmation of removal
- Alert ID removed

### Support Commands

#### `/start`
Welcome message with command overview.

#### `/help`
Display all available commands and usage.

#### `/feedback`
Submit feedback to the team (coming soon).

---

## ⚙️ Configuration

### API Integration

The bot fetches data from:

| Endpoint | Purpose | Command(s) |
|----------|---------|-----------|
| `/api/public/stats` | Token price & platform stats | `/price`, `/stats` |
| `/api/public/leaderboard` | Creator rankings | `/leaderboard` |
| `/api/public/memes` | Meme gallery | `/gallery` |

**Default Base URL:** `http://localhost:3001`

To change, set `API_BASE_URL` in `.env`:

```env
API_BASE_URL=https://api.dshit.xyz
```

### Web Links

Bot provides links to the web app:

| Command | Link | Default URL |
|---------|------|------------|
| `/meme` | Meme Creator | `/meme-creator` |
| `/shop` | Shop | `/products` |
| `/dashboard` | Dashboard | `/dashboard` |
| `/gallery` | Gallery | `/gallery` |

**Default Base URL:** `https://dshitxyz.vercel.app`

To change, set `DSHIT_WEB_URL` in `.env`:

```env
DSHIT_WEB_URL=https://dshit.xyz
```

---

## 🧪 Testing Commands

### Test in Telegram

1. Find your bot: Search for bot username in Telegram
2. Start conversation: Click "Start" or type `/start`
3. Test commands:

```
/price
/stats
/leaderboard
/set_alert 0.50
/alerts
/help
```

### Test Locally

```bash
# Start API server
cd apps/api
npm run dev

# In another terminal, start Telegram bot
cd apps/bots/telegram
npm run dev

# Look for logs:
# ✅ [timestamp] [INFO] 🚀 Telegram bot started successfully
```

---

## 🐛 Troubleshooting

### Bot doesn't start

**Error:** `TELEGRAM_BOT_TOKEN not set in environment`

**Solution:**
1. Check `.env` file exists
2. Verify `TELEGRAM_BOT_TOKEN` is set
3. Token should not have quotes: `TOKEN=123:ABC` not `TOKEN="123:ABC"`

### Commands not working

**Error:** Commands not showing up in Telegram

**Solution:**
1. Re-run `/setcommands` in BotFather
2. Bot may need restart: Stop and restart the bot
3. Check bot permissions in BotFather

### Price alerts not working

**Error:** Cannot set alert or view alerts

**Solution:**
1. Use correct format: `/set_alert 0.50`
2. Price must be a valid number
3. Check console logs for errors

### API errors

**Error:** ❌ Error fetching data

**Solution:**
1. Verify API server is running: `npm run dev` in `apps/api/`
2. Check `API_BASE_URL` in `.env`
3. Ensure API is accessible from bot server
4. Check API logs for errors

### Connection timeout

**Error:** Request timed out

**Solution:**
1. Increase timeout (currently 5000ms)
2. Check network connectivity
3. Verify API server is responding
4. Check firewall/proxy settings

---

## 📦 Deployment

### Deploy to Production

#### Option 1: Heroku

```bash
# 1. Create Heroku app
heroku create dshitxyz-telegram-bot

# 2. Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set API_BASE_URL=https://api.dshit.xyz

# 3. Deploy
git push heroku main
```

#### Option 2: Docker

```bash
# Build image
docker build -t dshit-telegram-bot .

# Run container
docker run -e TELEGRAM_BOT_TOKEN=your_token \
           -e API_BASE_URL=https://api.dshit.xyz \
           dshit-telegram-bot
```

#### Option 3: Replit

1. Create new Replit project
2. Connect GitHub repo
3. Set environment variables in Replit Secrets
4. Run `npm run dev`

### Webhook vs Polling

The bot currently uses **polling** (long polling) for simplicity.

For production, consider **webhook** mode:

```typescript
// webhook setup (not currently implemented)
bot.launch({
  webhook: {
    domain: 'https://your-domain.com',
    port: process.env.PORT || 3000
  }
})
```

---

## 📊 Monitoring

### Logging

The bot logs all activities to console:

```
[2026-03-31T10:30:45.123Z] [INFO] Command /price executed by user 123456789
[2026-03-31T10:30:46.456Z] [ERROR] API request failed to stats
```

### Performance

Expected response times:
- `/price`: ~500-1000ms (depends on API)
- `/stats`: ~500-1000ms
- `/leaderboard`: ~800-1500ms
- `/set_alert`: <100ms (local operation)
- `/alerts`: <100ms (local operation)

### Error Handling

All commands have error handling:
- API failures: User-friendly error message
- Input validation: Clear validation errors
- Bot errors: Logged to console, user notified

---

## 🔐 Security

### Token Management

- ✅ Store token in `.env` (not in code)
- ✅ Use environment variables
- ✅ Never commit `.env` to git
- ✅ Rotate token if compromised

### Input Validation

- ✅ All user input validated
- ✅ Price alerts must be valid numbers
- ✅ Alert IDs validated before removal
- ✅ Command arguments checked for length

### API Security

- ✅ API Base URL configurable
- ✅ HTTPS recommended for production
- ✅ API should have CORS configured
- ✅ Rate limiting recommended

---

## 🚀 Future Enhancements

### Coming Soon

- [ ] Meme submission from Telegram
- [ ] Order notifications
- [ ] Governance vote reminders
- [ ] User preferences/settings
- [ ] Multi-language support
- [ ] Rich media (stickers, photos)
- [ ] Inline keyboard menus
- [ ] Callback queries

### Planned Features

1. **Meme Submissions**
   - Upload meme directly from Telegram
   - Automatic posting to gallery

2. **Notifications**
   - Order updates via Telegram
   - Governance reminders
   - New feature announcements

3. **Governance Integration**
   - Vote on proposals
   - View voting results
   - Track voting power

4. **Analytics**
   - Track command usage
   - User engagement metrics
   - Popular commands

---

## 📞 Support

### Getting Help

1. Check this documentation
2. Review bot logs for errors
3. Check API server logs
4. Test endpoints manually: `curl http://localhost:3001/api/public/stats`

### Reporting Issues

Report issues in Discord or create GitHub issue:
- Include error message
- Include bot logs
- Include steps to reproduce
- Include environment details

---

## 📝 Additional Resources

- [Telegraf.js Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Reference](https://core.telegram.org/bots#botfather)
- [dshit.xyz API Docs](./PUBLIC_API.md)

---

## 🎯 Summary

The Telegram bot provides:
- ✅ Real-time token prices
- ✅ Platform statistics
- ✅ Creator leaderboards
- ✅ Custom price alerts
- ✅ Direct web app links
- ✅ Community engagement
- ✅ 24/7 availability
- ✅ Zero transaction fees

**Status:** 🟢 Production Ready

---

*Last Updated: 2026-03-31*
*Version: 1.0.0*
