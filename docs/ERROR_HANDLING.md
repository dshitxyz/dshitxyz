# API Error Handling Guide

**Last Updated:** 2026-03-31  
**Version:** 1.0.0

This document describes error handling patterns, status codes, and response formats across the dshit.xyz API.

---

## Quick Reference

| Status Code | Meaning | Example |
|------------|---------|---------|
| 200 | OK | Successful GET request |
| 201 | Created | New order created |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User lacks permission (e.g., accessing another user's order) |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation error (Zod schema) |
| 500 | Server Error | Unexpected error |

---

## Error Response Format

All API errors follow this standard format:

```json
{
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "details": {}
}
```

### Example Error Responses

#### Missing Required Field
```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": {
    "field": "address",
    "reason": "Expected string matching regex"
  }
}
```

#### Unauthorized Access
```json
{
  "message": "Authentication required",
  "code": "UNAUTHORIZED",
  "statusCode": 401,
  "details": {
    "reason": "Missing or invalid JWT token"
  }
}
```

#### Forbidden Access
```json
{
  "message": "You do not have permission to access this resource",
  "code": "FORBIDDEN",
  "statusCode": 403,
  "details": {
    "resource": "Order #12345",
    "reason": "Resource belongs to another user"
  }
}
```

#### Invalid Signature
```json
{
  "message": "Authentication failed",
  "code": "INVALID_SIGNATURE",
  "statusCode": 401,
  "details": {
    "reason": "Signature does not match provided message"
  }
}
```

---

## Authentication Errors

### Missing Token
- **Status:** 401
- **Code:** `UNAUTHORIZED`
- **Message:** "Authentication required"
- **Solution:** Include `Authorization: Bearer <token>` header

### Invalid Token
- **Status:** 401
- **Code:** `UNAUTHORIZED`
- **Message:** "Invalid token"
- **Solution:** Use a valid JWT token from `/api/auth/verify`

### Expired Signature
- **Status:** 401
- **Code:** `SIGNATURE_EXPIRED`
- **Message:** "Signature expired"
- **Reason:** Timestamp is older than 5 minutes
- **Solution:** Create a new signature with current timestamp

### Address Mismatch
- **Status:** 401
- **Code:** `ADDRESS_MISMATCH`
- **Message:** "Address mismatch"
- **Reason:** Signature doesn't match claimed address
- **Solution:** Ensure signature is from the correct wallet address

---

## Validation Errors

### Invalid Address Format
- **Status:** 400
- **Code:** `VALIDATION_ERROR`
- **Message:** "Invalid Ethereum address format"
- **Expected Format:** `0x` followed by 40 hexadecimal characters
- **Example Valid:** `0x1234567890123456789012345678901234567890`

### Missing Required Fields
- **Status:** 400
- **Code:** `VALIDATION_ERROR`
- **Details Include:** Which field is missing
- **Solution:** Provide all required fields in request payload

### Invalid Data Type
- **Status:** 422
- **Code:** `VALIDATION_ERROR`
- **Details Include:** Expected type vs. provided type
- **Solution:** Ensure data types match API schema

---

## Checkout Errors

### Empty Cart
- **Status:** 400
- **Code:** `EMPTY_CART`
- **Message:** "Cart is empty"
- **Solution:** Add items before checkout

### Total Mismatch
- **Status:** 400
- **Code:** `TOTAL_MISMATCH`
- **Message:** "Order total doesn't match items"
- **Solution:** Verify arithmetic: sum(items) should equal total

### Invalid Quantity
- **Status:** 400
- **Code:** `INVALID_QUANTITY`
- **Message:** "Quantity must be positive"
- **Solution:** Use quantities > 0

### Order Not Found
- **Status:** 404
- **Code:** `ORDER_NOT_FOUND`
- **Message:** "Order not found"
- **Solution:** Verify order ID is correct

### Insufficient Permissions
- **Status:** 403
- **Code:** `FORBIDDEN`
- **Message:** "Cannot access this order"
- **Reason:** User doesn't own the order
- **Solution:** Use your own orders

---

## Public API Errors

### Invalid Pagination
- **Status:** 400
- **Code:** `INVALID_PAGINATION`
- **Message:** "Page must be >= 1"
- **Solution:** Use `page=1` minimum

### Invalid Sort Parameter
- **Status:** 400
- **Code:** `INVALID_SORT`
- **Message:** "Invalid sort parameter"
- **Valid Values:** `trending`, `newest`, `highest-voted`
- **Solution:** Use one of the valid sort options

---

## Common Error Patterns

### Handling Missing Fields

Request without required field:
```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"address": "0x..."}'
  # Missing: signature, message, timestamp
```

Response:
```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400
}
```

### Handling Invalid Input

Request with wrong data type:
```bash
curl -X GET "http://localhost:3001/api/public/memes?page=abc&limit=xyz"
```

Response:
```json
{
  "message": "Invalid pagination parameters",
  "code": "INVALID_PAGINATION",
  "statusCode": 400
}
```

### Handling Authorization Failure

Request without token:
```bash
curl -X POST http://localhost:3001/api/checkout/create \
  -H "Content-Type: application/json" \
  -d '{"items": [], "total": 0}'
```

Response:
```json
{
  "message": "Authentication required",
  "code": "UNAUTHORIZED",
  "statusCode": 401
}
```

---

## Best Practices

### For API Consumers

1. **Always check status codes first**
   ```javascript
   if (response.status === 401) {
     // Handle authentication error
   }
   ```

2. **Parse error response structure**
   ```javascript
   const error = await response.json();
   console.log(error.code, error.message, error.details);
   ```

3. **Handle retries appropriately**
   - 400, 401, 403: Don't retry (client error)
   - 404: Don't retry (resource doesn't exist)
   - 500: Retry with exponential backoff
   - Timeouts: Retry once after 1-2 seconds

