# 💩 PROTOCOL - Design System

**"Really Shitty" Aesthetic Protocol** - Brutalist Web3 meets street art meets meme culture.

---

## 🎨 Visual Philosophy

**The Art of Being Bad:**
- Raw, unpolished, intentionally messy
- No filters, no polish, maximum impact
- Industrial, chaotic, aggressive
- "Good enough" is the goal
- Ugly is beautiful

---

## 🖌 Color Palette

### Primary Colors
- **Shit Yellow:** `#F4D03F` - Primary action, highlights, text emphasis
- **Shit Brown:** `#8B4513` - Secondary, shadows, accents
- **Shit Brown Light:** `#A0522D` - Tertiary variation
- **Shit Dark:** `#3D1A00` - Deep shadows

### Secondary Colors
- **Glitch Red:** `#FF0000` - Alerts, errors, warnings
- **Toxic Green:** `#39FF14` - Success, positive signals
- **Cyberpunk Purple:** `#BF00FF` - Accents, special elements
- **Industrial Orange:** `#FF6600` - Callouts, secondary accents

### Background Colors
- **BG Raw:** `#1A1A1A` - Primary background
- **BG Dirty:** `#2D2D2D` - Secondary background
- **BG Waste:** `#3D3D3D` - Tertiary background
- **BG Base:** `#0a0500` - Navigation/footer base

---

## 📝 Typography

### Font Stack

```css
--font-display: 'Bebas Neue', sans-serif;     /* Bold, uppercase, headlines */
--font-body: 'Space Mono', monospace;          /* Readable, technical feel */
--font-accent: 'Permanent Marker', cursive;    /* Handwritten, chaotic */
```

### Font Sizes

- **H1:** `clamp(4rem, 11vw, 8rem)` - Massive hero text
- **H2:** `clamp(2rem, 6vw, 4rem)` - Section headers
- **H3:** `clamp(1.5rem, 4vw, 3rem)` - Subsection headers
- **Body:** `1rem` - Regular text
- **Small:** `0.875rem` - Secondary text
- **Tiny:** `0.6rem` - Labels, metadata

### Font Weights

- **Bold:** `700`
- **Normal:** `400`
- **Light:** `300`

---

## 🧩 Component Library

### Navigation Bar (`.nav`)
- Background: `#0a0500` (black)
- Border: `4px solid var(--shit-yellow)`
- Flexbox layout
- Logo uses display font with text shadow
- Links are small caps, uppercase
- Live pill indicator blinks (red)

### Hero Section (`.hero`)
- Radial gradient background
- 56px padding top/bottom, 24px sides
- Border-bottom: `4px solid var(--shit-yellow)`
- **Eyebrow:** Orange, handwritten, rotated
- **H1:** Display font, huge, yellow with brown shadow
- **Subtext:** Small, muted, left border accent
- **CTA Buttons:** Yellow primary, ghost secondary
- **SVG Stink Lines:** Wavy lines with STENCH/AROMA text

### Ticker (`.ticker`)
- Brown background
- Infinite horizontal scroll animation
- Display font, uppercase, spaced

### Stats Grid (`.stats`)
- 4-column grid (responsive to 2 on mobile)
- Each stat has top color bar
- Bold number, small label
- Sub-stat in green/orange

### Alert Section (`.alert`)
- Dark red background
- Red left border (6px)
- Red tag with white text
- Light red message text

### Drops Grid (`.drops-grid`)
- 3-column grid (responsive to 1 on mobile)
- Large card (span 2 columns)
- Cards have hover effect: yellow border, transform, shadow
- Tag badges (6 color variations)
- Poop emoji watermark

### Flush Meter (`.meter-section`)
- Dark background with brown border and shadow
- "💩 FLUSH STATUS" label above
- 3-column grid of metrics
- Progress bars with color indicators
- Large bold values

### Newsletter (`.nl`)
- Brown gradient background
- Yellow border and shadow
- 2-column layout (responsive to 1)
- Email input + button row
- Feature list with icons

### Community Section (`.community`)
- 4-column grid (responsive to 2)
- Card hover effect (border color + transform)
- Icon, name, count

### Footer (`.footer`)
- 4-column grid (responsive to 2)
- Brand section with shadow text
- Link columns
- Bottom bar with copyright and tagline

---

## ✨ Effects & Animations

### Glitch Effect (`.glitch-text`)
```css
@keyframes shit-glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  /* ... offsets at different intervals ... */
  100% { transform: translate(0); }
}
```
- Creates digital corruption look
- Red and purple pseudo-elements
- Clip-path animations

### Blink Animation (`.live-pill`)
```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```
- 1.2s step-end timing

### Shake Animation (`.shit-shake`)
```css
@keyframes shit-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
```

### Pulse Animation (`.shit-pulse`)
```css
@keyframes shit-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```
- 0.2s infinite

### Scroll Animation (`.ticker-inner`)
```css
@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```
- 20s linear infinite

---

## 🎯 Design Patterns

### Brutalist Borders
- Thick borders (2-4px)
- Yellow, brown, or waste-colored
- Box shadows for depth
- Hover transforms: translate(-2px, -2px)

### Industrial Patterns
- Diagonal repeating stripes
- Warning stripe pattern (yellow/dark stripes)
- Worn effects with grayscale + contrast filters

### Crude Styling
- Clip-path for dirty edges
- Slight rotations (-1deg)
- Intentional skew
- Distortion filters

### Hover States
- Border color change (→ yellow)
- Small translate transforms (-2px, -2px)
- Shadow expansion
- Color transitions (0.15s)

---

## 📱 Responsive Design

**Breakpoint: 700px**

### Mobile Changes
- Stats grid: 4 columns → 2 columns
- Drops grid: 3 columns → 1 column
- Large drops lose span: 2 → 1
- Newsletter: 2 columns → 1 column
- Meter grid: 3 columns → 1 column
- Community grid: 4 columns → 2 columns
- Footer: 4 columns → 2 columns
- Nav links: hidden on mobile

---

## 🎬 Component Showcase

### Reference Implementation
See `shitcoin_protocol_v2_poopy.html` for complete working examples of all components.

### Key Implementation Files
- **Colors:** CSS custom properties (`:root`)
- **Typography:** Google Fonts imports + custom sizes
- **Animations:** @keyframes definitions
- **Layout:** CSS Grid + Flexbox
- **Effects:** Filters, clip-path, transforms

---

## 🚀 Usage Guidelines

1. **Color Variables:** Always use CSS custom properties from `:root`
2. **Typography:** Use semantic HTML with appropriate font families
3. **Spacing:** Use consistent 4px/8px/16px/24px/32px units
4. **Shadows:** Match brown shadow color to elements
5. **Animations:** Keep durations short (0.2s - 0.3s) for snappy feel
6. **Responsiveness:** Always check 700px breakpoint behavior

---

## 📊 Design Stats

- **Color Palette:** 10+ primary colors
- **Font Families:** 3 Google Fonts
- **Animations:** 6+ keyframe animations
- **Components:** 10+ major components
- **Responsive:** Mobile-first (700px breakpoint)
- **Aesthetic:** Brutalist, intentionally unpolished

---

*Ugly is beautiful. The dump is the way.*
