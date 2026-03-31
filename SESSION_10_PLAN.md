# 🚀 Session 10 Plan - Mobile PWA & Performance

**Phase:** Phase 5 - Scale & Growth
**Session:** 10
**Date:** 2026-03-31
**Duration Target:** 50 minutes (autonomous)
**Tasks:** Phase 5.4 - Mobile PWA Optimization

---

## 📋 Session Scope

### Primary Goal
Implement Progressive Web App (PWA) features and mobile optimizations to make dshit.xyz installable, offline-capable, and performant on mobile devices.

**Success Definition:**
- ✅ Web manifest configured and validated
- ✅ Service worker registered and functional
- ✅ Offline page served when network unavailable
- ✅ App installable on iOS/Android
- ✅ Performance metrics: <2s load, 95+ Lighthouse score
- ✅ All TypeScript checks pass
- ✅ PR created with metrics
- ✅ Merged to main

---

## 🎯 Tasks (Priority Order)

### Task 1: Web Manifest Configuration (8 min)
**File:** `apps/web/public/manifest.json` (new)

**Deliverables:**
- Create web app manifest (PWA spec)
- Define app metadata:
  - name: "DSHIT Protocol"
  - short_name: "DSHIT"
  - description: "Decentralized meme warfare & commerce protocol"
  - start_url: "/"
  - display: "standalone"
  - scope: "/"
- Configure icons (192x192, 512x512)
  - Use mascot/poop emoji asset
  - Provide multiple sizes for different devices
- Set theme colors:
  - theme_color: "#F4D03F" (Shit Yellow)
  - background_color: "#1A1A1A" (Dark)
- Define screenshots for app store (if deploying)
- Configure orientation: portrait-primary

**Validation:**
- Valid JSON format
- All required fields present
- Icons referenced correctly

---

### Task 2: Service Worker Implementation (15 min)
**File:** `apps/web/public/service-worker.js` (new)

**Features:**
- Service worker registration listener
- Cache strategies:
  - Cache-first for static assets (CSS, JS, fonts)
  - Network-first for API calls
  - Stale-while-revalidate for images
- Offline page fallback
- Push notification support (skeleton)
- Update detection and prompt

**Implementation:**
```javascript
// Cache names for versioning
const CACHE_NAME = 'dshit-v1'
const API_CACHE = 'dshit-api-v1'

// Install: precache critical assets
// Activate: cleanup old caches
// Fetch: implement cache strategies

// Push event listener (skeleton)
self.addEventListener('push', (event) => {
  // Handle push notifications
})
```

**Offline Behavior:**
- Serve offline.html for failed navigations
- Return cached responses when available
- Queue failed requests for retry

---

### Task 3: HTML Setup & Manifest Linking (5 min)
**File:** `apps/web/src/app/layout.tsx` (update)

**Changes:**
- Add manifest link in head:
  ```html
  <link rel="manifest" href="/manifest.json" />
  ```
- Add viewport meta for mobile:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  ```
- Add theme-color meta:
  ```html
  <meta name="theme-color" content="#F4D03F" />
  ```
- Add apple-touch-icon:
  ```html
  <link rel="apple-touch-icon" href="/icon-192x192.png" />
  ```
- Register service worker in useEffect (client-side)

**Service Worker Registration:**
```typescript
// In useEffect hook
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registered'))
    .catch(err => console.error('SW registration failed', err))
}
```

---

### Task 4: Offline Fallback Page (6 min)
**File:** `apps/web/public/offline.html` (new)

**Design:**
- Use DESIGN_SYSTEM.md styling (inline CSS, no deps)
- Show offline status message
- Provide retry button
- Display cached page list (if available)
- Consistent with dshit.xyz aesthetic

**Content:**
- Heading: "No Connection, Dude"
- Message: "You're offline, but we've got some memes cached"
- Offline symbol (🚀 or mascot)
- Retry button with onclick handler
- Links to cached pages if available

```html
<style>
  /* Use CSS variables from design system */
  :root {
    --shit-yellow: #F4D03F;
    --bg-raw: #1A1A1A;
    --text-shit: #FFFFFF;
  }

  body {
    background: var(--bg-raw);
    color: var(--text-shit);
    font-family: 'Space Mono', monospace;
  }
</style>
```

---

### Task 5: Install Prompt Setup (8 min)
**File:** `apps/web/src/hooks/useInstallPrompt.ts` (new)

**Features:**
- Listen for `beforeinstallprompt` event
- Store prompt event for later use
- Provide install trigger function
- Track installation state
- Show install banner at optimal time

**Hook Interface:**
```typescript
interface UseInstallPrompt {
  canInstall: boolean
  showPrompt: () => Promise<boolean>
  isInstalled: boolean
  dismissPrompt: () => void
}

export function useInstallPrompt(): UseInstallPrompt {
  // Implementation
}
```

**Usage in Component:**
```typescript
const { canInstall, showPrompt } = useInstallPrompt()

