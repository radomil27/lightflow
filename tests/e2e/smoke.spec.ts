import { test, expect } from '@playwright/test';

test.describe('Lightflow Core Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setze Onboarding vorab auf abgeschlossen
    await page.addInitScript(() => {
      localStorage.setItem('lightflow_onboarding_completed_v1', 'true');
    });
  });

  test('lädt die Anwendung, überspringt Splash und zeigt den Header an', async ({ page }) => {
    await page.goto('/');

    // Wenn der Splashscreen sichtbar ist, klicke ihn an zum Überspringen
    const splash = page.locator('div[aria-label*="Startbildschirm"]');
    if (await splash.isVisible()) {
      await splash.click();
    }

    // Header mit Brand "Lightflow" muss sichtbar sein
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('Lightflow', { exact: true })).toBeVisible();

    // Circadianer Untertitel oder Begrüßung wird dynamisch im Header gerendert
    await expect(page.locator('header span.text-\\[11px\\]')).toBeVisible();
  });

  test('schaltet fehlerfrei zwischen Hell- und Dunkelmodus um', async ({ page }) => {
    await page.goto('/');

    const splash = page.locator('div[aria-label*="Startbildschirm"]');
    if (await splash.isVisible()) {
      await splash.click();
    }

    // Finde den Theme Toggle Button
    const themeBtn = page.locator('header button[title*="Modus"]');
    await expect(themeBtn).toBeVisible();

    // Lese initiale HTML-Klasse
    const isInitiallyDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));

    // Klick auf Umschalter
    await themeBtn.click();

    // Prüfe, ob sich der Dark-Mode-Zustand invertiert hat
    const isNowDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isNowDark).toBe(!isInitiallyDark);
  });
});
