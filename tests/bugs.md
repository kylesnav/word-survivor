# Word Survivor — Bug Catalog

Bugs discovered during test authoring and code review.

---

## BUG-001: `itemNotificationActive` flag is set but never blocks game updates

- **Severity:** Major
- **Location:** SEC:STATE:PAUSE (line 3394), SEC:UPDATE (line ~7811)
- **Reproduction steps:**
  1. Kill 3 enemies to trigger an item drop
  2. Select an item that shows a first-pickup notification
  3. Observe that enemies continue moving while the notification is displayed
- **Expected:** Game pauses (enemies freeze, no damage taken) while item notification is shown
- **Actual:** `itemNotificationActive` is set to `true` in `displayNextItemNotification()` (line 5292) but the update loop at SEC:UPDATE does not check this flag to pause enemy/projectile updates. The flag is effectively dead code.
- **Proposed fix:** Add `if (itemNotificationActive || tipModalActive) return;` at the top of the update function, or gate enemy/projectile updates behind the flag.

---

## BUG-002: `doubleLetterAOE` modifier is set by upgrade but never read

- **Severity:** Major
- **Location:** SEC:STATE:MODIFIERS (line 3436), SEC:UPGRADES (around line 6763)
- **Reproduction steps:**
  1. Start a game and level up
  2. Select the "Double Letters" upgrade
  3. Type a word containing double letters (e.g., "book")
  4. Observe that no AoE effect occurs
- **Expected:** Double letters in words trigger an area-of-effect damage
- **Actual:** The upgrade sets `mods.doubleLetterAOE = true` but no code path reads `mods.doubleLetterAOE` to apply the effect. The feature is defined but not implemented.
- **Proposed fix:** Implement the AoE check in the word completion handler (SEC:COMBAT), checking `mods.doubleLetterAOE` and dealing AoE damage when consecutive duplicate letters are typed.

---

## BUG-003: `vowelHeal` modifier may conflict with Vowel Vampirism item

- **Severity:** Minor
- **Location:** SEC:STATE:MODIFIERS (line 3437), SEC:ITEMS:WHITE (line 4182)
- **Reproduction steps:**
  1. Pick up the "Vowel Healing" upgrade AND the "Vowel Vampirism" item
  2. Type vowels while playing
  3. Observe healing amounts
- **Expected:** Either stacking behavior is clearly defined, or one supersedes the other
- **Actual:** Both `mods.vowelHeal` (from the upgrade) and the `vowel_vampirism` item hook may apply healing independently on the same keystroke. This could result in double-healing on vowels, which may or may not be intended. No documentation clarifies the interaction.
- **Proposed fix:** Either document this as intended stacking behavior, or have one system delegate to the other.

---

## BUG-004: `firedAtEnemies` Set in Ghostwriter never cleared

- **Severity:** Minor
- **Location:** SEC:ITEMS:GREEN, Ghostwriter item (line ~4494, ~4502)
- **Reproduction steps:**
  1. Acquire the Ghostwriter item
  2. Play for multiple waves (5+ minutes)
  3. The `firedAtEnemies` Set grows with each auto-attack target
- **Expected:** `firedAtEnemies` is periodically pruned of dead/released enemies
- **Actual:** The Set is never cleared between waves. Dead enemy object references accumulate, creating a memory leak. In long runs with many enemies, this grows unboundedly. It also prevents Ghostwriter from re-targeting enemies that were released back to the pool and re-acquired with new identities.
- **Proposed fix:** Clear `firedAtEnemies` at the start of each wave, or remove entries when enemies are released back to the pool.

---

## BUG-005: `footnoteCounter` never resets between game sessions

- **Severity:** Cosmetic
- **Location:** SEC:ENEMIES:SPAWN (line 4048), startGame() (line 8776)
- **Reproduction steps:**
  1. Play a game where Footnote enemies spawn
  2. Note the footnote numbers (e.g., [1], [2], [3])
  3. Game over, start a new game
  4. Observe Footnote enemies continue numbering from previous run
- **Expected:** Footnote counter resets to 0 at the start of each game
- **Actual:** `footnoteCounter` is reset in `startGame()` (line 8776), so this appears to be fixed. However, if the player quits via `quitGame()` instead of dying, `quitGame()` does NOT reset `footnoteCounter` — only `startGame()` does. So playing → quit → play works, but the counter state persists in the global scope.
- **Proposed fix:** Already partially addressed. Confirmed that `startGame()` resets it. The quit path is fine since `startGame()` always runs before footnotes appear.

**UPDATE:** On re-inspection, line 8776 shows `footnoteCounter = 0;` inside `startGame()`. This bug was reported in DISCOVERY_REPORT.md but appears to be already fixed. Downgrading to cosmetic / resolved.

---

## BUG-006: `callWordCompleteHooks()` can produce NaN damage if hooks return undefined

