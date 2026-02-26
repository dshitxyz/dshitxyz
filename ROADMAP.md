# DSHIT Autonomous Development Roadmap

**Fully autonomous execution plan with human checkpoints at phase boundaries.**

Each phase is self-contained and deployable. No phase depends on future work — ship early, iterate always.

---

## Roadmap Overview

```
PHASE 0 ──▶ PHASE 1 ──▶ PHASE 2 ──▶ PHASE 3 ──▶ PHASE 4 ──▶ PHASE 5
Foundation   Token       Frontend    Commerce    Governance  Scale
(Scaffold)   (Contract)  (dshit.xyz) (Meme Shop) (DAO)       (Growth)
```

| Phase | Name | VLN Target | Autonomous? | Human Checkpoint |
|-------|------|-----------|-------------|------------------|
| 0 | Foundation | — | Yes | Review scaffold |
| 1 | Token | Visitor | Yes | Review before deploy |
| 2 | Frontend | Visitor → Lurker | Yes | Review before launch |
| 3 | Commerce & Memes | Lurker → Native | Yes | Review before payments go live |
| 4 | Governance | Native | Yes | Review before DAO activation |
| 5 | Scale | All | Yes | Review growth strategy |

---

## PHASE 0: Foundation

**Goal:** Monorepo scaffold, tooling, CI/CD — everything needed to move fast.

### Tasks

- [ ] **0.1** Initialize pnpm monorepo with workspace config
- [ ] **0.2** Create `apps/web` — Next.js 14 + TypeScript + Tailwind
- [ ] **0.3** Create `apps/api` — Fastify + TypeScript + PostgreSQL (Drizzle ORM)
- [ ] **0.4** Create `packages/contracts` — Hardhat + Solidity + OpenZeppelin
- [ ] **0.5** Create `packages/ui` — Shared React component library
- [ ] **0.6** Create `packages/config` — Shared tsconfig, ESLint, Prettier
- [ ] **0.7** Set up GitHub Actions CI — lint, typecheck, test, build
- [ ] **0.8** Configure environment management (.env.example, dotenv)
- [ ] **0.9** Set up Husky + lint-staged for pre-commit hooks
- [ ] **0.10** Docker Compose for local PostgreSQL + API dev

### Deliverables
- Running `pnpm dev` starts web + api
- Running `pnpm test` runs all test suites
- CI passes on every PR
- Zero config needed for new contributors

### Exit Criteria
Human reviews scaffold structure before Phase 1 begins.

---

## PHASE 1: Token ($DSHIT)

**Goal:** Deploy a production-grade ERC-20 on Base with full test coverage.

### Tasks

- [ ] **1.1** Write DSHIT.sol — ERC-20 with:
  - 1B fixed supply, no mint after deploy
  - 5% transfer tax (configurable by owner)
  - Tax recipient address (treasury)
  - Pausable (emergency circuit breaker)
  - Snapshot (for governance votes)
  - Burnable
  - ReentrancyGuard on all state-changing externals
- [ ] **1.2** Write comprehensive test suite (Hardhat + Chai)
  - Deploy & initial state
  - Transfer tax calculations
  - Pause/unpause behavior
  - Snapshot creation & querying
  - Burn mechanics
  - Access control (owner-only functions)
  - Edge cases (zero transfers, self-transfers, max uint)
- [ ] **1.3** Write deployment script for Base mainnet
- [ ] **1.4** Write deployment script for Base Sepolia testnet
- [ ] **1.5** Gas optimization audit (storage packing, minimal proxy if needed)
- [ ] **1.6** Generate contract ABI + TypeScript types (typechain)
- [ ] **1.7** Set up Etherscan/Basescan verification script
- [ ] **1.8** Document token mechanics in `docs/TOKEN.md`

### Deliverables
- Contract deployed to Base Sepolia with passing tests
- ABI + types exported to `packages/contracts/typechain`
- All tests green, >95% branch coverage

### Exit Criteria
Human reviews contract + tests before mainnet deployment.

---

## PHASE 2: Frontend (dshit.xyz)

**Goal:** Ship the brutalist landing page + core browsing experience. Converts Visitors to Lurkers.

### Tasks