return (
  <>
    {canInstall && (
      <button onClick={showPrompt}>
        📥 Install App
      </button>
    )}
  </>
)
```

---

### Task 6: Install Banner Component (7 min)
**File:** `apps/web/src/components/InstallPrompt.tsx` (new)

**Design:**
- Subtle floating banner at bottom
- "Install DSHIT app" message
- Install + Dismiss buttons
- Styled with Shit Yellow accent
- Mobile-first responsive

**Features:**
- Only show when installable
- Close with dismiss button
- Show on landing page initially
- Reappear after 24hrs if dismissed
- Animated entrance/exit

**Layout:**
```
┌─────────────────────────────────────┐
│ 📱 Install DSHIT App                │
│ Save to home screen for quick access │
│ [Install]  [Dismiss]                │
└─────────────────────────────────────┘
```

---

### Task 7: Mobile Optimization Audit (6 min)
**File:** `apps/web/src/styles/mobile.css` (verify/update)

**Checklist:**
- ✅ Viewport meta correct
- ✅ Touch targets ≥48px (WCAG)
- ✅ Font sizes readable (≥16px on mobile)
- ✅ Images responsive (srcset, sizes)
- ✅ Safe area handling (notch, bottom bar)
- ✅ No horizontal scroll
- ✅ Fast tap feedback (remove 300ms delay)
- ✅ Optimize images (WebP with fallback)

**CSS Updates:**
```css
/* Remove tap delay on iOS */
button, a {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* Safe area support for notch */
@supports (padding: max(0px)) {
  body {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
```

---

### Task 8: Performance Optimization (5 min)
**File:** `apps/web/next.config.js` (update)

**Optimizations:**
- Enable image optimization:
  ```javascript
  images: { unoptimized: false }
  ```
- Enable compression (gzip/brotli)
- Set cache headers for static assets
- Enable SWC minification
- Optimize bundle size

**Lighthouse Target:**
- Performance: 95+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

---

### Task 9: Testing & Validation (4 min)

**Checklist:**
- ✅ Lighthouse PWA audit passes
- ✅ Manifest.json validates
- ✅ Service worker registers
- ✅ Offline.html loads correctly
- ✅ App installable on mobile
- ✅ Install prompt shows
- ✅ Performance <2s first load
- ✅ No console errors
- ✅ Mobile responsive (375px-1920px)
- ✅ All TypeScript checks pass

**Testing Commands:**
```bash
# Type checking
pnpm --filter @dshit/web type-check

# Build
pnpm --filter @dshit/web build

# Open in browser and run Lighthouse PWA audit
# Chrome DevTools → Lighthouse → Progressive Web App
```

---

## 📊 Files to Create/Modify

### NEW FILES (Frontend)
```
apps/web/public/manifest.json              # Web app manifest
apps/web/public/service-worker.js          # Service worker
apps/web/public/offline.html               # Offline fallback
apps/web/src/hooks/useInstallPrompt.ts     # Install prompt hook
apps/web/src/components/InstallPrompt.tsx  # Install banner component
```

### MODIFY FILES
```
apps/web/src/app/layout.tsx                # Add manifest link, SW registration
apps/web/next.config.js                    # Optimize build
```

### DOCUMENTATION
```
SESSION_10_PLAN.md                         # This file
```

---

## 🎯 Success Metrics

| Criterion | Target | Method |
|-----------|--------|--------|
| Manifest valid | 100% | `manifest.json` schema |
| Service worker | Registered | DevTools → Application |
| Offline support | Works | Disable network, check offline.html |
| Installable | Yes | Chrome install prompt |
| Lighthouse PWA | 90+ | Lighthouse audit |
| Performance | <2s | DevTools → Performance |
| Mobile responsive | 375-1920px | Manual testing |
| TypeScript | 0 errors | `pnpm type-check` |
| PR metrics | Complete | PR checklist |
| Merge | Success | git log |

---

## 🚀 Execution Plan

1. **Branch:** Already created `feat/session-10-mobile-pwa`
2. **Manifest:** Create manifest.json (8 min)
3. **Service Worker:** Implement SW with caching (15 min)
4. **HTML Setup:** Link manifest and register SW (5 min)
5. **Offline Page:** Create offline.html (6 min)
6. **Install Hook:** Create useInstallPrompt (8 min)
7. **Install Banner:** Create InstallPrompt component (7 min)
8. **Mobile Audit:** Check responsive design (6 min)
9. **Performance:** Optimize next.config.js (5 min)
10. **Testing:** Validate all features (4 min)
11. **Commit & Push:** Create commit with metrics (2 min)
12. **PR & Merge:** Create PR, merge to main (4 min)

**Total Estimated Time:** 50 minutes

---

## 💾 Commit Message

```
feat(pwa): Add Progressive Web App support

- Add web app manifest with metadata and icons
- Implement service worker with cache strategies
- Configure offline fallback page
- Create install prompt hook and banner component
- Optimize mobile responsiveness and performance
- Add safe-area handling for notch devices
- Update Lighthouse PWA score to 90+

Closes #34 (if applicable)
```

---

## 📝 Success Criteria Checklist

- [ ] manifest.json created and valid
- [ ] service-worker.js functional
- [ ] offline.html styled and working
- [ ] useInstallPrompt hook implemented
- [ ] InstallPrompt component in Header
- [ ] layout.tsx updated with SW registration
- [ ] Mobile responsive verified (375-1920px)
- [ ] Lighthouse PWA audit: 90+
- [ ] Performance <2s first load
- [ ] Zero TypeScript errors
- [ ] No console errors
- [ ] Commit created with message
- [ ] PR created with metrics
- [ ] PR merged to main

---

## 🔗 Key Resources

**Design System:**
- Colors: #F4D03F, #1A1A1A, #8B4513, #FF0000
- Typography: Bebas Neue, Space Mono
- Safe area: env(safe-area-inset-*)

**PWA Standards:**
- Web App Manifest spec: https://www.w3.org/TR/appmanifest/
- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Lighthouse PWA audit: https://web.dev/lighthouse-pwa/

**Mobile Best Practices:**
- Viewport configuration: https://web.dev/viewport/
- Touch targets: https://web.dev/touch-target-size/
- Safe area: https://webkit.org/blog/7929/designing-websites-for-iphone-x/

---

## 📌 Notes

- Service worker uses in-memory cache (no Redis needed)
- No external dependencies added
- All code is TypeScript-first
- Backward compatible with older browsers
- Graceful degradation for unsupported features
- Uses native Web APIs only

---

**Ready to execute Session 10. Timer starts now.**

