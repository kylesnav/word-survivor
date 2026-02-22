# Word Survivor -- Game Mechanics Reference

Everything you need to know about how Word Survivor works.

---

## How to Play

Type words to destroy enemies. Move the mouse to freeze time and reposition. Survive as long as you can, level up, and collect items.

---

## Enemies

Enemies spawn from screen edges and walk toward you. Each carries a word -- type it to fire a projectile that damages them.

### Enemy Types (15)

| Enemy | Appears | Description |
|---|---|---|
| **Mumble** | Wave 1 | Standard enemy. Walks straight at you. The bread and butter. |
| **Stutter** | Wave 2 | Stops and starts unpredictably. Hard to judge distance. |
| **Footnote** | Wave 2 | A whole sentence split into small, fast enemies. They wobble. |
| **Whisper** | Wave 3 | Nearly invisible until very close (150px). Spooky. |
| **Shout** | Wave 4 | Winds up, then charges at triple speed for 1 second. |
| **Echo** | Wave 5 | Copies the word of the last enemy you killed. |
| **Slur** | Wave 5 | Carries medium-difficulty words. Tanky and slow. |
| **Typo** | Wave 6 | Its word scrambles every 2.5 seconds. Keep up or lose progress. |
| **Jargon** | Wave 6 | Tank with hard words only. Very slow, very beefy (2.5x HP). |
| **Palindrome** | Wave 7 | Splits into 2 Mumbles when killed. Double the trouble. |
| **Censor** | Wave 8 | Dark, slow tank. 1.8x HP. Menacing presence. |
| **Misspelling** | Wave 8 | Carries intentionally misspelled words. Your brain will fight you. |
| **Citation Needed** | Wave 10 | Summons up to 6 Mumbles every 3 seconds. Kill it fast. |
| **Quote** | Wave 10 | Carries multi-word quote phrases. Slow but wordy. |
| **Thesis** | Wave 12 | Boss-tier. 5x HP, hard words, glacially slow. A real test. |

### Elite Modifiers (8)

Starting wave 3, enemies can spawn as Elites with special properties:

| Modifier | Wave | Effect |
|---|---|---|
| **Bold** | 3+ | Double HP, 30% larger |
| **Italic** | 3+ | Double speed, tilted |
| **Underlined** | 3+ | Leaves trail particles, yellow underline |
| **Strikethrough** | 5+ | On death: spawns a ghost Mumble (1 HP, semi-invisible) |
| **Superscript** | 5+ | 30% smaller, bobs up and down |
| **Subscript** | 5+ | 30% smaller, fades when far away |
| **Highlighted** | 7+ | Must-kill-first priority, yellow glow |
| **Hyperlinked** | 7+ | On death: spawns 2-3 Mumbles nearby, blue underline |

Elite chance: `5% + 2% per wave past wave 3` (caps at 30%).

---

## Items (35)

Items drop every 3 kills. You choose 1 from 3 options. Picking the same item again increases its stack count, making it stronger.

### Common (White) -- 60% Drop Rate

| Item | Effect | Max Stacks |
|---|---|---|
| **Rubber Letters** | Projectiles bounce off screen edges (+1 bounce/stack) | 10 |
| **Vowel Vampirism** | Heal 1 HP per vowel typed (+1 HP/stack) | 10 |
| **Echo Chamber** | 15% chance to fire duplicate projectile (+15%/stack, max 90%) | 6 |
| **Consonant Cruelty** | +5% damage per consonant in word (multiplied by stacks) | 20 |
| **Spellcheck** | Forgives 1 typo, 30s cooldown (-5s/stack, min 5s) | 5 |
| **Margin Notes** | Kills drop auto-complete pickups | 5 |
| **Torn Page** | 30% chance words shorten to half (+15%/stack, max 75%) | 4 |
| **Papercut** | Projectiles inflict 2% HP/sec bleed (3 + stacks seconds) | 10 |
| **Footnote** | Fire a homing projectile every N words (5/4/3/2) | 4 |

### Uncommon (Green) -- 25% Drop Rate

| Item | Effect | Max Stacks |
|---|---|---|
| **Ink Blot** | Enemies leave damaging ink pools on death | 5 |
| **Bookmark** | Cheat death once per run (30% + 10%/stack respawn HP) | 7 |
| **Ricochet Rune** | Projectiles bounce to nearby enemies (300px, +1 target/stack) | 10 |
| **Chain Letter** | Every 10 words: chain lightning hits 3 + stacks enemies | 5 |
| **Red Pen** | 10% crit chance for 3x damage (+5%/stack) | 10 |
| **Ghostwriter** | Auto-attacks 4-letter enemies every 3000/stacks ms | 3 |
| **Hardcover** | Type N words to build 1 armor block (10/8/6/4) | 4 |
| **Unabridged** | 8+ letter words explode in AoE (radius 80 + 30/stack) | 5 |
| **Invisible Ink** | 2s invisibility after word complete (cd 15 - 3/stack, min 3s) | 4 |
| **Serif Strike** | Serif letters (i, j, f, l, t) get +50% + 25%/stack damage | 4 |
| **Backspace** | Press Backspace to instant-kill nearest enemy (cd 10 - 2/stack, min 2s) | 4 |
| **Ellipsis** | Pause typing 2s to charge 3x + stacks damage on next word | 5 |

