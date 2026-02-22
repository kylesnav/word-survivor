# Word Survivor: Complete Style Context

> **Purpose:** This document extracts all visual style information from the codebase so Claude can fully understand the game's aesthetic without reading the 9000+ line HTML file.

---

## Design Philosophy: "The Underwood"

**Core Principle:** Style the OUTPUT, not the machine.

Think: **typed manuscript on paper**, not physical typewriter keys.

- **Flat, inked impressions** — text stamped onto paper
- **Simple line borders** — like hand-drawn boxes on a manuscript
- **Minimal shadows** — only subtle paper offsets (4-6px), no 3D effects
- **Typography-first** — Courier Prime carries the personality
- **All Lucide icons** — no emojis anywhere in the UI

### What This Means

| Correct | Wrong |
|---------|-------|
| Paper with typed text | Physical buttons/keys |
| Ink stamps on paper | Raised/pressed elements |
| Flat offset shadows | Inset shadows, bevels |
| Manuscript aesthetic | Keyboard/machine aesthetic |

---

## Color Palette

### CSS Variables (`:root`)

```css
/* Primary Colors */
--paper: #f4f1e8;           /* Main background - warm cream */
--paper-dark: #e8dcc8;      /* Darker paper - time-stop bg, panels */
--ink: #1a1714;             /* Primary text/borders - warm black */
--ink-light: #3d3830;       /* Lighter ink - active states */

/* Accent Colors */
--ribbon-red: #c41e3a;      /* Primary accent - danger, typed text bleed */
--ribbon-red-light: #e63950; /* Lighter red - highlights */
--carbon-blue: #2d4a6f;     /* Secondary accent - XP, upgrades, links */
--aged-yellow: #d4a84b;     /* Tertiary accent - legendary, highlights */

/* Utility Colors */
--muted: #a89f91;           /* Disabled, hints, borders */
--muted-dark: #6d645a;      /* Darker muted - descriptions */

/* Tier Colors (Items) */
--tier-common: #6d645a;
--tier-common-border: #a89f91;
--tier-uncommon: #4a7c59;
--tier-uncommon-border: #5a9c6a;
--tier-rare: #c41e3a;        /* Same as ribbon-red */
--tier-rare-border: #e63950;
--tier-legendary: #d4a84b;   /* Same as aged-yellow */
--tier-legendary-border: #e8c060;
```

### Canvas Colors (JavaScript CONFIG.COLORS)

```javascript
COLORS: {
  BACKGROUND: '#f4f1e8',        // paper
  BACKGROUND_DARK: '#e8dcc8',   // paper-dark (time-stop)
  PLAYER: '#1a1714',            // ink
  ENEMY: '#1a1714',             // ink - standard enemies
  ENEMY_FAST: '#c41e3a',        // ribbon-red - fast enemies
  ENEMY_TARGET: '#c41e3a',      // ribbon-red - targeted
  PROJECTILE: '#2d4a6f',        // carbon-blue
  GEM: '#2d4a6f',               // carbon-blue
  GRID: 'rgba(26, 23, 20, 0.05)', // subtle ruled lines
  DAMAGE_NORMAL: '#1a1714',     // ink
  DAMAGE_CRIT: '#d4a84b',       // aged-yellow
  DAMAGE_PLAYER: '#c41e3a',     // ribbon-red
  DAMAGE_HEAL: '#2d4a6f',       // carbon-blue
  DAMAGE_XP: '#2d4a6f'          // carbon-blue
}
```

---

## Design Tokens

### Border Radius

```css
--radius-sm: 2px;   /* Bars, tags, small elements */
--radius-md: 4px;   /* Buttons, modals, cards */
--radius-lg: 6px;   /* Icons, avatar-like elements */
```

**Usage:**
- Health/XP bars: `--radius-sm` (2px)
- Buttons, modals, panels: `--radius-md` (4px)
- Icon containers, item slots: `--radius-lg` (6px)

### Shadows

```css
--shadow-sm: 2px 2px 0 rgba(0,0,0,0.1);  /* Small elements, hover */
--shadow-md: 4px 4px 0 rgba(0,0,0,0.1);  /* Cards, panels */
--shadow-lg: 6px 6px 0 rgba(0,0,0,0.1);  /* Modals, primary focus */
```

**Critical:** All shadows are **flat offset only** — no blur, no inset.

### Transitions

