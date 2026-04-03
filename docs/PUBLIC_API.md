# dshit.xyz Public API Documentation

**Base URL:** `https://api.dshitxyz.vercel.app` (or `http://localhost:3001` for local development)

**Version:** 0.1.0  
**Status:** 🟢 ACTIVE

---

## Overview

The dshit.xyz Public API provides access to:
- Meme gallery and voting data
- Token statistics and price info
- Creator leaderboards
- Platform analytics

No authentication required for public endpoints.

---

## Rate Limiting

- **Public endpoints:** 100 requests per minute per IP
- **Authenticated endpoints:** 1000 requests per minute per user
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Error Handling

All errors follow this format:

```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2026-03-31T12:34:56Z"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad request
- `404` - Not found
- `429` - Rate limit exceeded
- `500` - Internal server error
- `503` - Service unavailable

---

## Endpoints

### Public - Meme Gallery

#### GET `/api/public/memes`

Fetch paginated meme gallery.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 50) |
| `sort` | string | trending | Sort by: `trending`, `newest`, `highest-voted` |

**Example Request:**
```bash
curl "https://api.dshitxyz.vercel.app/api/public/memes?page=1&limit=10&sort=trending"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "meme-001",
      "title": "When your portfolio is down but you HODL",
      "imageUrl": "/api/mock/meme1.png",
      "creator": "CryptoApe420",
      "votes": 1248,
      "createdAt": "2026-03-31T10:30:00Z"
    },
    {
      "id": "meme-002",
      "title": "DSHIT goes brrrrr",
      "imageUrl": "/api/mock/meme2.png",
      "creator": "MemeKing",
      "votes": 892,
      "createdAt": "2026-03-31T08:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8294,
    "pages": 830
  },
  "meta": {
    "sort": "trending",
    "timestamp": "2026-03-31T12:34:56Z"
  }
}
```

---

### Public - Token Stats

#### GET `/api/public/stats`

Fetch token price and platform statistics.

**Example Request:**
```bash
curl "https://api.dshitxyz.vercel.app/api/public/stats"
```

**Example Response:**
```json
{
  "token": {
    "price": "$0.0000042",
    "marketCap": "$4.2M",
    "volume24h": "$127K",
    "holders": 2847,
    "supply": "1,000,000,000",
    "circulating": "891,234,567",
    "change24h": "+12.5%",
    "change7d": "+47.3%"
  },
  "platform": {
    "totalMemes": 8294,
    "totalCreators": 1847,
    "totalVotes": 284739,
    "avgVotesPerMeme": 34,
    "memesCreatedToday": 128,
    "contractAddress": "0x0000000000000000000000000000000000000000",
    "deployedNetwork": "base-sepolia"
  },
  "timestamp": "2026-03-31T12:34:56Z"
}
```

---

### Public - Leaderboard

#### GET `/api/public/leaderboard`

Fetch top creators by votes.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | creators | Type: `creators` or `memes` |
| `limit` | number | 20 | Number of results (max 100) |

**Example Request:**
```bash
curl "https://api.dshitxyz.vercel.app/api/public/leaderboard?type=creators&limit=5"
```

**Example Response:**
```json
{
  "type": "creators",
  "data": [
    {
      "rank": 1,
      "creator": "MemeKingSupreme",
      "totalVotes": 18492,
      "memesCount": 187,
      "earnings": "12,485 DSHIT"
    },
    {
      "rank": 2,
      "creator": "CryptoArtisan",
      "totalVotes": 14723,
      "memesCount": 142,
      "earnings": "9,847 DSHIT"
    }
  ],
  "total": 1847,
  "timestamp": "2026-03-31T12:34:56Z"
}
```

---

### Public - Health Check

#### GET `/api/public/health`

Service health status (no authentication required).

**Example Request:**
```bash
curl "https://api.dshitxyz.vercel.app/api/public/health"
```

**Example Response:**
```json
{
  "status": "healthy",
  "api": "dshit.xyz",
  "version": "0.1.0",
  "network": "base-sepolia",
  "timestamp": "2026-03-31T12:34:56Z"
}
```

---

## Analytics Endpoints

### Track Event

#### POST `/api/analytics/event`

Track custom analytics events.

**Request Body:**
```json
{
  "event": "meme_created",
  "userId": "0x1234...5678",
  "metadata": {
    "category": "political",
    "duration": 120
  }
}
```

**Response:**
```json
{
  "status": "tracked",
  "event": "meme_created",
  "timestamp": "2026-03-31T12:34:56Z"
}
```

---

### Funnel Metrics

#### GET `/api/analytics/funnel`

Visitor → Lurker → Native conversion funnel.

**Response:**
```json
{
  "metrics": {
    "visitors": 42850,
    "lurkers": 8234,
    "natives": 1847,
    "conversionRates": {
      "visitorToLurker": "19.2%",
      "lurkerToNative": "22.4%",
      "visitorToNative": "4.3%"
    }
  },
  "timestamp": "2026-03-31T12:34:56Z",
  "period": "all-time"
}
```

---

### Commerce Metrics

#### GET `/api/analytics/commerce`

Commerce and sales statistics.

**Response:**
```json
{
  "metrics": {
    "totalOrders": 2847,
    "totalRevenue": "892,450 DSHIT",
    "avgOrderValue": "314 DSHIT",
    "ordersToday": 34,
    "revenueToday": "10,676 DSHIT",
    "topProducts": [
      { "name": "Biohazard Revenge Kit", "sales": 284 },
      { "name": "Political Hit Package", "sales": 187 }
    ]
  },
  "timestamp": "2026-03-31T12:34:56Z",
  "period": "all-time"
}
```

---

### Community Metrics

#### GET `/api/analytics/community`

Community and creator statistics.

**Response:**
```json
{
  "metrics": {
    "totalMemesCreated": 8294,
    "totalVotes": 284739,
    "avgVotesPerMeme": 34,
    "activeCreators": 1847,
    "contestEntries": 427,
    "contestVoteTotal": 18492
  },
  "timestamp": "2026-03-31T12:34:56Z",
  "period": "all-time"
}
```

---

### Engagement Metrics

#### GET `/api/analytics/engagement`

User engagement statistics.

**Response:**
```json
{
  "metrics": {
    "dailyActiveUsers": 1247,
    "weeklyActiveUsers": 6843,
    "monthlyActiveUsers": 18920,
    "avgSessionDuration": "12m 34s",
    "bounceRate": "28.5%",
    "returnVisitors": "42.3%"
  },
  "timestamp": "2026-03-31T12:34:56Z",
  "period": "30-days"
}
```

---

### Summary Metrics

#### GET `/api/analytics/summary`

All metrics in one request.

**Response:**
```json
{
  "summary": {
    "funnel": {
      "visitors": 42850,
      "lurkers": 8234,
      "natives": 1847
    },
    "commerce": {
      "totalOrders": 2847,
      "totalRevenue": "892,450 DSHIT"
    },
    "community": {
      "totalMemesCreated": 8294,
      "activeCreators": 1847
    },
    "engagement": {
      "dailyActiveUsers": 1247,
      "monthlyActiveUsers": 18920
    }
  },
  "timestamp": "2026-03-31T12:34:56Z"
}
```

---

## Code Examples

### JavaScript/Node.js

```javascript
import axios from 'axios';

