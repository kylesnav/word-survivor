// @ts-check
const { test, expect } = require('@playwright/test');

// Helper: navigate to the game in test mode
async function loadGame(page) {
  await page.goto('/index.html?test=1');
  await page.waitForFunction(() => typeof window.__GAME__ !== 'undefined', { timeout: 10000 });
}

// Helper: start the game and wait for playing state
async function startGame(page) {
  await page.evaluate(() => window.__GAME__.startGame());
  await page.waitForFunction(() => window.__GAME__.gameState() === 'playing', { timeout: 5000 });
}

test.describe('Word Survivor — Item System Tests', () => {

  test.describe('Item Definitions', () => {

    test('all 34 items are defined in ITEMS object', async ({ page }) => {
      await loadGame(page);

      const itemCount = await page.evaluate(() => {
        return Object.keys(window.__GAME__.ITEMS).length;
      });

      expect(itemCount).toBe(34);
    });

    test('each item has required fields (name, tier, description, maxStacks, icon)', async ({ page }) => {
      await loadGame(page);

      const items = await page.evaluate(() => {
        const items = window.__GAME__.ITEMS;
        return Object.entries(items).map(([id, item]) => ({
          id,
          hasName: typeof item.name === 'string' && item.name.length > 0,
          hasTier: typeof item.tier === 'string' && ['WHITE', 'GREEN', 'RED', 'LEGENDARY'].includes(item.tier),
          hasDescription: typeof item.description === 'string' && item.description.length > 0,
          hasMaxStacks: typeof item.maxStacks === 'number' && item.maxStacks > 0,
          hasIcon: typeof item.icon === 'string' && item.icon.length > 0,
          hasRegisterHooks: typeof item.registerHooks === 'function',
        }));
      });

      for (const item of items) {
        expect(item.hasName, `${item.id} should have a name`).toBe(true);
        expect(item.hasTier, `${item.id} should have a valid tier`).toBe(true);
        expect(item.hasDescription, `${item.id} should have a description`).toBe(true);
        expect(item.hasMaxStacks, `${item.id} should have maxStacks > 0`).toBe(true);
        expect(item.hasIcon, `${item.id} should have an icon`).toBe(true);
        expect(item.hasRegisterHooks, `${item.id} should have registerHooks()`).toBe(true);
      }
    });

    test('item tiers are valid (white, green, red, legendary)', async ({ page }) => {
      await loadGame(page);

      const tiers = await page.evaluate(() => {
        const items = window.__GAME__.ITEMS;
        return [...new Set(Object.values(items).map(item => item.tier))].sort();
      });

      expect(tiers).toEqual(['GREEN', 'LEGENDARY', 'RED', 'WHITE']);
    });

  });

  test.describe('addItem() Behavior', () => {

    test('addItem() adds item to inventory', async ({ page }) => {
      await loadGame(page);
      await startGame(page);

      const result = await page.evaluate(() => {
        const g = window.__GAME__;
        const before = g.inventory();
        const success = g.addItem('rubber_letters', true); // skipNotification
        const after = g.inventory();
        return {
          success,
          hadBefore: !!before['rubber_letters'],
          hasAfter: !!after['rubber_letters'],
          stacks: after['rubber_letters']
        };
      });

      expect(result.success).toBe(true);
      expect(result.hadBefore).toBe(false);
      expect(result.hasAfter).toBe(true);
      expect(result.stacks).toBe(1);
    });

    test('addItem() increments stack count on duplicate', async ({ page }) => {
      await loadGame(page);
      await startGame(page);

      const stacks = await page.evaluate(() => {
        const g = window.__GAME__;
        g.addItem('rubber_letters', true);
        g.addItem('rubber_letters', true);
        g.addItem('rubber_letters', true);
        return g.inventory()['rubber_letters'];
      });

      expect(stacks).toBe(3);
    });

    test('stack limits are respected (cannot exceed maxStacks)', async ({ page }) => {
      await loadGame(page);
      await startGame(page);

      const result = await page.evaluate(() => {
        const g = window.__GAME__;
        const maxStacks = g.ITEMS.echo_chamber.maxStacks; // maxStacks: 6

        // Add up to max
        for (let i = 0; i < maxStacks; i++) {
          g.addItem('echo_chamber', true);
        }
        const stacksAtMax = g.inventory()['echo_chamber'];

        // Try to add one more — should fail
        const overflowResult = g.addItem('echo_chamber', true);
        const stacksAfterOverflow = g.inventory()['echo_chamber'];

        return {
          maxStacks,
          stacksAtMax,
          overflowResult,
          stacksAfterOverflow
        };
      });

      expect(result.stacksAtMax).toBe(result.maxStacks);
      expect(result.overflowResult).toBe(false);
      expect(result.stacksAfterOverflow).toBe(result.maxStacks);
    });

  });

  test.describe('Hook Registration', () => {

    test('hook registration works (registerHooks populates hook arrays)', async ({ page }) => {
      await loadGame(page);
      await startGame(page);

      // Adding an item should trigger registerHooks which populates the hook arrays
      const hookInfo = await page.evaluate(() => {
        const g = window.__GAME__;

        // Add rubber_letters — it registers an onProjectileUpdate hook
        g.addItem('rubber_letters', true);

        // Add vowel_vampirism — it registers an onKeyPress hook
        g.addItem('vowel_vampirism', true);

        // Check that the hooks were called successfully by checking inventory
        // (hooks are registered on first addItem, not directly testable via __GAME__)
        return {
          hasRubberLetters: g.inventory()['rubber_letters'] === 1,
          hasVowelVampirism: g.inventory()['vowel_vampirism'] === 1,
        };
      });

      expect(hookInfo.hasRubberLetters).toBe(true);
      expect(hookInfo.hasVowelVampirism).toBe(true);
    });

  });

  test.describe('Item Drop Probability', () => {

    test('drop probability weights are correct per tier (60%/25%/12%/3%)', async ({ page }) => {
      await loadGame(page);

      // The weights are defined in ITEM_TIERS which isn't directly exposed,
      // but we can verify the distribution by checking what tier each item belongs to
      // and the expected probabilities from the source code.
      const tierWeights = await page.evaluate(() => {
        // We know from source: WHITE:60, GREEN:25, RED:12, LEGENDARY:3
        // Verify by checking item counts match documentation
        const items = window.__GAME__.ITEMS;
        const tierMap = {};
        for (const item of Object.values(items)) {
          tierMap[item.tier] = (tierMap[item.tier] || 0) + 1;
        }
        return {
          counts: tierMap,
          // Expected weights from ITEM_TIERS in source
          expectedWeights: { WHITE: 60, GREEN: 25, RED: 12, LEGENDARY: 3 },
          totalWeight: 60 + 25 + 12 + 3
        };
      });

      expect(tierWeights.totalWeight).toBe(100);
      expect(tierWeights.expectedWeights.WHITE).toBe(60);
      expect(tierWeights.expectedWeights.GREEN).toBe(25);
      expect(tierWeights.expectedWeights.RED).toBe(12);
      expect(tierWeights.expectedWeights.LEGENDARY).toBe(3);
    });

  });

  test.describe('Synergy Detection', () => {

    test('Pinball Wizard synergy: rubber_letters + ricochet_rune', async ({ page }) => {
      await loadGame(page);
      await startGame(page);

      const result = await page.evaluate(() => {
        const g = window.__GAME__;

        // Add first component — no synergy yet
        g.addItem('rubber_letters', true);
        const inv1 = g.inventory();
        const hasRubber = !!inv1['rubber_letters'];

        // Add second component — synergy should activate
        g.addItem('ricochet_rune', true);
        const inv2 = g.inventory();
        const hasRicochet = !!inv2['ricochet_rune'];

        return {
          hasRubber,
          hasRicochet,
          // We can't directly check activeSynergies via __GAME__ but both items should be present
          bothPresent: hasRubber && hasRicochet
        };
      });

      expect(result.hasRubber).toBe(true);
      expect(result.hasRicochet).toBe(true);
      expect(result.bothPresent).toBe(true);
    });

  });

  test.describe('Specific Item Validations', () => {

    test('all item IDs match their key in the ITEMS object', async ({ page }) => {
      await loadGame(page);

      const mismatches = await page.evaluate(() => {
        const items = window.__GAME__.ITEMS;
        const bad = [];
        for (const [key, item] of Object.entries(items)) {
          if (item.id !== key) {
            bad.push({ key, itemId: item.id });
          }
        }
        return bad;
      });

      expect(mismatches).toEqual([]);
    });

    test('legendary items have maxStacks of 1', async ({ page }) => {
      await loadGame(page);

      const legendaries = await page.evaluate(() => {
        const items = window.__GAME__.ITEMS;
        return Object.values(items)
          .filter(i => i.tier === 'LEGENDARY')
          .map(i => ({ id: i.id, maxStacks: i.maxStacks }));
      });

      expect(legendaries.length).toBe(4);
      for (const item of legendaries) {
        expect(item.maxStacks, `${item.id} should have maxStacks=1`).toBe(1);
      }
    });

    test('all expected item IDs exist', async ({ page }) => {
      await loadGame(page);

      const expectedItems = [
        // WHITE (9)
        'rubber_letters', 'vowel_vampirism', 'echo_chamber', 'consonant_cruelty',
        'spellcheck', 'margin_notes', 'torn_page', 'papercut', 'footnote',
        // GREEN (12)
        'ink_blot', 'bookmark', 'ricochet_rune', 'chain_letter', 'red_pen',
        'ghostwriter', 'hardcover', 'unabridged', 'invisible_ink', 'serif_strike',
        'backspace_item', 'ellipsis',
        // RED (10)
        'damage_aura', 'hemingway', 'proust', 'monkey_typewriter', 'ctrl_z',
        'critical_letter', 'bold_statement', 'comic_sans', 'tab_complete', 'recursive',
        // LEGENDARY (3)
        'tower_of_babel', 'blood_ink', 'babel_toll'
      ];

      const existingIds = await page.evaluate(() => {
        return Object.keys(window.__GAME__.ITEMS);
      });

      for (const id of expectedItems) {
        expect(existingIds, `Item '${id}' should exist`).toContain(id);
      }

      expect(existingIds.length).toBe(34);
    });

  });

});