- **Severity:** Critical
- **Location:** SEC:ITEMS:SYNERGIES (line 5174-5189)
- **Reproduction steps:**
  1. Acquire an item that registers an `onWordComplete` hook but returns `undefined` (e.g., `hemingway` when word length > 4, or `comic_sans` when effect doesn't trigger)
  2. Complete a word
  3. Check if damage calculation produces valid numbers
- **Expected:** Hooks that don't modify damage return the original damage value
- **Actual:** The `callWordCompleteHooks()` function at line 5183 checks `typeof hookResult === 'number'` before updating, which correctly guards against `undefined`. However, if any hook explicitly returns `NaN` (e.g., from a bad math operation), it would pass the type check and corrupt all subsequent damage calculations.
- **Proposed fix:** Change the guard to `if (typeof hookResult === 'number' && !isNaN(hookResult))`. Low probability but high impact if triggered.

---

## BUG-007: `window.upgradeChoices` stored as window global — fragile

- **Severity:** Minor
- **Location:** SEC:UPGRADES (line ~6882)
- **Reproduction steps:**
  1. Level up during gameplay
  2. Open browser console and type `window.upgradeChoices = undefined`
  3. Try to select an upgrade
- **Expected:** Upgrade selection is handled through internal state
- **Actual:** Upgrade choices are stored directly on `window.upgradeChoices`, making them accessible to any script on the page. Browser extensions or accidental collisions could corrupt this.
- **Proposed fix:** Move to a scoped variable within the game's IIFE/module scope. Since the entire game is in a `<script>` block this is already semi-scoped, but the explicit `window.` prefix unnecessarily exposes it.

---

## BUG-008: No validation on Critical Letter index vs word length

- **Severity:** Minor
- **Location:** SEC:ITEMS:RED, critical_letter (line 4844-4862)
- **Reproduction steps:**
  1. Acquire the Critical Letter item
  2. Have a word assigned with crit letter index set
  3. If another item (e.g., Torn Page) shortens the word after crit index is set, `critLetterIndex` could exceed the shortened word length
- **Expected:** Crit letter index is validated against final word length
- **Actual:** `critLetterIndex` is set during `onWordAssign` but Torn Page also hooks into `onWordAssign` and can shorten the word. The order of hook execution determines whether the index is valid. If Critical Letter runs first and sets index 6, then Torn Page shortens the word to 4 characters, the crit indicator would point to a non-existent character.
- **Proposed fix:** Validate `critLetterIndex < word.length` before rendering the crit letter indicator and before checking if the typed character triggers a crit.

---

## BUG-009: `Pool.release()` uses indexOf + splice — O(n) per release

- **Severity:** Minor (performance)
- **Location:** SEC:POOLS (lines 3487-3494)
- **Reproduction steps:**
  1. Play to late game with 100+ active enemies and 200 XP gems
  2. Kill enemies rapidly, triggering many pool releases per frame
  3. FPS may drop as release operations become O(n) with n active entities
- **Expected:** Pool release is O(1)
- **Actual:** `release()` calls `this.active.indexOf(obj)` (O(n)) then `this.active.splice(i, 1)` (O(n)), making each release O(n). With 200 gems being collected rapidly, this adds up.
- **Proposed fix:** Use swap-and-pop removal: swap the released element with the last element, then `pop()`. Both operations are O(1).

---

## BUG-010: Item sound tiers include undefined tiers (GOLD, ORANGE, LUNAR)

- **Severity:** Cosmetic
- **Location:** SEC:ITEMS:NOTIFY, playItemSound() (lines 5419-5433)
- **Reproduction steps:**
  1. N/A — the GOLD, ORANGE, and LUNAR tiers don't exist in the current item system
- **Expected:** Sound tier map only includes tiers that exist (WHITE, GREEN, RED, LEGENDARY)
- **Actual:** `playItemSound()` has frequency mappings for `GOLD`, `ORANGE`, and `LUNAR` tiers that don't exist. These are vestigial from an older tier system. They never trigger but add dead code.
- **Proposed fix:** Remove the GOLD, ORANGE, and LUNAR entries from the `freqs` object. Add a `LEGENDARY` entry (currently missing — falls through to WHITE default).

---

## BUG-011: Summoner (Citation Needed) spawns Footnote type instead of Mumble

- **Severity:** Minor
- **Location:** SEC:ENEMIES:BEHAVIORS, summoner behavior (line 3880)
- **Reproduction steps:**
  1. Play to wave 10+ until a Citation Needed enemy spawns
  2. Wait for it to summon minions
  3. Observe that summoned enemies are Footnote type (multi-word sentences)
- **Expected:** Per the discovery report, Citation Needed spawns mumbles (simple enemies)
- **Actual:** The summoner behavior at line 3880 calls `spawnEnemyOfType(..., 'footnote')` instead of `spawnEnemyOfType(..., 'mumble')`. Footnotes have multi-word sentences which are harder to type, making Citation Needed's summons disproportionately threatening.
- **Proposed fix:** Change `'footnote'` to `'mumble'` in the summoner behavior. The DISCOVERY_REPORT.md says "Spawns up to 6 mumbles every 3s" which confirms the intent.

---

## BUG-012: Test API only activates for non-mobile with `?test=1`

- **Severity:** Minor (testing infrastructure)
- **Location:** SEC:INPUT:MOBILE / TEST MODE EXPOSURE (lines 10250)
- **Reproduction steps:**
  1. Open index.html?test=1 on a mobile device or with mobile user agent
  2. `window.__GAME__` is `undefined`
- **Expected:** Test mode should work regardless of device type for CI/testing
- **Actual:** Line 10250 checks `!isMobileDevice` — if the user agent matches mobile, test mode is blocked even with `?test=1`. CI environments with mobile-like user agents cannot run tests.
- **Proposed fix:** Allow test mode to bypass the mobile check, or add a separate `?test=1&bypass_mobile=1` flag for CI.