```css
--transition-fast: 0.1s ease-out;   /* Button presses */
--transition-medium: 0.15s ease;    /* Panel reveals */
--transition-slow: 0.25s ease;      /* Modal fades */
```

### Borders

```css
--border-ink: 2px solid var(--ink);
--border-muted: 1px solid var(--muted);
```

---

## Typography

### Font Stack

```css
font-family: 'Courier Prime', 'Courier New', Courier, monospace;
```

**Courier Prime** is loaded from Google Fonts and is the soul of the Underwood aesthetic.

### Text Styling Patterns

| Element | Size | Weight | Other |
|---------|------|--------|-------|
| H1 (titles) | clamp(32px, 8vw, 64px) | 700 | uppercase, letter-spacing: 0.1em |
| H2 (modals) | clamp(24px, 5vw, 36px) | 700 | uppercase, letter-spacing: 0.08em |
| Body | 14-18px | 400 | — |
| Buttons | 22px | 700 | uppercase, letter-spacing: 0.1em |
| Labels/tags | 10-12px | 700 | uppercase, letter-spacing: 0.05-0.15em |

### Word Display (Current Word Being Typed)

```css
.word-display {
  font-size: clamp(28px, 6vw, 56px);
  font-weight: 700;
  color: var(--muted);
  opacity: 0.5;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.typed {
  color: var(--ink);
  opacity: 1;
  text-shadow: 1px 1px 0 var(--ribbon-red); /* Ribbon bleed effect */
}
```

### Cursor

```css
.word-display::after {
  content: '';
  width: 3px;
  height: 0.9em;
  background: var(--ink);
  animation: cursor-blink 0.8s step-end infinite;
}
```

---

## Paper Texture

### Noise Overlay (body::before)

```css
body::before {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,...fractalNoise...");
}
```

**3% opacity SVG noise** over the entire page creates paper texture.

### Vignette (body::after)

```css
body::after {
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(26, 23, 20, 0.15) 100%);
}
```

---

## Component Patterns

### Buttons

```css
.btn {
  background: var(--paper);
  border: 2px solid var(--ink);
  padding: 14px 36px;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: background 0.1s, color 0.1s;
}

.btn:hover {
  background: var(--ink);
  color: var(--paper);
}
```

**Key:** Hover inverts colors (ink bg, paper text). No gradients, no inset shadows.

### Modals

```css
.modal {
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 4px;
  padding: 30px;
  box-shadow: 6px 6px 0 rgba(0,0,0,0.1);
}
```

### Panels/Cards

```css
.card {
  background: var(--paper-dark);
  border: 1px solid var(--muted);
  border-radius: 4px;
  padding: 15-20px;
}

.card:hover {
  border-color: var(--ink);
  background: rgba(232, 220, 200, 0.5);
}
```

### Item Slots

```css
.item-slot {
  width: 44px;
  height: 44px;
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 4px;
}

/* Tier-specific borders */
.item-slot[data-tier="WHITE"] { border-color: var(--muted); }
.item-slot[data-tier="GREEN"] { border-color: var(--tier-uncommon-border); }
.item-slot[data-tier="RED"] { border-color: var(--ribbon-red); }
.item-slot[data-tier="LEGENDARY"] {
  border-color: var(--aged-yellow);
  border-width: 3px;
}
```

### Health Bar

```css
.health-bar {
  background: var(--paper-dark);
  border: 2px solid var(--ink);
  border-radius: 2px;
}

.health-bar-fill {
  background: repeating-linear-gradient(
    90deg,
    var(--ribbon-red) 0px,
    var(--ribbon-red) 6px,
    var(--ribbon-red-light) 6px,
    var(--ribbon-red-light) 8px
  );
}
```

**Note:** Ribbon texture via repeating gradient. No highlight overlay.

### XP Bar

```css
.xp-bar {
  background: var(--paper-dark);
  border: 1px solid var(--muted);
  border-radius: 2px;
}

.xp-bar-fill {
  background: var(--carbon-blue);
}
```

### Tabs

```css
.tab-btn {
  background: transparent;
  border: 1px solid var(--muted);
  color: var(--muted-dark);
  border-radius: 2px;
}

.tab-btn.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}
```

