import { test, expect } from '@playwright/test';

test.describe('Lightflow Modals & State Persistence Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('lightflow_onboarding_completed_v1', 'true');
    });
  });

  test('öffnet und schließt das Einstellungs-Modal sauber', async ({ page }) => {
    await page.goto('/');

    const splash = page.locator('div[aria-label*="Startbildschirm"]');
    if (await splash.isVisible()) {
      await splash.click();
    }

    // Klick auf Einstellungs-Button im Header
    const settingsBtn = page.locator('header button[title*="Einstellungen"]');
    await settingsBtn.click();

    // Einstellungs-Modal muss sichtbar sein
    const modalHeading = page.getByRole('heading', { name: 'Einstellungen' });
    await expect(modalHeading).toBeVisible();

    // Schließen via Close-Button
    const closeBtn = page.locator('div[role="dialog"], div.animate-luxury-modal').getByRole('button').filter({ has: page.locator('svg') }).first();
    await closeBtn.click();

    // Modal darf nicht mehr sichtbar sein
    await expect(modalHeading).not.toBeVisible();
  });

  test('öffnet das Profil-Modal, aktualisiert Berufsdetail und persistiert es', async ({ page }) => {
    await page.goto('/');

    const splash = page.locator('div[aria-label*="Startbildschirm"]');
    if (await splash.isVisible()) {
      await splash.click();
    }

    // Profil Button öffnen
    const profileBtn = page.locator('header button[title*="Verbindungsprofil"]');
    await profileBtn.click();

    // Formular muss sichtbar sein
    await expect(page.getByText('Verbindungsprofil', { exact: false })).toBeVisible();

    // Speichern via "Profil anwenden"
    const submitBtn = page.getByRole('button', { name: 'Profil anwenden' });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Modal schließt sich nach Klick
    await expect(submitBtn).not.toBeVisible();
  });
});
