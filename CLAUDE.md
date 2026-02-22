FIRST PRINCIPLES BABY

# Word Survivor

A typing-based roguelike survivor game. Type words to destroy enemies, collect items, level up, survive. Single HTML file, zero build step, zero framework.

## Quick Start

```bash
open index.html                    # Play
python3 -m http.server 8080       # PWA/SW needs a server
cd tests && npx playwright test   # Run tests
```

## Agent Rules

- **Git:** One agent per branch. Use `git worktree` for parallel work on different branches. NEVER have multiple agents share the same working directory.
- **Branches:** `master` (prod/GitHub Pages), feature branches off `master`
- **Source of truth:** Code in `index.html` is canonical. Docs may lag behind.
- **Tests:** `cd tests && npx playwright test` — uses `?test=1` to expose `window.__GAME__` API

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES6+, strict mode) |
| Rendering | Canvas 2D API |
| Styling | CSS Custom Properties (~3000 lines inline) |
| Audio | Web Audio API (procedural synthesis, no audio files) |
| Persistence | localStorage (JSON) |
| Offline | Service Worker + PWA manifest |
| External deps | Google Fonts (Courier Prime) + Lucide Icons (unpkg CDN) |
| Tests | Playwright (smoke, balance, items) |
| CI | GitHub Actions (push/PR to master) |
| Build system | None |
| Framework | None |

## Architecture

**The entire game is `index.html` (~10,600 lines).** Navigate by searching `[SEC:NAME]` markers.

### Section Map

| Section | Marker | Purpose |
|---|---|---|
| CSS | *(top of `<style>`)* | Design system variables, typography, components, modals |
| HTML | *(between `</style>` and `<script>`)* | Canvas, UI containers, modals |
| Config | `[SEC:CONFIG]` | Constants, DESIGN_TOKENS bridge |
| Canvas | `[SEC:CANVAS]` | Canvas/DPR setup |
| State | `[SEC:STATE]` | All mutable game state |
| Pools | `[SEC:POOLS]` | Pool class + 5 entity pools |
| Words | `[SEC:WORDS]` | Word lists by difficulty |
| Enemies | `[SEC:ENEMIES]` | 15 types, 7 behaviors, 8 elite mods |
| Items | `[SEC:ITEMS]` | 35 items, hooks, drops, synergies |
| Upgrades | `[SEC:UPGRADES]` | 10 upgrades, selection UI |
| Audio | `[SEC:AUDIO]` | Web Audio synthesis |
| White Space | `[SEC:WHITESPACE]` | Time-stop mechanic |
| Combat | `[SEC:COMBAT]` | Damage calc, projectiles, word completion |
| Damage | `[SEC:DAMAGE]` | Floating damage numbers |
| Input | `[SEC:INPUT]` | Keyboard, mouse, touch/mobile |
| Update | `[SEC:UPDATE]` | Entity updates, collision, physics |
| Literary Nuke | `[SEC:LITNUKE]` | 100-word screen nuke system |
| Render | `[SEC:RENDER]` | Canvas drawing, HUD |
| Game Loop | `[SEC:GAMELOOP]` | requestAnimationFrame loop |
| Management | `[SEC:MANAGEMENT]` | Waves, spawning, state transitions |
| Sharing | `[SEC:SHARING]` | Score sharing |
| Persistence | `[SEC:PERSISTENCE]` | localStorage save/load |
| UI | `[SEC:UI]` | Modal system |
| Debug | `[SEC:DEBUG]` | Practice mode, debug panel |
| Tips | `[SEC:TIPS]` | Tutorial tip system |
| Mob Tips | `[SEC:MOBTIPS]` | Enemy catalog UI |

Sub-sections: `[SEC:PARENT:CHILD]` (e.g., `[SEC:ITEMS:WHITE]`, `[SEC:ENEMIES:TYPES]`, `[SEC:INPUT:TOUCH]`).

### Core Game Loop

```
spawn enemies → type word → projectile → hit → kill → XP gem → level up → upgrade → every 3 kills pick item → repeat
```

### Game States

`menu` → `playing` ↔ `paused` / `upgrading` / `collecting` → `gameOver`

### Object Pools

5 pools (enemies: 100, projectiles: 50, gems: 200, particles: 500, damage numbers: 100). All use `Pool` class with acquire/release/releaseAll/forEach.

### Item Hook System

11 hooks: `onKeyPress`, `onWordComplete`, `onProjectileCreate`, `onProjectileHit`, `onProjectileUpdate`, `onEnemyKill`, `onDamageTaken`, `onDeath`, `onUpdate`, `onWaveStart`, `onWordAssign`. Register via `registerItemHook()`, dispatch via `callHooks()`.

## Documentation Map

| Topic | Location |
|---|---|
| Enemies, items, upgrades, mechanics | `docs/GAME_MECHANICS.md` |
| Design system | `STYLE_CONTEXT.md` |
| Bug catalog | `tests/bugs.md` |

## Active Bugs

| ID | Severity | Summary |
|---|---|---|
| BUG-003 | Low | Vowel Healing + Vowel Vampirism double-heal (likely intended) |
| BUG-008 | Minor | Critical Letter index edge case with Torn Page (very low probability) |
| BUG-010 | Cosmetic | Dead GOLD/ORANGE/LUNAR sound tiers; LEGENDARY falls through to WHITE |
| BUG-011 | Minor | Citation Needed spawns Footnotes instead of Mumbles (1-word fix in summoner behavior) |
| BUG-012 | Minor | `?test=1` blocked on mobile user agents — blocks CI mobile testing |
| SYNERGY-001 | Major | Pinball Wizard synergy detected but NO gameplay effect — `hasSynergy()` never called |
| itemDamageMultiplier | Medium | `callWordCompleteHooks` return uncapped (unlike damageMultiplier 10x, combo 5x) |

## Performance Constraints

- Target: 60 FPS
- Max entities: 100 enemies + 50 projectiles + 200 gems + 500 particles
- Input latency: <100ms
- File size: <350KB (currently ~331KB)

## Important Notes

- **Audio init:** Web Audio requires user gesture. `initAudio()` runs on game start.
- **Mobile:** Playable but not optimized.
- **Daily challenge:** Seeded random via `Math.random` override. Restores on game end.
- **Versioning:** Bump `sw.js` cache version when deploying changes.
- **Design tokens:** CSS is 99% tokenized. JS has 80+ hardcoded hex colors (tech debt).