### Scrollbars

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--paper-dark); border-radius: 2px; }
::-webkit-scrollbar-thumb {
  background: var(--muted);
  border-radius: 2px;
  border: 1px solid var(--paper-dark);
}
::-webkit-scrollbar-thumb:hover { background: var(--ink-light); }
```

---

## Canvas Rendering

### Background

```javascript
// Lerp from paper to paper-dark during time-stop
const bgR = Math.round(244 - (12 * whiteSpaceAlpha));
const bgG = Math.round(241 - (21 * whiteSpaceAlpha));
const bgB = Math.round(232 - (32 * whiteSpaceAlpha));
ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
```

### Ruled Paper Lines

```javascript
// Horizontal lines like notebook paper
ctx.strokeStyle = CONFIG.COLORS.GRID; // rgba(26, 23, 20, 0.05)
const lineSpacing = 32;
for (let y = lineSpacing; y < canvasHeight; y += lineSpacing) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(canvasWidth, y);
  ctx.stroke();
}

// Left margin line in subtle ribbon-red
ctx.strokeStyle = 'rgba(196, 30, 58, 0.08)';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(60, 0);
ctx.lineTo(60, canvasHeight);
ctx.stroke();
```

### Player

```javascript
// Flat rounded rectangle
const playerSize = player.radius * 2;
const playerCorner = 6;
ctx.fillStyle = CONFIG.COLORS.PLAYER; // ink
ctx.roundRect(player.x - playerSize/2, player.y - playerSize/2, playerSize, playerSize, playerCorner);
ctx.fill();

// Time-stop glow (aged-yellow border)
if (whiteSpaceAlpha > 0) {
  ctx.strokeStyle = `rgba(212, 168, 75, ${0.6 * whiteSpaceAlpha})`;
  ctx.lineWidth = 3;
  ctx.stroke();
}
```

### Enemies

```javascript
const size = drawRadius * 1.8;
const cornerRadius = Math.min(6, size * 0.15);

// Time-stop effect
if (whiteSpaceAlpha > 0) {
  ctx.globalAlpha = (e.invisibility ?? 1) * (1 - 0.3 * whiteSpaceAlpha);
  ctx.filter = `grayscale(${0.3 * whiteSpaceAlpha})`;

  // Carbon-blue offset shadow
  ctx.fillStyle = `rgba(45, 74, 111, ${0.4 * whiteSpaceAlpha})`;
  ctx.roundRect(e.x - size/2 + 3, e.y + floatY - size/2 + 3, size, size, cornerRadius);
  ctx.fill();
}

// Targeted enemy glow
if (isTarget) {
  ctx.fillStyle = 'rgba(196, 30, 58, 0.25)';
  ctx.roundRect(/* slightly larger */);
  ctx.fill();
}

// Body - flat rounded rectangle
ctx.fillStyle = enemyColor; // ink or ribbon-red
ctx.roundRect(e.x - size/2, e.y + floatY - size/2, size, size, cornerRadius);
ctx.fill();

// Health bar
ctx.fillStyle = 'rgba(26, 23, 20, 0.4)';
ctx.fillRect(/* background */);
ctx.fillStyle = '#4a7c59'; // tier-uncommon green
ctx.fillRect(/* fill */);
```

### Gems & Projectiles

```javascript
// Simple filled circles - no glow
ctx.fillStyle = CONFIG.COLORS.GEM; // carbon-blue
ctx.beginPath();
ctx.arc(g.x, g.y, r, 0, Math.PI * 2);
ctx.fill();
```

### Damage Numbers

```javascript
// White shadow for readability
ctx.fillStyle = 'rgba(244, 241, 232, 0.8)';
ctx.fillText(text, x + 1, y + 1);

// Main text in palette colors
ctx.fillStyle = DN_COLORS[type]; // ink, aged-yellow, ribbon-red, or carbon-blue
ctx.fillText(text, x, y);

