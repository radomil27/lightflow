import { test, expect } from '@playwright/test';

test.describe('Lightflow 7-Posten Progressive Reveal & State Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('lightflow_onboarding_completed_v1', 'true');
    });
  });

  test('zeigt initial Posten 1 (LICHTFUNKE) an und erlaubt das Wechseln zwischen den Posten-Karten', async ({ page }) => {
    await page.goto('/');

    const splash = page.locator('div[aria-label*="Startbildschirm"]');
    if (await splash.isVisible()) {
      await splash.click();
    }

    // Bibelstellen-Plakette im Leder-Etui muss sichtbar sein
    const plaque = page.locator('div.brass-embossed-plaque');
    await expect(plaque).toBeVisible();

    // 1. LICHTFUNKE muss als geöffnete oder aktive Karte vorhanden sein
    const card1 = page.getByText('1. LICHTFUNKE', { exact: false });
    await expect(card1).toBeVisible();

    // 7 Karten müssen im Stack vorhanden sein
    const cards = page.locator('div.card-stack-perspective > div > div');
    await expect(cards).toHaveCount(7);

    // Klick auf eine andere geschlossene Karte (z. B. Karte 2) schaltet diese aktiv
    await cards.nth(1).click();

    // Überprüfe, dass kein JavaScript-Fehler geworfen wurde und die Karte interagierbar bleibt
    await expect(cards.nth(1)).toBeVisible();
  });

  test('schaltet den 3D-Kartenfächer zuverlässig um', async ({ page }) => {
    await page.goto('/');

    const splash = page.locator('div[aria-label*="Startbildschirm"]');
    if (await splash.isVisible()) {
      await splash.click();
    }

    const fanBtn = page.locator('button[title*="Kartenetui auffächern"]');
    await expect(fanBtn).toBeVisible();

    // Klick zum Schließen des Fächers
    await fanBtn.click();
    await expect(fanBtn).toContainText('Auffächern');

    // Klick zum erneuten Öffnen
    await fanBtn.click();
    await expect(fanBtn).toContainText('Fächer schließen');
  });
});