### Rare (Red) -- 12% Drop Rate

| Item | Effect | Max Stacks |
|---|---|---|
| **Damage Aura** | Nearby enemies take constant damage (radius 80 + 20/stack) | 5 |
| **Hemingway's Curse** | Short words (4 chars or less) may fire twice (50% + 15%/stack) | 3 |
| **Proust's Blessing** | Long words (8+) fire a spread of projectiles (8 + 2/stack) | 4 |
| **Monkey's Typewriter** | Any keystroke may auto-complete the whole word (+1%/stack) | 10 |
| **Ctrl+Z** | On death: rewind time (saves every 1s, 10 + 5/stack second window) | 3 |
| **Critical Letter** | Words have a glowing letter for instant crit (3 + 0.5x/stack) | 5 |
| **Bold Statement** | Every N words: massive projectile (N = 10 - stacks, min 3) | 5 |
| **Comic Sans** | Each word may trigger a random effect (10% + 5%/stack) | 6 |
| **Tab Complete** | After 3 typed letters: auto-complete (cd 20 - 4/stack, min 4s) | 4 |
| **Recursive Definition** | 25% + 15%/stack chance to fire twice at same enemy | 4 |

### Legendary (Gold) -- 3% Drop Rate

| Item | Effect | Max Stacks |
|---|---|---|
| **Tower of Babel** | 20% of words become foreign language for 10x damage | 1 |
| **Blood Ink** | Permanently sacrifice 25% max HP for 25% lifesteal | 1 |
| **Babel's Toll** | 25% of words appear reversed; type backwards for 5x damage | 1 |

---

## Synergies

Specific item combinations unlock bonus effects:

| Synergy | Requires | Effect |
|---|---|---|
| **Pinball Wizard** | Rubber Letters + Ricochet Rune | Bounces accelerate projectiles |

The synergy system is built and ready for more combinations in future updates.

---

## Upgrades (10)

On level up, choose 1 of 3 random upgrades. Most can be taken multiple times.

| Upgrade | Effect | Repeatable? |
|---|---|---|
| **Sharp Words** | x1.25 damage | Yes |
| **Double Letters** | Double letters deal area damage | No (unique) |
| **Vowel Healing** | Typing vowels heals 1 HP | No (unique) |
| **Quick Fingers** | +15% speed bonus damage | Yes |
| **Word Magnet** | x1.5 XP pickup range | Yes |
| **Combo Master** | +8% damage per combo word | Yes |
| **Thick Skin** | x0.75 damage taken | Yes |
| **Regeneration** | Heal 1 HP every 3 seconds | Yes |
| **Critical Words** | +20% crit chance | Yes |
| **Piercing Letters** | +1 enemy pierce per projectile | Yes |

---

## Combat

### Damage Formula

```
Base Damage = word length x damage multiplier x item damage multiplier

Combo Bonus:   base x (1 + combo count x combo bonus)
Speed Bonus:   base x (1 + (WPM - 30) / 100 x speed bonus)   [only above 30 WPM]
Critical Hit:  base x 2   (or 3x from Red Pen, 3-5.5x from Critical Letter)

Final = base after all item onWordComplete hooks
```

### Combos

Each word typed increments your combo counter. The combo resets after 3 seconds without completing a word. Higher combos = more damage (with the Combo Master upgrade).

### WPM

Words Per Minute = `(total characters / 5) / (elapsed minutes)`. Speed bonus damage kicks in above 30 WPM.

---

## Progression

### XP & Leveling

- Enemies drop XP gems on death
- Walk near gems to collect them (range affected by Word Magnet upgrade)
- XP to next level: `10 x 1.5^(level - 1)`
- Level up pauses the game and offers 3 upgrade choices

### Waves

- 1 wave = 30 seconds of game time
- Spawn rate increases each wave: `delay = max(0.3s, 2.0s - wave x 0.15s)`
- Wave 3+: 30% chance of bonus spawn each cycle
- Wave 6+: Two 30% bonus spawn rolls per cycle
- New enemy types unlock at specific waves (see Enemies table)

---

## Special Mechanics

### White Space (Time-Stop)

Move the mouse to freeze all enemies. You can reposition while time is stopped. Typing still works during White Space. Stop moving the mouse for 300ms to resume normal time.

Visual cues: Background darkens, player glows golden.

### Literary Nuke (Screen Nuke)

Every 100 words typed triggers a screen-clearing nuke:

1. Rainbow ring explosion animation plays (1.5 seconds)
2. At 0.6s: all enemies killed, all gems and drops collected
3. "Rainbow Mario Mode" activates for 3 seconds -- rainbow border, touching enemies kills them
4. A progress bar at the bottom of the screen tracks words toward the next trigger

### Daily Challenge

A seeded daily run. Same word order and enemy spawns for all players on the same day. Results can be shared.

### Item Drops

Every 3 kills, a choice of 3 items appears. Items queue up as a non-blocking notification widget so you can keep fighting. Open the collection menu (ESC or tap the widget) to make your picks when ready.