// Slight rotation for stamped feel
ctx.rotate(-0.05);
```

---

## Animations

### Core Animations

| Animation | Duration | Easing | Purpose |
|-----------|----------|--------|---------|
| cursor-blink | 0.8s | step-end | Typing cursor |
| letter-stamp | 0.08s | ease-out | Character typed |
| shake | 0.1s | ease-in-out | Wrong key |
| pulse | 1-1.5s | ease-in-out | Attention |
| tipFadeIn | 0.25s | ease-out | Modal appear |
| mobTipSlideIn | 0.3s | ease-out | Corner tip slide |
| itemPopIn | 0.3s | ease-out | Item pickup |

### Letter Stamp

```css
@keyframes letter-stamp {
  0% { opacity: 0; transform: translateY(-8px); filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
```

### Shake (Wrong Key)

```css
@keyframes shake {
  0%, 100% { transform: translateX(-50%); }
  25% { transform: translateX(calc(-50% - 5px)); }
  75% { transform: translateX(calc(-50% + 5px)); }
}
```

---

## Enemy Type Text Styles

Each enemy type has unique word display styling:

| Type | Visual Effect |
|------|---------------|
| mumble | (default) |
| stutter | letter-spacing: 0.3em, micro-shake animation |
| whisper | opacity: 0.15, blur(1px), font-weight: 400 |
| shout | HUGE size, ribbon-red, bold shadow, pulse animation |
| footnote | italic, tier-uncommon green, small superscript prefix |
| slur | blur(1.5px), double text-shadow |
| jargon | serif font, « » decorators |
| palindrome | carbon-blue, flipping animation |
| echo | cascading carbon-blue shadows |
| typo | aged-yellow, glitch animation |
| censor | ink background, revealed letters in green |
| quote | serif italic, quotation marks |
| thesis | serif bold, ribbon-red, uppercase |
| citation_needed | [citation needed] superscript suffix |
| misspelling | wavy red underline |

---

## Elite Modifier Text Styles

| Modifier | Visual Effect |
|----------|---------------|
| bold | font-weight: 900, HUGE size, thick stroke |
| italic | skewX(-15deg), carbon-blue |
| underlined | 4px aged-yellow underline |
| strikethrough | ribbon-red line-through, dimmed |
| superscript | tiny, positioned high, floats up |
| subscript | tiny, positioned low, floats down |
| highlighted | aged-yellow background gradient |
| hyperlinked | carbon-blue underline, glowing animation |

---

## Screens & Modals

### Main Menu
- Centered `.menu` panel
- H1 title in ink, uppercase
- Tagline in muted-dark
- Large "PLAY" button
- Icon buttons for How to Play, Collection

### Pause Menu
- Same `.menu` styling
- "PAUSED" title
- Resume/Exit buttons

### Game Over
- Final stats panel with paper-dark background
- Share result box
- Play Again / Menu buttons

### How to Play Modal
- 3-column mechanics grid
- Icon cards with paper-dark bg
- Special highlight card for "White Space" (aged-yellow border)

### Collection Modal
- Tab navigation (Items, Upgrades, Enemies)
- Tier filter buttons
- Scrollable list with item/upgrade/enemy entries
- Icon + name + description layout

### Upgrade Selection
- Vertical stack of upgrade buttons
- Carbon-blue accent borders
- Hover reveals paper background

### Item Selection (Replacement)
- Similar to upgrades
- Tier-colored borders
- Stack count if applicable

### Tip Modal (Tutorial)
- Narrator section with icon and quote
- Practical tips section with carbon-blue title
- Item showcase when relevant
- Dismiss button

### Mob Tip (Non-blocking)
- Slides in from right
- 280px wide corner panel
- Auto-dismisses with fade-out animation

---

## Icons

**All icons use Lucide** (loaded from unpkg CDN).

```html
<i data-lucide="icon-name"></i>
```

```css
[data-lucide] {
  width: 1em;
  height: 1em;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}
```

Common icons:
- `help-circle` — How to Play
- `book-open` — Collection
- `pause` — Pause/Time-stop
- `zap` — Damage/Speed
- `shield` — Defense
- `heart` — Health
- `target` — Targeting
- `award` — Achievements

**No emojis** in any UI elements.

---

## Responsive Breakpoints

| Breakpoint | Adjustments |
|------------|-------------|
| max-height: 500px | Mobile keyboard compensation |
| max-width: 700px | Modal width 95vw, grid 2-col |
| max-width: 480px | Grid 1-col, smaller buttons/icons |

---

## Summary: The Underwood Checklist

When implementing new UI:

1. **Background:** `var(--paper)` or `var(--paper-dark)`
2. **Text:** `var(--ink)` primary, `var(--muted-dark)` secondary
3. **Borders:** 2px solid `var(--ink)` for primary, 1px `var(--muted)` for secondary
4. **Radius:** 2px (bars), 4px (buttons/modals), 6px (icons)
5. **Shadow:** Flat offset only — `4px 4px 0 rgba(0,0,0,0.1)`
6. **Font:** Courier Prime, uppercase for labels/buttons
7. **Hover:** Invert colors (ink bg, paper text)
8. **Icons:** Lucide only, no emojis
9. **Accents:** ribbon-red (danger), carbon-blue (info/XP), aged-yellow (special)

**Final test:** Does this look like typed text on paper, or a physical machine?
