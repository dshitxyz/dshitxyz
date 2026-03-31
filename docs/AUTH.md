# Authentication & Authorization Guide

**Last Updated:** 2026-03-31  
**Version:** 1.0.0

Comprehensive guide to wallet-based authentication, JWT tokens, and authorization in dshit.xyz.

---

## Overview

dshit.xyz uses **Web3 wallet authentication** combined with **JWT tokens** for access control. Users prove ownership of their wallet by signing a message, which is verified server-side.

### Authentication Flow

```
1. User connects wallet (MetaMask, RainbowKit, etc.)
2. User signs message with their private key
3. Server verifies signature matches claimed address
4. Server generates JWT token
5. Client stores token in localStorage
6. Token included in Authorization header for protected routes
```

---

## Client-Side Implementation

### 1. Connect Wallet

Use RainbowKit or wagmi to connect wallet:

```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <div>
      <ConnectButton />
    </div>
  );
}
```

### 2. Sign Message

Create a message and request signature from user:

```typescript
import { useAccount, useSignMessage } from 'wagmi';

export function SignMessage() {
  const { address } = useAccount();
  const { signMessage, isPending } = useSignMessage();

  const handleSign = async () => {
    const message = `Sign this message to authenticate with dshit.xyz`;
    const timestamp = Date.now();

    signMessage(
      { message: `${message}\n\nTimestamp: ${timestamp}` },
      {
        onSuccess: async (signature) => {
          await verifySignature(address, signature, message, timestamp);
        },
      }
    );
  };

  return (
    <button onClick={handleSign} disabled={isPending}>
      Sign Message
    </button>
  );
}
```

### 3. Verify on Backend & Get Token

```typescript
async function verifySignature(
  address: string,
  signature: string,
  message: string,
  timestamp: number
) {
  const response = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      signature,
      message,
      timestamp,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Auth failed:', error.message);
    return;
  }

  const { token, user } = await response.json();

  // Store token in localStorage
  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));

  // Redirect to dashboard
  window.location.href = '/dashboard';
}
```

### 4. Use Token in Protected Routes

```typescript
// Fetch with token in header
async function fetchProtected(endpoint: string) {
  const token = localStorage.getItem('authToken');

  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    window.location.href = '/auth/login';
    return;
  }

  return response.json();
}

// Example: Create an order (protected)
async function createOrder(items: CartItem[]) {
  return fetchProtected('/api/checkout/create', {
    method: 'POST',
    body: JSON.stringify({ items, total: calculateTotal(items) }),
  });
}
```

### 5. Logout

```typescript
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  window.location.href = '/auth/login';
}
```

---

## Server-Side Implementation

### Authentication Endpoint

**POST `/api/auth/verify`**

Verifies signed message and returns JWT token.

#### Request

```typescript
{
  address: string;        // Ethereum address (0x + 40 hex chars)
  signature: string;      // Signature from wallet
  message: string;        // Original message that was signed
  timestamp: number;      // Unix timestamp when message was created
}
```

#### Response (Success)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "address": "0x1234567890123456789012345678901234567890",
    "pseudonym": "ProudPoop42",
    "avatar": "https://api.example.com/avatar/user-123.png",
    "createdAt": "2026-03-31T12:00:00Z"
  }
}
```

#### Response (Error)

```json
{
  "message": "Signature expired",
  "code": "SIGNATURE_EXPIRED",
  "statusCode": 401
}
```

### Protected Routes

Use `@fastify/jwt` plugin to protect routes:

```typescript
import { FastifyInstance } from 'fastify';

export async function protectedRoutes(app: FastifyInstance) {
  // GET /api/user/profile - Get current user
  app.get<{ Reply: { userId: string } }>(
    '/user/profile',
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const userId = request.user.userId;
      const user = await getUserById(userId);

      return reply.send(user);
    }
  );

  // POST /api/checkout/create - Create order (authenticated)
  app.post<{ Body: any }>(
    '/checkout/create',
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const address = request.user.address;
      const userId = request.user.userId;

      // Create order for this user
      const order = await createOrder(userId, address, request.body);

      return reply.status(201).send(order);
    }
  );
}
```

---

## JWT Token Structure

Tokens are JWT format containing:

```typescript
{
  // Issued at
  iat: 1711900400,

  // Expiration (24 hours from issue)
  exp: 1711986800,

  // User data
  address: '0x1234567890123456789012345678901234567890',
  userId: 'user-123',
  
  // Token type
  type: 'access'
}
```

### Checking Token Expiration

```typescript
function isTokenExpired(token: string): boolean {
  const decoded = jwt.decode(token);
  if (!decoded) return true;

  const expiresAt = decoded.exp * 1000; // Convert to ms
  return Date.now() > expiresAt;
}

// Usage
if (isTokenExpired(localStorage.getItem('authToken'))) {
  // Need to sign in again
}
```

---

## Authorization Patterns

### Owner-Only Access

Prevent users from accessing other users' resources:

```typescript
// User A tries to access User B's order
app.get<{ Params: { orderId: string } }>(
  '/checkout/:orderId',
  { onRequest: [app.authenticate] },
  async (request, reply) => {
    const requestedOrder = await getOrder(request.params.orderId);

    // Check ownership
    if (requestedOrder.userId !== request.user.userId) {
      return reply.status(403).send({
        message: 'You cannot access this order',
        code: 'FORBIDDEN',
      });
    }

    return reply.send(requestedOrder);
  }
);
```

### Role-Based Access

Restrict features to specific user tiers:

```typescript
interface User {
  address: string;
  tier: 'visitor' | 'lurker' | 'native' | 'whale' | 'based';
}

