# 🚀 Session 4 Ready - Commerce & Meme Engine Implementation

**Status:** ✅ READY FOR IMMEDIATE EXECUTION
**Session 3 Merge Commit:** `befccac`
**Duration:** 35 minutes (Session 3)
**Remaining Time in Hour:** ~25 minutes available

---

## ✅ What Was Completed (Session 3)

### Wallet Connection & Authentication ✅
- Created Header.tsx with RainbowKit wallet modal
- Implemented useAuth hook for token persistence
- Created API endpoints for dashboard stats (/api/stats/*)
- Integrated real data fetching in dashboard components
- Added user profile display and logout functionality
- All TypeScript checks passing
- PR #22 merged to main

### Current Status
- Main branch clean at commit `befccac`
- All dependencies installed
- Ready for commerce phase

---

## 🎯 Session 4: Commerce & Meme Engine

**Estimated Duration:** 45-50 minutes
**Time Remaining:** ~25 minutes (can continue into next hour)

### Tasks (Priority Order)

#### Task 1: Shopping Cart System (10 min)
**File:** `apps/web/src/hooks/useCart.ts` (new)
- Create cart state management hook
- Add/remove/clear items functions
- Calculate total in DSHIT
- localStorage persistence

**File:** `apps/web/src/components/ShoppingCart.tsx` (new)
- Display cart items with quantities
- Show prices and total
- Checkout button
- Empty state

#### Task 2: Checkout Flow (15 min)
**File:** `apps/web/src/app/checkout/page.tsx`
- Protected route using useAuth
- Shipping address form
- Order summary display
- Confirmation screen

**File:** `apps/api/src/routes/checkout.ts`
- POST /api/checkout/create - Create order
- GET /api/checkout/:orderId - Get order status

#### Task 3: Product Grid (10 min)
**File:** `apps/web/src/app/products/page.tsx`
- Display products in grid
- Use /api/stats/drops endpoint
- Add to cart button on each product
- Mobile responsive

**File:** `apps/web/src/components/ProductCard.tsx`
- Individual product display
- Price in DSHIT
- Quick add to cart

#### Task 4: Meme Creator MVP (10 min)
**File:** `apps/web/src/app/meme-creator/page.tsx`
- Select meme template
- Add text overlay
- Download button
- Share functionality

**File:** `apps/api/src/routes/memes.ts`
- POST /api/memes - Create meme
- GET /api/memes - List memes

#### Task 5: Integration & Testing (5 min)
- Test full cart → checkout flow
- Verify real data integration
- Mobile responsiveness
- Error handling

---

## 📋 Quick Reference

### Current Branch
```bash
git status
# main - clean and up to date
```

### Recent Commits
```
befccac - Session 3 completion report
a8ac9d8 - Session 3 features (wallet + auth)
6a087e4 - Session 2 completion
```

### Key Files Ready for Use
```
apps/web/src/hooks/useAuth.ts            # Token management
apps/web/src/components/Header.tsx       # User info + logout
apps/api/src/routes/stats.ts             # Product data
apps/api/src/routes/auth.ts              # Auth verified
```

---

## 🔧 Setup for Session 4 (If Continuing Now)

```bash
# Already done - dependencies installed
pnpm install  # Skip if continuing immediately

# Verify everything works
pnpm --filter @dshit/web type-check  # Should pass

# Start dev server
pnpm dev
```

---

## 📁 Files to Create/Modify in Session 4

### NEW FILES (Frontend)
```
apps/web/src/hooks/useCart.ts                    # Cart state
apps/web/src/components/ShoppingCart.tsx         # Cart display
apps/web/src/components/ProductCard.tsx          # Product item
apps/web/src/app/checkout/page.tsx               # Checkout page
apps/web/src/app/products/page.tsx               # Products listing
apps/web/src/app/meme-creator/page.tsx           # Meme creator
```

### NEW FILES (Backend)
```
apps/api/src/routes/checkout.ts                  # Checkout endpoints
apps/api/src/routes/memes.ts                     # Meme endpoints
apps/api/src/lib/orders.ts                       # Order management
```

### MODIFY FILES
```
apps/web/src/app/layout.tsx                      # Add routes/nav
apps/api/src/index.ts                            # Register routes
apps/web/src/components/Header.tsx               # Add cart icon
```

---

## 📊 Success Metrics for Session 4

| Item | Requirement |
|------|-------------|
| Shopping Cart | Functional, persistent, add/remove items |
| Checkout Flow | Complete form, address validation, confirmation |
| Product Display | Grid layout, mobile responsive, add to cart |
| Meme Creator | Template selection, text input, download |
| Orders API | Create, read, list order endpoints |
| Real Integration | Cart prices from API, order creation works |
| TypeScript | Zero errors, all checks pass |
| PR | Created with goals and metrics |
| Merge | PR merged to main |

---

## 🎯 Session 4 Execution Plan

1. **Create branch:** `feat/commerce-memes`
2. **Shopping cart hook + component** (10 min)
3. **Checkout flow (page + API)** (15 min)
4. **Product grid + cards** (10 min)
5. **Meme creator + API** (10 min)
6. **Test integration** (3 min)
7. **Create PR with metrics** (2 min)
8. **Merge to main** (2 min)

**Total: ~50 minutes**

---

## 🚀 How to Start Session 4

### Option A: Run Now (Continue in This Window)
```bash
# Create feature branch
git checkout -b feat/commerce-memes

# Start implementing
# Follow tasks above in priority order

# When done
git add -A
git commit -m "feat(commerce): Shopping cart, checkout, meme creator"
git push -u origin feat/commerce-memes

# Create PR with success metrics
# Merge PR
# Commit completion report
```

### Option B: Schedule for Next Hour
```bash
/schedule create session-4 "0 * * * *" < [use Session 4 prompt below]
```

---

## 📝 Session 4 Full Prompt (For Next Agent)

```
PROJECT CONTEXT: dshit.xyz Autonomous Development
==================================================

This is Session 3 of autonomous frontend development for dshit.xyz.

PREVIOUS WORK:
✅ Session 1: Design system & UI components (merged)
✅ Session 2: Dashboard page + TypeScript fixes (merged, commit 6a087e4)

THIS SESSION: Wallet Connection & Authentication
=================================================

GOAL: Enable users to connect wallets, authenticate, and view real data

TASKS (In Priority Order):

1. RainbowKit Wallet Modal (5 min)
   File: apps/web/src/components/Header.tsx (new)
   - Create header component with navigation
   - Add wallet connect button using RainbowKit
   - Display connected address
   - Show ETH + DSHIT balance
   - Handle connect/disconnect

2. Auth Login Page (5 min)
   File: apps/web/src/app/auth/login/page.tsx
   - Use existing WalletLoginForm component
   - Add page layout and styling
   - Show loading state
   - Show errors
   - Redirect to dashboard on success

3. Backend Auth Endpoints (15 min)
   File: apps/api/src/routes/auth.ts
   - POST /api/auth/login
     * Accept wallet address
     * Generate message to sign
     * Return message
   - POST /api/auth/verify
     * Accept signature + message + address
     * Verify signature
     * Generate JWT token
     * Create/update user profile
     * Return token + user data
   - POST /api/auth/logout
     * Clear auth session

4. Real Data Integration (10 min)
   - Update DashboardStats.tsx to fetch from /api/user/stats
   - Update DashboardDrops.tsx to fetch from /api/drops
   - Add price ticker from DEX API
   - Display user portfolio data

5. Protected Routes (5 min)
   - Dashboard checks auth and redirects to login
   - API endpoints protected with auth header
   - Token stored in localStorage
   - Token included in API requests

TECHNICAL REQUIREMENTS:

Dependencies:
- RainbowKit: ^1.3.0 (already installed)
- wagmi: ^1.4.0 (already installed)
- @tanstack/react-query: ^5.20.0 (already installed)

API Endpoints:
- POST /api/auth/login - initiate sign request
- POST /api/auth/verify - verify signature
- POST /api/auth/logout - logout
- GET /api/user/stats - user data
- GET /api/drops - product list
- GET /api/price - DSHIT price

Database:
- Users table (address, profile, created_at)
- Sessions table (user_id, token, expires_at)

Styling:
- Use DESIGN_SYSTEM.md colors and typography
- Mobile-first responsive design
- Hover states and transitions
- Brutalist aesthetic

SUCCESS CRITERIA:

✅ RainbowKit modal functional in header
✅ Auth login page working end-to-end
✅ Message signing verified on backend
✅ JWT tokens generated and stored
✅ Dashboard fetches real data from API
✅ Protected routes with auth redirects
✅ User profile displayed
✅ Wallet balance shown
✅ All TypeScript checks pass
✅ No console errors
✅ Mobile responsive
✅ PR created with metrics
✅ PR merged to main
✅ Completion report written

FILES TO CREATE:
- apps/web/src/components/Header.tsx
- apps/web/src/components/ConnectWallet.tsx

FILES TO MODIFY:
- apps/web/src/app/layout.tsx (import Header)
- apps/web/src/app/auth/login/page.tsx (enhance)
- apps/api/src/routes/auth.ts (add endpoints)
- apps/web/src/components/DashboardStats.tsx (fetch data)
- apps/web/src/components/DashboardDrops.tsx (fetch data)

WORKFLOW:
1. Create branch: feat/wallet-auth
2. Implement Header.tsx with wallet modal
3. Enhance login page
4. Add backend auth endpoints
5. Integrate real data
6. Test all flows
7. Create PR with success metrics
8. Merge PR
9. Write SESSION_3_COMPLETION.md
10. Push to main

TIMING: 40-45 minutes autonomous execution

Go autonomous. No user input needed during execution.
Build → Test → PR → Merge → Document.
```

---

## 🎨 Design Reference

**Colors (from DESIGN_SYSTEM.md):**
- Primary: #F4D03F (Shit Yellow)
- Secondary: #8B4513 (Poop Brown)
- Accent: #FF0000 (Glitch Red)
- Success: #39FF14 (Toxic Green)

**Typography:**
- Display: Bebas Neue
- Body: Space Mono
- Accents: Permanent Marker

**Spacing:** 4px, 8px, 16px, 24px, 32px grid

---

## 🔗 Key Files

**Already Implemented:**
- `apps/web/src/components/auth/WalletLoginForm.tsx` - Message signing
- `apps/api/src/routes/auth.ts` - Skeleton endpoints ready
- `apps/api/src/lib/profiles.ts` - User profile management

**Ready to Use:**
- UI Components: Button, Card, StatBox from @dshit/ui
- Design System colors as CSS variables
- Responsive grid system in Tailwind

---

## 📞 Support

If issues arise during Session 3:
1. Check TypeScript errors: `pnpm --filter @dshit/web type-check`
2. Review DESIGN_SYSTEM.md for styling questions
3. Check SESSION_2_COMPLETION.md for context
4. Reference wagmi v1 docs for API changes

---

## ✨ Summary

**Session 2 accomplished:** Complete dashboard page with integrated UI components and TypeScript fixes.

**Session 3 will accomplish:** Full wallet connection and authentication system, enabling real data display.

**Current status:** Main branch clean, ready for next phase.

**Estimated completion:** ~45 minutes (fits in current hour with room to spare)

---

**Ready to begin Session 3?**
- If YES and continuing now: `git checkout -b feat/wallet-auth` and start implementing
- If scheduling for later: Use `/schedule` command with prompt above when ready

*Session 2 complete. Main branch clean. Ready for next autonomous execution.*
