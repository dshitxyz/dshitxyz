# 🚀 Session 3 Ready - Wallet Connection & Auth Implementation

**Status:** ✅ READY FOR IMMEDIATE EXECUTION
**Session 2 Merge Commit:** `6a087e4`
**Duration:** 25 minutes (Session 2)
**Remaining Time in Hour:** ~30-35 minutes available

---

## ✅ What Was Completed (Session 2)

### Dashboard Page Fully Integrated ✅
- Created responsive dashboard at `/dashboard`
- 4 sub-components working: DashboardStats, DashboardDrops, FlushMeter, Newsletter
- UI component library integrated (StatBox, Card, Button from @dshit/ui)
- Protected route that checks wallet connection
- Design system fully applied (colors, typography, spacing)

### Critical Fixes ✅
- Fixed wagmi v1 API in Providers.tsx
- Added missing @tanstack/react-query dependency
- Fixed WalletLoginForm hook usage
- All TypeScript errors resolved
- Type check passing

### Current Status
- Main branch clean at commit `6a087e4`
- All dependencies installed
- Ready for next phase

---

## 🎯 Session 3: Wallet Connection & Auth

**Estimated Duration:** 40-45 minutes
**Time Remaining:** ~30-35 minutes (can continue into next hour)

### Tasks (Priority Order)

#### Task 1: RainbowKit Wallet Modal (5 min)
**File:** `apps/web/src/components/Header.tsx` (new)
- Import RainbowKit components
- Create header with wallet button
- Show connected address
- Show balance display

#### Task 2: Auth Login Page (10 min)
**File:** `apps/web/src/app/auth/login/page.tsx`
- Use WalletLoginForm component (already exists)
- Add loading/error states
- Redirect to dashboard on success
- Clean styling

#### Task 3: Backend Auth Endpoints (15 min)
**File:** `apps/api/src/routes/auth.ts`
- POST /api/auth/login - initiate sign request
- POST /api/auth/verify - verify signature, return JWT
- POST /api/auth/logout - clear session
- Implement JWT token generation
- Store user profile in database

#### Task 4: Real Data Display (10 min)
- Update DashboardStats to fetch from API
- Update DashboardDrops from database
- Add price ticker (DEX API)
- Display user portfolio

#### Task 5: Protected Routes & Persistence (5 min)
- Dashboard redirects to login if not auth
- localStorage token persistence
- Token in API request headers
- Handle token expiration

---

## 📋 Quick Reference

### Current Branch
```bash
git status
# main - clean and up to date
```

### Recent Commits
```
6a087e4 - Session 2 completion report
f716e3e - Dashboard page + TypeScript fixes (PR #21 merged)
3687ec3 - Dashboard page implementation
```

### Key Files Modified in Session 2
```
apps/web/package.json              # Added @tanstack/react-query
apps/web/src/components/Providers.tsx      # Fixed wagmi API
apps/web/src/components/auth/WalletLoginForm.tsx  # Fixed hooks
apps/web/src/app/dashboard/page.tsx        # Already exists
```

---

## 🔧 Setup for Session 3 (If Continuing Now)

```bash
# Already done - dependencies are installed
pnpm install  # (skip if continuing immediately)

# Verify everything works
pnpm --filter @dshit/web type-check  # Should pass

# Start dev server
pnpm dev
```

---

## 📁 Files to Create/Modify in Session 3

### NEW FILES
```
apps/web/src/components/Header.tsx              # Wallet header
apps/web/src/components/ConnectWallet.tsx       # Wallet button
```

### MODIFY FILES
```
apps/web/src/app/layout.tsx                     # Add Header
apps/web/src/app/auth/login/page.tsx            # Enhance login
apps/api/src/routes/auth.ts                     # Backend endpoints
apps/web/src/components/DashboardStats.tsx      # Fetch real data
apps/web/src/components/DashboardDrops.tsx      # Fetch real data
```

---

## 📊 Success Metrics for Session 3

| Item | Requirement |
|------|-------------|
| Wallet Modal | Functional in header, shows address & balance |
| Auth Flow | Message signing → verification → JWT token |
| Login Page | Accessible at /auth/login, working UI |
| Protected Routes | Dashboard redirects to login if not auth |
| Real Data | Dashboard fetches stats from API |
| TypeScript | Zero errors, all checks pass |
| PR | Created with goals and metrics |
| Merge | PR merged to main |

---

## 🎯 Session 3 Execution Plan

1. **Create branch:** `feat/wallet-auth`
2. **Implement header with wallet modal** (5 min)
3. **Create login page** (5 min)
4. **Backend auth endpoints** (15 min)
5. **Real data integration** (10 min)
6. **Create PR with metrics** (3 min)
7. **Merge to main** (2 min)

**Total: ~40 minutes**

---

## 🚀 How to Start Session 3

### Option A: Run Now (Continue in This Window)
```bash
# Create feature branch
git checkout -b feat/wallet-auth

# Start implementing
# Follow tasks above in priority order

# When done
git add -A
git commit -m "feat(auth): Wallet connection & authentication flow"
git push -u origin feat/wallet-auth

# Create PR with success metrics
# Merge PR
# Commit completion report
```

### Option B: Schedule for Next Hour
```bash
/schedule create session-3 "0 * * * *" < [use Session 3 prompt below]
```

---

## 📝 Session 3 Full Prompt (For Next Agent)

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
