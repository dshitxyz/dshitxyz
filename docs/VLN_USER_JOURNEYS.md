# VLN User Journey Map — dshit.xyz

**Visitor → Lurker → Native** framework for organic community growth and self-regulating autonomy.

---

## Overview

Every user passes through three phases. The platform is designed so each phase naturally pulls users deeper — no forced onboarding, no gated content walls. The system self-regulates through token mechanics, reputation, and community governance.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   VISITOR    │────▶│   LURKER    │────▶│   NATIVE    │
│  (Discover)  │     │  (Explore)  │     │   (Own)     │
└─────────────┘     └─────────────┘     └─────────────┘
   No wallet           Wallet connected    Token holder
   Browse only         Watchlists          Governance
   Meme gallery        Cart/wishlist       Create & earn
   Landing page        Anonymous profile   DAO voting
```

---

## Phase 1: VISITOR (Discovery)

**Goal:** Hook them in 5 seconds. Meme-first, no friction.

### Touchpoints
| Touchpoint | Experience | Conversion Trigger |
|------------|------------|--------------------|
| Landing page | Brutalist hero — glitch animation, $DSHIT price ticker, meme carousel | "Connect Wallet" CTA |
| Meme gallery | Public feed of top community memes, sortable by viral score | "Create Your Own" prompt |
| Product catalog | Browse gag/novelty products with $DSHIT prices visible | "Pay with $DSHIT" badge |
| Token info | Live chart, supply stats, holder count | "Buy $DSHIT" link to DEX |
| Socials | Twitter/Telegram/Discord links embedded | Community energy visible |

### Metrics
- Time on site (target: >45s)
- Meme gallery scroll depth (target: >5 items)
- Wallet connect rate (target: >8% of visitors)

### Self-Regulation
- Content is community-curated (upvote/downvote visible to visitors)
- No user-generated content visible without community approval threshold
- Rate limiting on all public endpoints

---

## Phase 2: LURKER (Exploration)

**Goal:** Let them explore with zero commitment. Build familiarity.

### Entry Trigger
Wallet connected (no token purchase required).

### Touchpoints
| Touchpoint | Experience | Conversion Trigger |
|------------|------------|--------------------|
| Anonymous profile | Auto-generated pseudonym + avatar (World ID optional) | "Customize" prompt |
| Watchlist | Save products, track meme contests | "Get notified" → needs token stake |
| Meme tools | Basic meme generator (templates + text overlay) | "Unlock pro tools" with $DSHIT |
| Community feed | Read community posts, see governance proposals | "Vote" requires tokens |
| Cart system | Add products to cart, see $DSHIT checkout flow | Purchase requires tokens |
| Leaderboards | See top meme creators, top holders, top voters | Aspiration trigger |

### Metrics
- Sessions per week (target: >2)
- Watchlist additions (target: >3 items)
- Meme generator usage (target: >1 creation)
- Token acquisition rate (target: >15% of lurkers)

### Self-Regulation
- Anonymous profiles are sybil-resistant via World ID proof-of-humanity
- Lurkers can report content but cannot post
- Wallet reputation score begins accumulating (on-chain activity history)
- Anti-spam: wallet age + minimum interaction threshold before unlocking features

---

## Phase 3: NATIVE (Ownership)

**Goal:** They ARE the platform. Create, govern, earn.

### Entry Trigger
Holds $DSHIT tokens (any amount).

### Touchpoints
| Touchpoint | Experience | Power Level |
|------------|------------|-------------|
| Meme creation suite | Full editor — templates, AI generation, custom uploads | All tools unlocked |
| Product submissions | Submit custom gag products for community vote | Requires stake |
| Governance (DAO) | Vote on proposals — treasury, features, moderation | Token-weighted |
| Meme contests | Enter weekly contests, win $DSHIT prizes | Stake to enter |
| Referral engine | Share links, earn % of referred purchases | Passive income |
| Moderation | Flag/review content, earn mod rewards | Reputation-gated |
| Staking | Stake $DSHIT for governance power + yield | Lock periods |
| Commerce | Purchase & send gag products anonymously | Full checkout |

### Token-Gated Tiers

| Tier | Holding | Unlocks |
|------|---------|---------|
| Pleb | 1+ DSHIT | Basic meme tools, voting, commerce |
| Degen | 10,000+ DSHIT | Pro meme suite, contest entry, product submissions |
| Whale | 100,000+ DSHIT | Governance proposals, mod powers, early access |
| Based | 1,000,000+ DSHIT | Multi-sig eligibility, treasury council, custom features |

### Metrics
- Governance participation rate (target: >20% of natives)
- Meme submissions per week (target: >50)
- Commerce conversion rate (target: >5%)
- Token retention (target: >60% held >30 days)

### Self-Regulation (Autonomous Governance)
- **Content moderation:** Community-driven via stake-weighted flagging
- **Proposal system:** Anyone with Whale tier+ can propose; quorum = 10% of circulating supply voting
- **Dispute resolution:** Multi-sig council (Based tier) resolves contested moderation decisions
- **Treasury management:** DAO votes on fund allocation quarterly
- **Anti-manipulation:** Snapshot voting (prevents flash-loan governance attacks)
- **Reputation decay:** Inactive accounts lose moderation privileges over time
- **Slashing:** Bad-faith moderation or spam results in staked token slashing

---

## Journey Flows

### Flow 1: Meme Viral Loop
```
Visitor sees meme on Twitter
    → Clicks link to dshit.xyz/meme/{id}
    → Browses gallery (VISITOR)
    → Connects wallet to create meme (LURKER)
    → Buys $DSHIT to enter contest (NATIVE)
    → Wins contest, shares prize meme
    → New visitors arrive via shared meme
    → LOOP
