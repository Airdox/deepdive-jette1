// @ts-check

/**
 * Hilfsfunktionen für die Authentifizierung in den Tests
 */
class AuthHelper {
  /**
   * Simuliert die Anmeldung eines Benutzers mit einer bestimmten Rolle
   * @param {import('@playwright/test').Page} page - Die Playwright-Page
   * @param {string|null} role - Die Rolle des Benutzers (z.B. 'andi', 'ricardo') oder null für keinen Benutzer
   */
  static async loginAs(page, role) {
    if (!role) {
      // Simuliere einen nicht eingeloggten Benutzer, indem alle Cookies gelöscht werden
      await page.context().clearCookies();
      return;
    }

    // In einer echten Anwendung würde hier ein API-Call oder Login-Formular verwendet werden
    // Für unsere Tests simulieren wir das durch direktes Setzen von Cookies
    
    // Setze ein Cookie zur Simulation eines eingeloggten Benutzers mit der angegebenen Rolle
    await page.context().addCookies([
      {
        name: 'nf_jwt',
        value: `simulated_${role}_token`,
        domain: 'localhost',
        path: '/',
      }
    ]);
    
    // Wir verzichten auf localStorage, da dies zu Fehlern führen kann
    // wenn die Seite noch nicht geladen wurde
  }

  /**
   * Hilfsmethode, um HTTP-Header für die Authentifizierung zu setzen
   * @param {string} role - Die Rolle des Benutzers
   * @returns {Object} Die Header für die Authentifizierung
   */
  static getAuthHeaders(role) {
    return {
      'X-User-Role': role,
      // Weitere Header könnten hier hinzugefügt werden
    };
  }
}

module.exports = { AuthHelper };