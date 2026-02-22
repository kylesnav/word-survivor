// @ts-check
const { test, expect } = require('@playwright/test');

// Helper: navigate to the game in test mode
async function loadGame(page) {
  await page.goto('/index.html?test=1');
  // Wait for the game script to finish initializing
  await page.waitForFunction(() => typeof window.__GAME__ !== 'undefined', { timeout: 10000 });
}

// Helper: start the game via the test API
async function startGame(page) {
  await page.evaluate(() => window.__GAME__.startGame());
  // Wait for state transition
  await page.waitForFunction(() => window.__GAME__.gameState() === 'playing', { timeout: 5000 });
}

test.describe('Word Survivor — Smoke Tests', () => {

  test('page loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/index.html?test=1');
    await page.waitForFunction(() => typeof window.__GAME__ !== 'undefined', { timeout: 10000 });

    // Filter out expected CDN/network errors (fonts, icons) which are not game bugs
    const gameErrors = errors.filter(e =>
      !e.includes('fonts.googleapis') &&
      !e.includes('unpkg.com') &&
      !e.includes('net::ERR')
    );
    expect(gameErrors).toEqual([]);
  });

  test('canvas element exists and has non-zero dimensions', async ({ page }) => {
    await loadGame(page);

    const dims = await page.evaluate(() => {
      const canvas = document.getElementById('game');
      return canvas ? { width: canvas.width, height: canvas.height, tagName: canvas.tagName } : null;
    });

    expect(dims).not.toBeNull();
    expect(dims.tagName).toBe('CANVAS');
    expect(dims.width).toBeGreaterThan(0);
    expect(dims.height).toBeGreaterThan(0);
  });

  test('start button exists and is clickable', async ({ page }) => {
    await loadGame(page);

    const startBtn = page.locator('#startBtn');
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toHaveText('PLAY');

    // Verify it's not disabled
    await expect(startBtn).toBeEnabled();
  });

  test('after clicking start, gameState transitions to playing', async ({ page }) => {
    await loadGame(page);

    const stateBefore = await page.evaluate(() => window.__GAME__.gameState());
    expect(stateBefore).toBe('menu');

    // Click the start button
    await page.locator('#startBtn').click();
    await page.waitForFunction(() => window.__GAME__.gameState() === 'playing', { timeout: 5000 });

    const stateAfter = await page.evaluate(() => window.__GAME__.gameState());
    expect(stateAfter).toBe('playing');
  });

  test('typing characters triggers key events', async ({ page }) => {
    await loadGame(page);
    await startGame(page);

    // Wait for an enemy to spawn and a word to be assigned
    await page.waitForFunction(() => {
      const g = window.__GAME__;
      return g.currentWord() && g.currentWord().length > 0;
    }, { timeout: 10000 });

    const wordBefore = await page.evaluate(() => window.__GAME__.currentWord());
    const firstChar = wordBefore[0];

    // Get typedIndex before
    const indexBefore = await page.evaluate(() => window.__GAME__.typedIndex());

    // Type the first character of the current word
    await page.keyboard.press(firstChar);

    // typedIndex should advance
    const indexAfter = await page.evaluate(() => window.__GAME__.typedIndex());
    expect(indexAfter).toBeGreaterThan(indexBefore);
  });

  test('after completing a word, a projectile is created', async ({ page }) => {
    await loadGame(page);
    await startGame(page);

    // Wait for a word to be assigned
    await page.waitForFunction(() => {
      const g = window.__GAME__;
      return g.currentWord() && g.currentWord().length > 0;
    }, { timeout: 10000 });

    const word = await page.evaluate(() => window.__GAME__.currentWord());

    // Type the entire word
    for (const char of word) {
      await page.keyboard.press(char);
    }

    // Allow a frame for projectile creation
    await page.waitForTimeout(100);

    const projectiles = await page.evaluate(() => window.__GAME__.projectiles());
    expect(projectiles.length).toBeGreaterThan(0);
  });

  test('enemies spawn after game starts', async ({ page }) => {
    await loadGame(page);
    await startGame(page);

    // Wait for enemies to spawn (SPAWN_INITIAL_DELAY is 2 seconds)
    await page.waitForFunction(() => window.__GAME__.enemies().length > 0, { timeout: 10000 });

    const enemies = await page.evaluate(() => window.__GAME__.enemies());
    expect(enemies.length).toBeGreaterThan(0);

    // Check enemy has expected properties
    const first = enemies[0];
    expect(first).toHaveProperty('x');
    expect(first).toHaveProperty('y');
    expect(first).toHaveProperty('word');
    expect(first).toHaveProperty('health');
    expect(first).toHaveProperty('enemyType');
  });

  test('when player health reaches 0, gameState becomes gameOver', async ({ page }) => {
    await loadGame(page);
    await startGame(page);

    // Kill the player by setting health to 0 directly via evaluate
    // The game should detect this on the next update frame
    await page.evaluate(() => {
      const g = window.__GAME__;
      const p = g.player;
      // Access the actual mutable player object through the pool/state
      // Since player() returns a copy, we need to use the exposed functions
      // Force health to 0 by spawning enemies on top of player — but that's slow.
      // Instead, use updateGame to advance time after setting health low.
      // The test API exposes the raw player through startGame context.
      // We can also just call the internal game state:
    });

    // Alternative approach: Let enemies damage the player by advancing game time
    // Use spawnEnemyOfType to spawn enemies right on top of the player
    await page.evaluate(() => {
      const g = window.__GAME__;
      // Spawn many enemies directly on the player position
      const p = g.player();
      for (let i = 0; i < 20; i++) {
        g.spawnEnemyOfType(p.x + 5, p.y + 5, 'mumble');
      }
    });

    // Advance game time to let enemies damage the player
    // Keep running updateGame until player dies or timeout
    await page.waitForFunction(() => {
      const g = window.__GAME__;
      // Advance in small steps
      for (let i = 0; i < 100; i++) {
        g.updateGame(50);
      }
      return g.gameState() === 'gameOver';
    }, { timeout: 15000 });

    const state = await page.evaluate(() => window.__GAME__.gameState());
    expect(state).toBe('gameOver');
  });

  test('pause functionality works (Escape key)', async ({ page }) => {
    await loadGame(page);
    await startGame(page);

    // Press Escape to pause
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const pausedState = await page.evaluate(() => window.__GAME__.gameState());
    expect(pausedState).toBe('paused');

    // Verify pause menu is visible
    const pauseMenu = page.locator('#pauseMenu');
    await expect(pauseMenu).toBeVisible();

    // Press Escape again to resume
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const resumedState = await page.evaluate(() => window.__GAME__.gameState());
    expect(resumedState).toBe('playing');
  });

  test('word display shows current word being typed', async ({ page }) => {
    await loadGame(page);
    await startGame(page);

    // Wait for a word to be assigned
    await page.waitForFunction(() => {
      const g = window.__GAME__;
      return g.currentWord() && g.currentWord().length > 0;
    }, { timeout: 10000 });

    const word = await page.evaluate(() => window.__GAME__.currentWord());

    // The word display element should have content
    const wordDisplay = page.locator('#wordDisplay');
    await expect(wordDisplay).not.toBeEmpty();

    // Type first character — display should update
    await page.keyboard.press(word[0]);
    await page.waitForTimeout(100);

    // The display should still show content (now with typed + remaining)
    const displayText = await wordDisplay.textContent();
    expect(displayText.length).toBeGreaterThan(0);
  });

});