```

### Flow 2: Commerce Loop
```
Visitor sees gag product listing
    → Browses catalog, sees $DSHIT pricing
    → Connects wallet (LURKER)
    → Adds items to cart
    → Buys $DSHIT on DEX
    → Completes purchase (NATIVE)
    → Receives confirmation + tracking
    → Shares reaction content
    → LOOP
```

### Flow 3: Governance Loop
```
Native sees community issue
    → Creates proposal (Whale tier)
    → Community debates in forum
    → Snapshot vote opens (token-weighted)
    → Quorum reached → executed by multi-sig
    → Results visible on-chain
    → Trust in system grows
    → More participation
    → LOOP
```

---

## Anonymous Identity Architecture

### Privacy Layers
```
Layer 0: Wallet address (pseudonymous by default)
Layer 1: World ID (proof of humanity, no PII exposed)
Layer 2: Lens profile (optional social graph)
Layer 3: Platform pseudonym (auto-generated, customizable)
```

### Self-Regulation via Identity
- One human = one World ID = one governance vote (prevents plutocracy)
- Token-weighted voting for treasury decisions (skin in the game)
- Hybrid model: humanity-check for moderation, token-weight for finance
- No KYC ever. No email required. Wallet + optional World ID only.

---

## Platform Self-Regulation Summary

| Mechanism | What It Regulates | How |
|-----------|-------------------|-----|
| Token staking | Spam & low-effort content | Stake to post/submit, slashed if flagged |
| Community flagging | Content quality | Stake-weighted flags trigger review |
| Snapshot voting | Governance & treasury | Token-weighted, sybil-resistant |
| Reputation score | Moderation power | Earned through positive contributions |
| Multi-sig council | Disputes & emergencies | Based-tier holders, elected quarterly |
| Rate limiting | API abuse | Progressive limits based on tier |
| Wallet reputation | Sybil attacks | On-chain history scoring |
| Decay mechanics | Inactive power hoarding | Use it or lose it |

---

*This document drives all product decisions. Every feature must map to a VLN phase and support the self-regulation framework.*
