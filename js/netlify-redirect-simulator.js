/**
 * Netlify Redirect Simulator
 * 
 * Diese Datei simuliert die Netlify-Weiterleitungsregeln in einer lokalen Entwicklungsumgebung.
 * Sie nutzt die HTML5 History API, um Weiterleitungen basierend auf der Benutzerrolle vorzunehmen.
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Benutzerrolle aus Cookie auslesen
    const userRole = getUserRoleFromCookie();
    
    // Aktuelle URL abrufen
    const currentPath = window.location.pathname;
    
    // Überprüfe, ob eine Weiterleitung notwendig ist
    const redirectPath = checkRedirects(currentPath, userRole);
    
    if (redirectPath && redirectPath !== currentPath) {
      // Führe Weiterleitung durch
      window.location.href = redirectPath;
    }
  });
  
  /**
   * Extrahiert die Benutzerrolle aus dem nf_jwt Cookie
   * @returns {string|null} Die Benutzerrolle oder null, wenn nicht eingeloggt
   */
  function getUserRoleFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'nf_jwt') {
        // Format in den Tests: simulated_ROLE_token
        const match = value.match(/simulated_(.+)_token/);
        return match ? match[1] : null;
      }
    }
    return null;
  }
  
  /**
   * Überprüfe, ob eine Weiterleitung erforderlich ist basierend auf Pfad und Benutzerrolle
   * @param {string} path - Der aktuelle Pfad
   * @param {string|null} role - Die Benutzerrolle
   * @returns {string|null} Der Weiterleitungspfad oder null, wenn keine Weiterleitung
   */
  function checkRedirects(path, role) {
    // Einfache Implementierung der Netlify-Regeln aus netlify.toml
    
    // Inhaltspfade prüfen (z.B. /andi-content.html)
    if (path.match(/\/(\w+)-content\.html$/)) {
      const contentRole = path.match(/\/(\w+)-content\.html$/)[1];
      
      // Benutzer hat Zugriff, wenn seine Rolle mit dem Content übereinstimmt
      if (role === contentRole) {
        return null; // Keine Weiterleitung notwendig
      } 
      
      // Ansonsten zur Account-Seite weiterleiten
      return '/account.html';
    }
    
    // Account-Seitenzugriff prüfen
    if (path === '/account.html') {
      // Jeder eingeloggte Benutzer darf zugreifen
      if (role) {
        return null; // Keine Weiterleitung notwendig
      }
      // Nicht eingeloggte Benutzer bleiben trotzdem auf der Account-Seite
      return null;
    }
    
    // Download-Zugriff prüfen
    if (path.match(/\/downloads\/(\w+)\//)) {
      const downloadRole = path.match(/\/downloads\/(\w+)\//)[1];
      
      // Benutzer hat Zugriff, wenn seine Rolle mit dem Download-Ordner übereinstimmt
      if (role === downloadRole) {
        return null; // Keine Weiterleitung notwendig
      }
      
      // Ansonsten zur Account-Seite weiterleiten
      return '/account.html';
    }
    
    // Öffentliche Seiten sind für alle zugänglich
    if (path === '/' || path === '/index.html' || path === '/info.html') {
      return null; // Keine Weiterleitung notwendig
    }
    
    // Fallback-Regel für nicht definierte Seiten
    if (!path.match(/\/(index\.html)?$/) && 
        !path.match(/\/(account\.html)$/) && 
        !path.match(/\/(info\.html)$/)) {
      return '/index.html';
    }
    
    return null; // Standardmäßig keine Weiterleitung
  }
})();