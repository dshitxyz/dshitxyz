# 🚀 dshit.xyz Public API Documentation

**Version:** 1.0.0
**Base URL:** `https://api.dshitxyz.vercel.app/api/public`
**Status:** ✅ LIVE

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Endpoints](#endpoints)
5. [Response Formats](#response-formats)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)
8. [Webhooks](#webhooks)

---

## Overview

The dshit.xyz Public API provides read-only access to:
- **Meme Gallery** - Browse and search community memes
- **Token Statistics** - Real-time $DSHIT token data
- **Leaderboards** - Top creators and token holders
- **Platform Stats** - Overall protocol metrics

All endpoints return JSON and support CORS, making them suitable for:
- Third-party integrations
- Analytics dashboards
- Community tools
- Mobile apps
- Browser extensions

---

## Authentication

**Public API endpoints require NO authentication.**

All `/api/public/*` endpoints are freely accessible from any origin.

---

## Rate Limiting

All public API endpoints are rate-limited to prevent abuse.

### Limits
- **1000 requests per hour** per IP address
- Rate limit is **reset every hour**
- Applies to all `/api/public/*` endpoints

### Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1704067200
```

### Handling Rate Limits

If you exceed the rate limit, the API will respond with HTTP 429:

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded: 1000 requests per hour",
  "retryAfter": 3600
}
```

**Recommendation:** Implement exponential backoff and cache responses when possible.

---

## Endpoints

### 1. Get Meme Gallery

Browse public memes with pagination, sorting, and filtering.

**Endpoint:** `GET /api/public/memes`

**Query Parameters:**

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | — | Page number for pagination |
| `limit` | integer | 20 | 100 | Items per page |
| `sort` | string | trending | — | Sort order: `trending`, `newest`, `votes` |

**Response:**

```json
{
  "data": [
    {
      "id": "meme-001",
      "title": "When your portfolio is down but you HODL",
      "imageUrl": "https://dshitxyz.vercel.app/meme1.png",
      "creator": "0xabc123...",
      "creatorName": "CryptoApe420",
      "votes": 1248,
      "createdAt": "2026-03-31T12:00:00Z",
      "url": "https://dshitxyz.vercel.app/gallery/meme-001"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "pages": 25
  },
  "meta": {
    "sort": "trending",
    "timestamp": "2026-03-31T12:05:00Z"
  }
}
```

**Cache:** 1 minute (`Cache-Control: public, max-age=60`)

---

### 2. Get Token Statistics

Real-time statistics about the $DSHIT token and platform metrics.

**Endpoint:** `GET /api/public/stats`

**Query Parameters:** None

**Response:**

```json
{
  "token": {
    "name": "DSHIT",
    "symbol": "DSHIT",
    "address": "0x0000000000000000000000000000000000000000",
    "decimals": 18
  },
  "price": {
    "usd": 0.0000042,
    "change24h": 12.5,
    "change7d": 47.3
  },
  "supply": {
    "total": 1000000000,
    "circulating": 891234567,
    "burned": 50000000
  },
  "market": {
    "capUsd": 4200000,
    "volume24h": 127000,
    "holders": 2847
  },
  "network": {
    "chain": "base",
    "explorer": "https://basescan.org/token/0x0000000000000000000000000000000000000000"
  },
  "timestamp": "2026-03-31T12:05:00Z"
}
```

**Cache:** 5 minutes (`Cache-Control: public, max-age=300`)

---

### 3. Get Top Creators

Leaderboard of the most active and viral meme creators.

**Endpoint:** `GET /api/public/leaderboard/creators`

**Query Parameters:**

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | integer | 10 | 100 | Number of creators to return |

**Response:**

```json
{
  "data": [
    {
      "rank": 1,
      "address": "0xabc123...",
      "name": "MemeKingSupreme",
      "memeCount": 187,
      "totalVotes": 18492,
      "earningsUsd": 12485
    },
    {
      "rank": 2,
      "address": "0xdef456...",
      "name": "CryptoArtisan",
      "memeCount": 142,
      "totalVotes": 14723,
      "earningsUsd": 9847
    }
  ],
  "total": 1847,
  "timestamp": "2026-03-31T12:05:00Z"
}
```

**Cache:** 5 minutes (`Cache-Control: public, max-age=300`)

---

### 4. Get Top Holders

Leaderboard of the largest $DSHIT token holders.

**Endpoint:** `GET /api/public/leaderboard/holders`

**Query Parameters:**

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | integer | 10 | 100 | Number of holders to return |

**Response:**

```json
{
  "data": [
    {
      "rank": 1,
      "address": "0xpqr678...",
      "name": "WhaleWallet1",
      "balance": 500000000,
      "percentage": 50.0
    },
    {
      "rank": 2,
      "address": "0xstu901...",
      "name": "WhaleWallet2",
      "balance": 200000000,
      "percentage": 20.0
    }
  ],
  "total": 2847,
  "timestamp": "2026-03-31T12:05:00Z"
}
```

**Cache:** 5 minutes (`Cache-Control: public, max-age=300`)

---

### 5. Combined Leaderboard (Shorthand)

Get leaderboard data with a single parameter.

**Endpoint:** `GET /api/public/leaderboard`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | creators | `creators` or `holders` |
| `limit` | integer | 10 | Number of entries to return |

**Response:** Same as `/creators` or `/holders` based on `type` parameter.

---

### 6. Health Check

Verify API availability and get endpoint list.

**Endpoint:** `GET /api/public/health`

**Query Parameters:** None

**Response:**

```json
{
  "status": "healthy",
  "api": "dshit.xyz",
  "version": "0.1.0",
  "network": "base-sepolia",
  "endpoints": {
    "memes": "/api/public/memes",
    "stats": "/api/public/stats",
    "leaderboard": "/api/public/leaderboard",
    "creators": "/api/public/leaderboard/creators",
    "holders": "/api/public/leaderboard/holders"
  },
  "timestamp": "2026-03-31T12:05:00Z"
}
```

**Cache:** 30 seconds (`Cache-Control: public, max-age=30`)

---

## Response Formats

### Standard Response Format

All successful responses (HTTP 200-299):

```json
{
  "data": {},           // Response payload
  "pagination": {},     // (if applicable)
  "meta": {},          // Additional metadata
  "timestamp": "ISO8601"
}
```

### Error Response Format

All error responses (HTTP 4xx, 5xx):

```json
{
  "error": "Error Type",
  "message": "Human-readable error description",
  "retryAfter": 3600  // (if applicable)
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | Success | Request succeeded |
| `400` | Bad Request | Invalid query parameter |
| `404` | Not Found | Endpoint doesn't exist |
| `429` | Rate Limited | Too many requests |
| `500` | Server Error | Internal server error |
| `503` | Service Unavailable | Maintenance or overload |

### Common Errors

**Invalid Page Parameter:**
```json
{
  "error": "Bad Request",
  "message": "Page must be greater than 0"
}
```

**Rate Limit Exceeded:**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded: 1000 requests per hour",
  "retryAfter": 3600
}
```

**Meme Not Found:**
```json
{
  "error": "Not Found",
  "message": "Meme with id 'meme-999' not found"
}
```

---

## Code Examples

### JavaScript / Node.js

**Fetch Meme Gallery:**

```javascript
const response = await fetch('https://api.dshitxyz.vercel.app/api/public/memes?page=1&limit=10');
const data = await response.json();

data.data.forEach(meme => {
  console.log(`${meme.title} by ${meme.creatorName} (${meme.votes} votes)`);
});
```

**Get Token Stats:**

```javascript
async function getTokenPrice() {
  const response = await fetch('https://api.dshitxyz.vercel.app/api/public/stats');
  const data = await response.json();
  return data.token.price.usd;
}

const price = await getTokenPrice();
console.log(`DSHIT price: $${price}`);
```

**With Caching:**

```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedStats() {
  const cached = cache.get('stats');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch('https://api.dshitxyz.vercel.app/api/public/stats');
  const data = await response.json();
  cache.set('stats', { data, timestamp: Date.now() });
  return data;
}
```

---

### Python

**Fetch Top Creators:**

```python
import requests

response = requests.get(
    'https://api.dshitxyz.vercel.app/api/public/leaderboard/creators',
    params={'limit': 5}
)

data = response.json()
for entry in data['data']:
    print(f"{entry['rank']}. {entry['name']} - {entry['memeCount']} memes, ${entry['earningsUsd']}")
```

---

### cURL

**Get All Platform Stats:**

```bash
curl -s https://api.dshitxyz.vercel.app/api/public/stats | jq '.platform'
```

**Monitor Price with Rate Limit Headers:**

```bash
curl -i https://api.dshitxyz.vercel.app/api/public/stats | grep X-RateLimit
```

---

### React/TypeScript

**Use Hook:**

```typescript
import { useEffect, useState } from 'react';

interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  creator: string;
  votes: number;
}

function useMemeGallery(page = 1) {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`/api/public/memes?page=${page}`)
      .then(r => r.json())
      .then(data => {
        setMemes(data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [page]);

  return { memes, loading, error };
}

// Usage
export default function Gallery() {
  const { memes } = useMemeGallery(1);
  return (
    <div>
      {memes.map(meme => (
        <div key={meme.id}>
          <h3>{meme.title}</h3>
          <img src={meme.imageUrl} alt={meme.title} />
        </div>
      ))}
    </div>
  );
}
```

---

### 7. Get Governance Proposals

Get active governance proposals and voting status.

**Endpoint:** `GET /api/public/governance-proposals`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | active | `active`, `closed`, `passed`, `failed` |
| `sort` | string | deadline | `deadline`, `votes`, `newest` |
| `limit` | integer | 20 | Number of proposals to return |

**Response:**

```json
{
  "data": [
    {
      "id": "prop-001",
      "title": "Increase meme contest reward pool",
      "description": "Proposal to increase weekly contest rewards from 50k to 75k DSHIT",
      "status": "active",
      "votes": {
        "for": 5240,
        "against": 320,
        "abstain": 45
      },
      "votingPower": {
        "for": 8750000,
        "against": 450000
      },
      "deadline": "2026-03-28T10:00:00Z",
      "proposer": "0xabc123...",
      "proposerName": "GovernanceLeader"
    }
  ],
  "timestamp": "2026-03-31T12:05:00Z"
}
```

---

### 8. Get User Governance Status

Get voting power and participation data for a wallet.

**Endpoint:** `GET /api/public/governance-status/:walletAddress`

**Response:**

```json
{
  "walletAddress": "0x...",
  "dshitBalance": "50000",
  "stakedAmount": "50000",
  "votingPower": "75000",
  "multiplier": 1.5,
  "lockPeriod": "90 days",
  "participationScore": 850,
  "reputationScore": 2200,
  "eligibleTier": "Whale",
  "votes": [
    {
      "proposalId": "prop-001",
      "vote": "for",
      "votingPower": 75000
    }
  ]
}
```

---

## Bot Integration Endpoints

### Telegram Bot Endpoints

Used by `/apps/bots/telegram` for real-time data:

- `GET /api/public/token-stats` - Current price data
- `GET /api/public/governance-proposals` - Active proposals
- `GET /api/public/governance-status/:address` - Voting power
- `POST /api/memes` - Submit meme (authenticated)

### Discord Bot Endpoints

Used by `/apps/bots/discord` for Discord integration:

- `GET /api/public/leaderboard/creators` - Top creators
- `GET /api/public/governance-proposals` - Active proposals
- `POST /api/users/verify` - Wallet verification (authenticated)

---

## Webhooks

**Coming Soon** - Subscribe to real-time events:
- New memes posted
- Leaderboard changes
- Token price alerts
- Order confirmations
- Governance proposal created
- Vote cast

---

## Support & Feedback

- **Issues:** Report bugs on [GitHub](https://github.com/dshitxyz/dshitxyz/issues)
- **Questions:** Ask in [Discord](https://discord.gg/dshitxyz)
- **Feedback:** [Twitter](https://twitter.com/dshitxyz)

---

## Changelog

### v1.0.0 (2026-03-31)
- ✅ Initial public API release
- ✅ 4 main endpoints (memes, stats, creators, holders)
- ✅ Rate limiting (1000 req/hour)
- ✅ CORS enabled for all origins
- ✅ Comprehensive caching headers
- ✅ Health check endpoint

---

**Last Updated:** 2026-03-31
**Status:** ✅ LIVE & STABLE
**Uptime:** >99.9%
