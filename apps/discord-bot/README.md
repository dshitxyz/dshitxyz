# 🤖 Discord Bot - dshit.xyz

Discord bot for community integration, governance voting, leaderboards, and meme contests.

## Features

- **💰 Price Updates** - Real-time DSHIT price in Discord
- **🗳️ Governance** - Vote on DAO proposals directly in Discord
- **🏆 Leaderboards** - Community reputation and activity rankings
- **👥 Profiles** - View member stats and contributions
- **🎪 Events** - Meme contests, raids, and community events
- **📢 Announcements** - Important updates and notifications

## Setup

### Prerequisites
- Node.js 18+
- pnpm 8+
- Discord bot token from [Developer Portal](https://discord.com/developers/applications)
- Server admin access to invite bot

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Configuration

```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_CLIENT_ID
DISCORD_GUILD_ID=YOUR_GUILD_ID
DSHIT_API_URL=http://localhost:3001
LOG_LEVEL=info
NODE_ENV=development
```

### Invite Bot to Server

1. Go to [Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 → URL Generator
4. Select scopes: `bot`
5. Select permissions:
   - Send Messages
   - Embed Links
   - Read Message History
   - Use Application Commands
6. Copy the generated URL and open in browser

## Development

```bash
# Start bot in development mode
pnpm dev

# Run tests
pnpm test

# Check types
pnpm type-check

# Lint code
pnpm lint
```

## Slash Commands

### User Commands
- `/price` - Get DSHIT price & market data
- `/proposals` - View active governance proposals
- `/vote <proposal_id> <choice>` - Vote on a proposal
- `/leaderboard [category]` - View community rankings
- `/profile [user]` - View member profile
- `/events` - Upcoming community events
- `/rules` - Community guidelines
- `/support` - Get help or report issues

### Categories
- **Reputation** - Most respected members
- **Voting Power** - Top governance participants
- **Meme Creators** - Top meme submissions
- **Traders** - Most active traders

## Architecture

```
src/
├── commands/           # Slash command definitions
├── handlers/           # Command logic (coming)
├── services/           # Business logic (coming)
├── utils/
│   ├── logger.ts       # Winston logging
│   └── embeds.ts       # Discord embed builders
├── types/              # TypeScript definitions
└── index.ts            # Bot entry point
```

## Discord Embeds

All responses use rich Discord embeds with dshit.xyz branding:
- **Shit Yellow** (#F4D03F) - Primary
- **Poop Brown** (#8B4513) - Secondary
- **Toxic Green** (#39FF14) - Success
- **Glitch Red** (#FF0000) - Errors
- **Cyberpunk Purple** (#BF00FF) - Info

## Integration with dshit.xyz API

The bot integrates with:
- `/api/price` - Token pricing
- `/api/governance/proposals` - Governance data
- `/api/users/profile` - User profiles
- `/api/events` - Community events
- `/api/leaderboard` - Rankings

## Features Coming Soon

- Token-gated channels
- Role-based permissions
- Meme submission voting
- Streaming integration (Twitch raids)
- Economy system (DSHIT tips)
- Custom moderation
- Analytics dashboard

## Troubleshooting

### Bot not showing up
- Verify `DISCORD_TOKEN` is correct
- Check bot permissions on server
- Ensure bot is invited with correct scopes

### Slash commands not appearing
1. Check bot has `applications.commands` scope
2. Run `pnpm run register-commands`
3. Restart bot
4. Restart Discord client

### API errors
1. Verify `DSHIT_API_URL` is accessible
2. Check API is running
3. Review logs: `tail -f combined.log`

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests: `pnpm test`
4. Check types: `pnpm type-check`
5. Lint: `pnpm lint`
6. Submit PR

## License

MIT