const API_BASE = 'https://api.dshitxyz.vercel.app';

// Fetch memes
async function getMemes() {
  const response = await axios.get(`${API_BASE}/api/public/memes`, {
    params: {
      page: 1,
      limit: 20,
      sort: 'trending',
    },
  });
  return response.data;
}

// Fetch stats
async function getStats() {
  const response = await axios.get(`${API_BASE}/api/public/stats`);
  return response.data;
}

// Fetch leaderboard
async function getLeaderboard() {
  const response = await axios.get(`${API_BASE}/api/public/leaderboard`, {
    params: { limit: 10 },
  });
  return response.data;
}

// Usage
const memes = await getMemes();
const stats = await getStats();
const leaders = await getLeaderboard();

console.log(memes, stats, leaders);
```

### Python

```python
import requests

API_BASE = "https://api.dshitxyz.vercel.app"

# Fetch memes
response = requests.get(f"{API_BASE}/api/public/memes", params={
    "page": 1,
    "limit": 20,
    "sort": "trending"
})
memes = response.json()

# Fetch stats
response = requests.get(f"{API_BASE}/api/public/stats")
stats = response.json()

# Fetch leaderboard
response = requests.get(f"{API_BASE}/api/public/leaderboard", params={
    "limit": 10
})
leaderboard = response.json()
```

### cURL

```bash
# Get memes
curl "https://api.dshitxyz.vercel.app/api/public/memes?page=1&limit=10"

# Get stats
curl "https://api.dshitxyz.vercel.app/api/public/stats"

# Get leaderboard
curl "https://api.dshitxyz.vercel.app/api/public/leaderboard?limit=5"

# Track event
curl -X POST "https://api.dshitxyz.vercel.app/api/analytics/event" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "meme_created",
    "userId": "0x...",
    "metadata": {"category": "political"}
  }'
```

---

## Webhooks (Coming Soon)

Webhook subscriptions for real-time events:
- Meme created
- Vote received
- Order placed
- Leaderboard changes

---

## Support

- **Documentation:** https://github.com/dshitxyz/dshitxyz/docs
- **Status Page:** https://status.dshitxyz.vercel.app
- **Discord:** https://discord.gg/dshit
- **Twitter:** https://twitter.com/dshitxyz

---

**Last Updated:** 2026-03-31  
**API Version:** 0.1.0
