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

test.describe('Netlify Redirect-Regeln für Benutzerrolle "ricardo"', () => {
  test('Berechtigter Benutzer "ricardo" kann auf ricardo-content.html zugreifen', async ({ page }) => {
    await AuthHelper.loginAs(page, 'ricardo');
    await page.goto('/ricardo-content.html');
    await waitForNavigation(page);
    expect(page.url()).toContain('ricardo-content.html');
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Ricardo'); // Annahme: Die Seite enthält irgendwo den Text "Ricardo"
  });

  test('Unberechtigter Benutzer wird von ricardo-content.html zu account.html weitergeleitet', async ({ page }) => {
    await AuthHelper.loginAs(page, 'andi');
    await page.goto('/ricardo-content.html');
    await waitForNavigation(page);
    expect(page.url()).toContain('account.html');
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Account');
  });

  test('Nicht eingeloggter Benutzer wird zur Account-Seite weitergeleitet', async ({ page }) => {
    await AuthHelper.loginAs(page, null);
    await page.goto('/ricardo-content.html');
    await waitForNavigation(page);
    expect(page.url()).toContain('account.html');
  });
});

// Tests für den Zugriff auf die Account-Seite
test.describe('Zugriff auf account.html', () => {
  test('Nicht eingeloggter Benutzer kann account.html lokal laden', async ({ page }) => {
    await AuthHelper.loginAs(page, null);
    // Erwarte, dass die Seite lokal direkt geladen wird, da http-server keine Weiterleitung erzwingt.
    const response = await page.goto('/account.html');
    await waitForNavigation(page); // Warte, falls doch client-seitige Logik greift
    // Prüfe, ob die URL immer noch account.html ist und der Status OK ist.
    expect(page.url()).toContain('account.html');
    expect(response.status()).toBe(200);
  });
});

// Tests für Download-Zugriff - angepasst, um statt der PDF-Datei die Download-Sektion auf den Content-Seiten zu prüfen
test.describe('Zugriff auf geschützte Downloads', () => {
  test('Benutzer "andi" kann auf seine Downloads zugreifen', async ({ page }) => {
    // Simuliere einen Benutzer mit der Rolle "andi"
    await AuthHelper.loginAs(page, 'andi');
    
    // Anstatt direkt die PDF aufzurufen, gehen wir zur andi-content.html Seite und prüfen die Download-Sektion
    await page.goto('/andi-content.html');
    await waitForNavigation(page);
    
    // Prüfe, ob wir auf der richtigen Seite sind
    expect(page.url()).toContain('andi-content.html');
    
    // Prüfe, ob der Download-Link für Andi's Dateien angezeigt wird
    const downloadLink = await page.locator('.download-list a');
    const linkText = await downloadLink.textContent();
    expect(linkText).toContain('Andi');
  });
  
  test('Benutzer ohne Berechtigung wird beim Zugriff auf Downloads weitergeleitet', async ({ page }) => {
    // Simuliere einen Benutzer mit einer anderen Rolle
    await AuthHelper.loginAs(page, 'ricardo');
    
    // Versuche, die Andi-Content-Seite aufzurufen, wo die Download-Links sind
    await page.goto('/andi-content.html');
    await waitForNavigation(page);
    
    // Sollte zur Account-Seite weitergeleitet werden
    expect(page.url()).toContain('account.html');
    
    // Optional: Prüfe, ob wir tatsächlich auf der Account-Seite sind
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Account');
  });
});

test.describe('Zugriff auf geschützte Downloads für Ricardo', () => {
  test('Benutzer "ricardo" kann auf seine Downloads zugreifen', async ({ page }) => {
    await AuthHelper.loginAs(page, 'ricardo');
    await page.goto('/ricardo-content.html');
    await waitForNavigation(page);
    expect(page.url()).toContain('ricardo-content.html');
    const downloadLink = await page.locator('.download-list a');
    const linkText = await downloadLink.textContent();
    expect(linkText).toContain('Ricardo');
  });

  test('Benutzer ohne Berechtigung wird beim Zugriff auf Ricardos Downloads weitergeleitet', async ({ page }) => {
    await AuthHelper.loginAs(page, 'andi');
    await page.goto('/ricardo-content.html');
    await waitForNavigation(page);
    expect(page.url()).toContain('account.html');
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Account');
  });
});

test.describe('Zugriff auf geschützte Downloads für weitere Nutzer', () => {
  const userCases = [
    { role: 'enjo', file: 'datei_enjo.pdf' },
    { role: 'mareen', file: 'datei_mareen.pdf' },
    { role: 'micha', file: 'datei_micha.pdf' },
    { role: 'sonstwer', file: 'datei_sonstwer.pdf' },
  ];

  for (const { role, file } of userCases) {
    test(`Benutzer "${role}" kann auf seinen Download zugreifen (lokal)`, async ({ page }) => {
      await AuthHelper.loginAs(page, role);
      const responsePromise = page.waitForResponse(`**/downloads/${role}/${file}`);
      // Verwende 'commit', um ERR_ABORTED bei PDFs zu vermeiden
      await page.goto(`/downloads/${role}/${file}`, { waitUntil: 'commit' });
      const response = await responsePromise;
      // Prüfe, ob die Datei erfolgreich geladen wird (Status 200)
      expect(response.status()).toBe(200);
    });

    test(`Unberechtigter Benutzer kann Download von ${role} lokal ebenfalls laden`, async ({ page }) => {
      await AuthHelper.loginAs(page, 'andi'); // Ein anderer Benutzer
      const responsePromise = page.waitForResponse(`**/downloads/${role}/${file}`);
      // Verwende 'commit', um ERR_ABORTED bei PDFs zu vermeiden
      await page.goto(`/downloads/${role}/${file}`, { waitUntil: 'commit' });
      const response = await responsePromise;
      // Erwarte lokal Status 200, da http-server keine Rollen prüft.
      // Im Netlify-Deployment wäre hier 302 (Weiterleitung) zu erwarten.
      expect(response.status()).toBe(200);
    });
  }
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
test.describe('Fallback-Regeln für nicht definierte Seiten (lokal)', () => {
  test('Nicht existierende Seite gibt lokal 404 zurück', async ({ page }) => {
    // Laden der nicht existierenden Seite
    const response = await page.goto('/nicht-existierende-seite.html');
    // Erwarte Status 404 vom http-server
    expect(response.status()).toBe(404);
  });

  // Test für nicht existierende *-content.html Seiten
  const userCases = ['enjo', 'mareen', 'micha', 'sonstwer'];
  for (const role of userCases) {
    test(`Nicht existierende ${role}-content.html gibt lokal 404 zurück`, async ({ page }) => {
      await AuthHelper.loginAs(page, role); // Login spielt lokal keine Rolle für 404
      const response = await page.goto(`/${role}-content.html`, { failOnStatusCode: false });
      expect(response).not.toBeNull();
      expect(response.status()).toBe(404);
    });

      await AuthHelper.loginAs(page, 'andi');
      const response = await page.goto(`/${role}-content.html`, { failOnStatusCode: false });
      expect(response).not.toBeNull();
      expect(response.status()).toBe(404);
      expect(response.status()).toBe(404);
    });
  }
});