app.post(
  '/governance/propose',
  { onRequest: [app.authenticate] },
  async (request, reply) => {
    const user = await getUser(request.user.userId);

    // Only Whale tier+ can propose
    const canPropose = ['whale', 'based'].includes(user.tier);

    if (!canPropose) {
      return reply.status(403).send({
        message: 'Requires Whale tier or higher',
        code: 'INSUFFICIENT_TIER',
      });
    }

    return createProposal(request.user.userId, request.body);
  }
);
```

---

## Security Considerations

### Message Signing Best Practices

1. **Include Timestamp**
   ```typescript
   // Good: includes timestamp to prevent replay
   const message = `Sign this message\n\nTimestamp: ${Date.now()}`;
   ```

2. **Include Domain**
   ```typescript
   // Better: includes domain to prevent cross-site
   const message = `Sign this message for dshit.xyz\n\nTimestamp: ${Date.now()}`;
   ```

3. **Reject Old Signatures**
   ```typescript
   // Server rejects signatures older than 5 minutes
   const maxAge = 5 * 60 * 1000;
   if (Math.abs(Date.now() - timestamp) > maxAge) {
     return error('Signature expired');
   }
   ```

### Token Storage

| Storage | Pros | Cons | Use Case |
|---------|------|------|----------|
| localStorage | Persists across sessions | Vulnerable to XSS | Web apps (most cases) |
| sessionStorage | Clears on tab close | Vulnerable to XSS | Short-lived sessions |
| Cookie | HttpOnly can't be XSS'd | Slightly more complex | Sensitive operations |
| Memory | Most secure | Lost on refresh | High-security flows |

**Recommendation:** Use localStorage for dshit.xyz (similar to DeFi apps like Uniswap).

### HTTPS Enforcement

In production, always:
- [ ] Serve over HTTPS only
- [ ] Set `Secure` flag on cookies
- [ ] Set `SameSite=Strict` on cookies
- [ ] Use `Content-Security-Policy` headers

---

## Common Issues & Solutions

### Issue: "Signature Expired"

**Cause:** Timestamp in message is >5 minutes old

**Solution:**
```typescript
// Make sure timestamp is current
const timestamp = Date.now(); // Not old value!
const message = `Sign this message\n\nTimestamp: ${timestamp}`;
```

### Issue: "Address Mismatch"

**Cause:** Signature from different wallet than claimed address

**Solution:**
```typescript
// Ensure address matches connected wallet
const account = useAccount();
const address = account.address; // Use connected address
```

### Issue: "Invalid Signature"

**Cause:** Message format doesn't match what was signed

**Solution:**
```typescript
// Message must exactly match what user signed
const message = `Sign this message to authenticate with dshit.xyz`;
const timestamp = Date.now();

// When signing:
signMessage({ message: `${message}\n\nTimestamp: ${timestamp}` });

// When verifying:
// Use same format exactly
```

### Issue: "Unauthorized" on Protected Routes

**Cause:** Missing or invalid token

**Solution:**
```typescript
// Ensure token is sent in Authorization header
const token = localStorage.getItem('authToken');
if (!token) {
  window.location.href = '/auth/login';
  return;
}

fetch('/api/checkout/create', {
  headers: {
    'Authorization': `Bearer ${token}`, // Must be "Bearer <token>"
  },
});
```

---

## Testing Authentication

### Unit Test Example

```typescript
it('should reject expired signatures', async () => {
  const expiredTime = Date.now() - 6 * 60 * 1000; // 6 min ago

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/verify',
    payload: {
      address: '0x1234567890123456789012345678901234567890',
      signature: '0xabcd',
      message: 'Sign this',
      timestamp: expiredTime,
    },
  });

  expect(response.statusCode).toBe(401);
});
```

### Integration Test Example

```typescript
it('should create JWT token on successful verification', async () => {
  // Sign a valid message (requires ethers.js in test)
  const message = 'Sign this message';
  const timestamp = Date.now();
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const signature = await wallet.signMessage(`${message}\n\nTimestamp: ${timestamp}`);

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/verify',
    payload: {
      address: wallet.address,
      signature,
      message,
      timestamp,
    },
  });

  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body.token).toBeDefined();
  expect(body.user).toBeDefined();
});
```

---

## Advanced Topics

### Refresh Tokens

Currently not implemented. Consider for future:

```typescript
// Return both access and refresh tokens
{
  accessToken: '...',      // 1 hour expiry
  refreshToken: '...',     // 7 days expiry
}

// POST /api/auth/refresh - Get new access token
app.post('/auth/refresh', async (request, reply) => {
  // Validate refresh token
  // Issue new access token
});
```

### Session Management

Track active sessions per user:

```typescript
// sessions table
{
  id: 'session-123',
  userId: 'user-456',
  token: '<jwt>',
  device: 'Chrome on Mac',
  ipAddress: '192.168.1.1',
  createdAt: '2026-03-31T12:00:00Z',
  expiresAt: '2026-04-01T12:00:00Z',
}

// Show user all active sessions
app.get('/user/sessions', { onRequest: [app.authenticate] }, ...);

// Allow logout from specific session
app.post('/user/sessions/:sessionId/logout', { onRequest: [app.authenticate] }, ...);
```

### Multi-Signature Required

For governance or sensitive operations:

```typescript
// POST /api/governance/execute
// Requires signatures from 3-of-5 multisig council
{
  proposal: '...',
  signatures: [sig1, sig2, sig3], // At least 3 of 5
}
```

---

## References

- **Ethers.js Sign:** https://docs.ethers.org/v6/api/signer/#Signer-signMessage
- **JWT.io:** https://jwt.io
- **OWASP Auth:** https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- **Test Files:** `apps/api/src/routes/__tests__/auth.test.ts`

---

**Version History:**
- 1.0.0 (2026-03-31): Initial authentication guide
