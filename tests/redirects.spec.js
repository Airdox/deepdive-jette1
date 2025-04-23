// @ts-check
const { test, expect } = require('@playwright/test');
const { AuthHelper } = require('./auth-helper');

/**
 * Tests für die Netlify-Weiterleitungsregeln
 * Diese Tests prüfen, ob die Weiterleitungsregeln in netlify.toml korrekt funktionieren.
 */

// Warten auf vollständiges Laden der Seite nach einer Weiterleitung
async function waitForNavigation(page) {
  await page.waitForLoadState('networkidle');
}

// Gruppe von Tests für die Benutzerrollen-Weiterleitungen
test.describe('Netlify Redirect-Regeln für Benutzerrollen', () => {
  // Test für berechtigten Zugriff auf Andi-Content
  test('Berechtigter Benutzer "andi" kann auf andi-content.html zugreifen', async ({ page }) => {
    // Simuliere einen Benutzer mit der Rolle "andi"
    await AuthHelper.loginAs(page, 'andi');
    
    await page.goto('/andi-content.html');
    await waitForNavigation(page);
    
    // Prüfe, ob die Seite tatsächlich angezeigt wird (nicht weitergeleitet)
    expect(page.url()).toContain('andi-content.html');
    
    // Optional: Prüfe auf spezifische Inhalte
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Andi'); // Annahme: Die Seite enthält irgendwo den Text "Andi"
  });
  
  // Test für unberechtigten Zugriff
  test('Unberechtigter Benutzer wird von andi-content.html zu account.html weitergeleitet', async ({ page }) => {
    // Simuliere einen Benutzer ohne die Rolle "andi", z.B. mit der Rolle "ricardo"
    await AuthHelper.loginAs(page, 'ricardo');
    
    await page.goto('/andi-content.html');
    await waitForNavigation(page);
    
    // Prüfe, ob die Weiterleitung funktioniert
    expect(page.url()).toContain('account.html');
    
    // Optional: Prüfe auf Fehlermeldungen auf der Seite
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Account'); // Annahme: Die Account-Seite enthält diesen Text
  });
  
  // Test für nicht eingeloggten Benutzer
  test('Nicht eingeloggter Benutzer wird zur Account-Seite weitergeleitet', async ({ page }) => {
    // Simuliere einen nicht eingeloggten Benutzer
    await AuthHelper.loginAs(page, null);
    
    await page.goto('/andi-content.html');
    await waitForNavigation(page);
    
    // Entsprechend der netlify.toml sollte ein nicht eingeloggter Benutzer
    // zur Account-Seite weitergeleitet werden
    expect(page.url()).toContain('account.html');
  });
});

// Tests für Download-Zugriff
test.describe('Zugriff auf geschützte Downloads', () => {
  test('Benutzer "andi" kann auf seine Downloads zugreifen', async ({ page }) => {
    // Simuliere einen Benutzer mit der Rolle "andi"
    await AuthHelper.loginAs(page, 'andi');
    
    await page.goto('/downloads/andi/leitfaden_umgang_nps.pdf');
    await waitForNavigation(page);
    
    // Prüfe, ob kein Redirect erfolgt (bleibt auf der PDF-Seite)
    expect(page.url()).toContain('leitfaden_umgang_nps.pdf');
  });
  
  test('Benutzer ohne Berechtigung wird beim Zugriff auf Downloads weitergeleitet', async ({ page }) => {
    // Simuliere einen Benutzer mit einer anderen Rolle
    await AuthHelper.loginAs(page, 'ricardo');
    
    await page.goto('/downloads/andi/leitfaden_umgang_nps.pdf');
    await waitForNavigation(page);
    
    // Sollte zur Account-Seite weitergeleitet werden
    expect(page.url()).toContain('account.html');
  });
});

// Tests für die allgemeinen Seiten
test.describe('Zugriff auf öffentliche Seiten', () => {
  test('Jeder kann auf die Hauptseite zugreifen', async ({ page }) => {
    await page.goto('/');
    await waitForNavigation(page);
    
    // Sollte auf der Hauptseite bleiben oder zu index.html weitergeleitet werden
    expect(page.url()).toMatch(/\/(index\.html)?$/);
  });
  
  test('Jeder kann auf die Info-Seite zugreifen', async ({ page }) => {
    await page.goto('/info.html');
    await waitForNavigation(page);
    
    // Sollte auf der Info-Seite bleiben
    expect(page.url()).toContain('info.html');
  });
});

// Tests für Fallback-Regeln
test.describe('Fallback-Regeln für nicht definierte Seiten', () => {
  test('Nicht existierende Seite wird zur Hauptseite weitergeleitet', async ({ page }) => {
    await page.goto('/nicht-existierende-seite.html');
    await waitForNavigation(page);
    
    // Sollte zur Hauptseite weitergeleitet werden gemäß der letzten Regel in netlify.toml
    expect(page.url()).toMatch(/\/(index\.html)?$/);
  });
});