- [ ] **2.1** Implement global styles from CLAUDE.md styling system
  - CSS custom properties (full color palette)
  - Typography (Bebas Neue, Space Mono, Permanent Marker)
  - Glitch animations, brutalist borders, industrial patterns
  - Responsive breakpoints (mobile-first)
- [ ] **2.2** Landing page (hero)
  - Glitch title animation
  - Live $DSHIT price ticker (DEX API or on-chain)
  - Meme carousel (top community memes)
  - "Connect Wallet" CTA (RainbowKit / ConnectKit)
  - Tokenomics summary
- [ ] **2.3** Wallet integration
  - RainbowKit or ConnectKit setup
  - Base chain auto-switch
  - Session persistence
  - Balance display ($DSHIT + ETH)
- [ ] **2.4** Meme gallery page
  - Grid layout with lazy loading
  - Sort: trending / newest / most viral
  - Upvote/downvote (wallet-connected users only)
  - Share buttons (Twitter, Telegram, copy link)
- [ ] **2.5** Token info page
  - Embedded DEXScreener or GeckoTerminal chart
  - Supply stats, holder count, market cap
  - "Buy $DSHIT" link to Uniswap/Aerodrome on Base
- [ ] **2.6** Product catalog page (browse-only for now)
  - Grid of gag/novelty products
  - $DSHIT pricing displayed
  - Product detail modal
- [ ] **2.7** Anonymous profile system
  - Auto-generated pseudonym on wallet connect
  - Auto-generated avatar (blocky/pixel style)
  - Optional World ID verification badge
- [ ] **2.8** Navigation + layout
  - Header: logo, nav links, wallet button, $DSHIT balance
  - Footer: socials, contract address, legal
  - Mobile hamburger menu
- [ ] **2.9** SEO + meta tags + OG images
- [ ] **2.10** Analytics integration (privacy-respecting: Plausible or Fathom)

### Deliverables
- dshit.xyz live with landing, gallery, catalog, token pages
- Wallet connect working on Base
- Mobile responsive, <3s load time
- Analytics tracking visitor → lurker conversion

### Exit Criteria
Human reviews frontend before public launch.

---

## PHASE 3: Commerce & Meme Engine

**Goal:** Enable purchases and meme creation. Converts Lurkers to Natives.

### Tasks

#### Commerce
- [ ] **3.1** Shopping cart system (client-side state + API persistence)
- [ ] **3.2** $DSHIT checkout flow
  - Token approval → transfer to treasury
  - Order confirmation on-chain (tx hash as receipt)
  - Email-free: order status via wallet-connected dashboard
- [ ] **3.3** Product management API (admin-only CRUD)
- [ ] **3.4** Order management API + fulfillment status
- [ ] **3.5** Anonymous shipping
  - Recipient address encrypted client-side
  - Fulfillment partner integration (API TBD)
  - No sender info on package
- [ ] **3.6** Product submission system (Degen tier+)
  - Submit product idea → community vote
  - Approved products added to catalog
  - Submitter earns % of sales

#### Meme Engine
- [ ] **3.7** Meme creation tool
  - Template library (community-curated)
  - Text overlay editor (fonts from style system)
  - Upload custom images
  - Export as PNG/GIF
- [ ] **3.8** Meme contests (weekly)
  - Stake $DSHIT to enter
  - Community voting (token-weighted)
  - Prize pool from treasury
  - Winners featured on landing page
- [ ] **3.9** Meme NFT minting (optional)
  - Mint your meme as NFT on Base
  - Low cost (Base L2 fees)
  - Creator royalties on secondary sales
- [ ] **3.10** Viral sharing engine
  - Auto-generate OG images for shared memes
  - Referral tracking (share link → track conversions)
  - Leaderboard: top creators, top viral memes

### Deliverables
- Working checkout with $DSHIT payments
- Meme creation tool live
- Weekly contest system operational
- Referral tracking active

### Exit Criteria
Human reviews payment flow before going live with real money.

---

## PHASE 4: Governance (DAO)

**Goal:** Hand control to the community. Platform becomes self-regulating.

### Tasks

- [ ] **4.1** Governance contract (Governor + Timelock)
  - Based on OpenZeppelin Governor
  - Token-weighted voting
  - Snapshot-based (anti-flash-loan)
  - Proposal threshold: Whale tier (100k DSHIT)
  - Quorum: 10% of circulating supply
  - Voting period: 3 days
  - Timelock: 24 hours