4. **Validate before sending**
   ```javascript
   // Check address format before API call
   if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
     console.error('Invalid address format');
   }
   ```

### For API Developers

1. **Always validate input with Zod**
   ```typescript
   const schema = z.object({
     address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
   });
   ```

2. **Use consistent error format**
   ```typescript
   reply.status(400).send({
     message: 'Descriptive message',
     code: 'ERROR_CODE',
     details: { /* relevant context */ }
   });
   ```

3. **Include helpful details**
   - Which field failed validation
   - What format is expected
   - Valid range or options
   - How to fix the error

4. **Log errors for debugging**
   ```typescript
   console.error('Auth error:', error, {
     address,
     signature: signature.slice(0, 10) + '...',
     timestamp,
   });
   ```

---

## Error Recovery Guide

### User Sees "Signature Expired"

1. **Cause:** Signature timestamp > 5 minutes old
2. **Solution:**
   - Refresh the page
   - Try signing again
   - Check wallet clock is correct

### User Sees "Address Mismatch"

1. **Cause:** Signature from different wallet than claimed
2. **Solution:**
   - Ensure correct wallet is connected
   - Check MetaMask/wallet is on correct account
   - Try disconnecting and reconnecting wallet

### User Sees "Order Not Found"

1. **Cause:** Invalid order ID or user accessing wrong order
2. **Solution:**
   - Check order ID is correct
   - Ensure you're logged in with correct wallet
   - Try refreshing page

### User Sees "Cart is Empty"

1. **Cause:** No items in cart before checkout
2. **Solution:**
   - Add products from /products page
   - Check cart icon shows items added
   - Verify localStorage not cleared

---

## Testing Errors

### Unit Test Example

```typescript
it('should return 400 for invalid address', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/verify',
    payload: {
      address: 'not-an-address',
      signature: '0xabc',
      message: 'Sign this',
      timestamp: Date.now(),
    },
  });

  expect(response.statusCode).toBe(400);
  const body = JSON.parse(response.body);
  expect(body.code).toBe('VALIDATION_ERROR');
});
```

### Integration Test Example

```typescript
it('should prevent access to other users\' orders', async () => {
  // User A creates order
  const orderResponse = await checkout.create(userAToken, order);
  const orderId = orderResponse.orderId;

  // User B tries to access
  const response = await checkout.get(userBToken, orderId);

  expect(response.statusCode).toBe(403);
  expect(response.body.code).toBe('FORBIDDEN');
});
```

---

## Monitoring & Alerting

### Error Metrics to Track

- Validation errors by field (invalid formats, missing data)
- Authentication failures (failed signatures, expired tokens)
- Authorization failures (permission denied)
- Not found errors (missing orders, products)
- Server errors (500s)

### Alert Thresholds

- **Red alert:** >5% of requests returning 500
- **Yellow alert:** >20% of requests returning 400 (validation)
- **Blue alert:** Auth failures >10% (possible attack?)

---

## References

- **API Documentation:** See `docs/PUBLIC_API.md`
- **Test Suite:** `apps/api/src/routes/__tests__/`
- **Auth Guide:** `docs/AUTH.md` (coming soon)
- **Checkout Guide:** `docs/CHECKOUT.md` (coming soon)

---

**Version History:**
- 1.0.0 (2026-03-31): Initial error handling guide