- [ ] **4.2** Proposal UI
  - Create proposal (Whale+)
  - Vote interface (all token holders)
  - Proposal detail page (description, votes, timeline)
  - Execution status tracking
- [ ] **4.3** Content moderation system
  - Stake-weighted flagging
  - Community review queue (reputation-gated)
  - Slashing for bad-faith flags
  - Appeal process via governance vote
- [ ] **4.4** Treasury dashboard
  - On-chain treasury balance
  - Historical inflows/outflows
  - Allocation proposals + voting
- [ ] **4.5** Staking system
  - Stake $DSHIT → governance power multiplier
  - Lock periods: 30d (1x), 90d (1.5x), 180d (2x)
  - Unstake with cooldown period
- [ ] **4.6** Reputation system
  - Score based on: governance participation, moderation accuracy, content quality
  - Decay over inactivity (use it or lose it)
  - Reputation gates: mod powers, proposal creation
- [ ] **4.7** Multi-sig council setup
  - Based tier holders eligible
  - Elected quarterly via governance vote
  - 3-of-5 multi-sig for emergency actions
  - Transparent on-chain execution
- [ ] **4.8** World ID integration for humanity-gated votes
  - One human = one vote on moderation decisions
  - Prevents whale domination of content policy

### Deliverables
- Governance contract deployed
- Proposal + voting UI live
- Staking operational
- Content moderation community-run
- Multi-sig council elected

### Exit Criteria
Human reviews governance contracts + parameters before DAO activation.

---

## PHASE 5: Scale & Growth

**Goal:** Grow the ecosystem. More users, more memes, more volume.

### Tasks

- [ ] **5.1** Telegram bot
  - Price alerts
  - Meme submissions from Telegram
  - Order notifications
  - Governance vote reminders
- [ ] **5.2** Discord bot
  - Meme contest announcements
  - Governance notifications
  - Holder verification (token-gated roles)
- [ ] **5.3** API public endpoints
  - Meme gallery API (for third-party integrations)
  - Token stats API
  - Leaderboard API
- [ ] **5.4** Mobile optimization
  - PWA support (installable)
  - Push notifications (governance, orders, contests)
- [ ] **5.5** Partnership integrations
  - Other memecoins (cross-promotion)
  - Base ecosystem projects
  - Meme aggregators
- [ ] **5.6** Advanced analytics dashboard
  - VLN funnel tracking
  - Token holder demographics (on-chain)
  - Commerce metrics
  - Governance health metrics
- [ ] **5.7** Internationalization (i18n)
  - Multi-language support
  - Community-driven translations
- [ ] **5.8** Performance hardening
  - CDN for static assets
  - Edge caching for API responses
  - Database query optimization
  - Load testing (target: 10k concurrent users)

### Deliverables
- Bots live on Telegram + Discord
- Public API documented
- PWA installable
- Performance benchmarks met

### Exit Criteria
Human reviews growth metrics and strategy before scaling spend.

---

## Autonomous Execution Protocol

### How This Roadmap Runs Itself

1. **Each phase is a sprint.** Work proceeds autonomously within a phase.
2. **Human checkpoints at phase boundaries.** No phase ships to production without human review.
3. **Tests are the gatekeeper.** If tests pass, the code is shippable. If tests fail, fix before proceeding.
4. **CI/CD enforces quality.** Every commit is linted, typechecked, and tested automatically.
5. **Documentation is code.** Every feature has corresponding docs. No undocumented features.

### Decision Framework (Autonomous)

When a decision needs to be made during autonomous execution:

| Decision Type | Action |
|--------------|--------|
| Implementation detail | Choose simplest working solution |
| Library choice | Prefer popular, well-maintained, minimal deps |
| Architecture | Follow patterns already established in codebase |
| Security concern | Always choose the safer option, flag for human review |
| Scope creep | Defer to backlog, don't add unrequested features |
| Ambiguity | Check VLN user journey map, choose what serves the user journey |

### Commit Convention

```
type(scope): short description

- feat: new feature
- fix: bug fix
- refactor: code restructure
- test: test additions/changes
- docs: documentation
- chore: tooling, deps, CI
- style: formatting, CSS

Example: feat(web): add glitch animation to hero title
```

---

*This roadmap is a living document. It evolves as the project evolves. But Phase 0 starts now.*
