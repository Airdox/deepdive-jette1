# Test info

- Name: Netlify Redirect-Regeln für Benutzerrollen >> Nicht eingeloggter Benutzer wird zur Account-Seite weitergeleitet
- Location: C:\Users\User\Desktop\Meine projekete\dein-projekt\tests\redirects.spec.js:50:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "account.html"
Received string:    "http://localhost:8080/andi-content.html"
    at C:\Users\User\Desktop\Meine projekete\dein-projekt\tests\redirects.spec.js:59:24
```

# Page snapshot

```yaml
- text: "{/* Titel angepasst */}"
- banner:
  - heading "deepdive.Jette" [level=1]:
    - link "deepdive.Jette":
      - /url: index.html
  - navigation:
    - list:
      - listitem:
        - text: ">"
        - link "Startseite":
          - /url: index.html
      - listitem:
        - text: ">"
        - link "Narzissmus Verstehen":
          - /url: info.html
      - listitem:
        - text: ">"
        - link "Zugangsbereiche":
          - /url: account.html
    - list:
      - listitem:
        - text: ">"
        - link "Sign up":
          - /url: "#"
      - listitem:
        - text: ">"
        - link "Log in":
          - /url: "#"
- main:
  - text: "{/* Text und data-text angepasst */}"
  - heading "Willkommen im Andi-Bereich Willkommen im Andi-Bereich Willkommen im Andi-Bereich" [level=2]
  - text: "{/* Profilname angepasst */}"
  - paragraph:
    - text: Spezialisierte Inhalte für das Profil
    - strong: "[Andi]"
    - text: .
  - text: "{/* Rollenname angepasst */}"
  - heading "Inhaltsbereich für Andi" [level=3]
  - text: "{/* Rollenname angepasst */}"
  - paragraph: Dieser Bereich wird spezifische Inhalte für die Rolle "Andi" enthalten.
  - text: "{/* Rollenname angepasst */}"
  - heading "Allgemeine Ressourcen (Andi)" [level=4]
  - paragraph: Beschreibung folgt...
  - heading "Hinweis zur Nutzung Hinweis zur Nutzung Hinweis zur Nutzung" [level=4]
  - paragraph: Alle Materialien sind vertraulich.
  - text: "{/* Rollenname in Text und data-text angepasst */}"
  - heading "Exklusive Downloads [Andi] Exklusive Downloads [Andi] Exklusive Downloads [Andi]" [level=3]
  - list:
    - listitem:
      - text: "> {/* Link und Text angepasst */}"
      - link "[↓] Andi - Infografik Übersicht":
        - /url: /downloads/andi/infografik.png
  - text: "{/* Pfad im Hinweis angepasst */}"
  - paragraph: "Hinweis: Dateien müssen in `/downloads/andi/` liegen."
  - text: "{/* Rollenname angepasst */}"
  - heading "Forum [Andi-Sektor]" [level=4]
  - text: "{/* Rollenname angepasst */}"
  - paragraph: Austauschbereich für Andi (derzeit offline).
  - link "Zurück zum Account":
    - /url: account.html
- contentinfo:
  - text: "{/* Zugangsebene angepasst */}"
  - paragraph: "© 2024 deepdive.Jette - Zugangsebene: Andi"
```

# Test source

```ts
   1 | // @ts-check
   2 | const { test, expect } = require('@playwright/test');
   3 | const { AuthHelper } = require('./auth-helper');
   4 |
   5 | /**
   6 |  * Tests für die Netlify-Weiterleitungsregeln
   7 |  * Diese Tests prüfen, ob die Weiterleitungsregeln in netlify.toml korrekt funktionieren.
   8 |  */
   9 |
   10 | // Warten auf vollständiges Laden der Seite nach einer Weiterleitung
   11 | async function waitForNavigation(page) {
   12 |   await page.waitForLoadState('networkidle');
   13 | }
   14 |
   15 | // Gruppe von Tests für die Benutzerrollen-Weiterleitungen
   16 | test.describe('Netlify Redirect-Regeln für Benutzerrollen', () => {
   17 |   // Test für berechtigten Zugriff auf Andi-Content
   18 |   test('Berechtigter Benutzer "andi" kann auf andi-content.html zugreifen', async ({ page }) => {
   19 |     // Simuliere einen Benutzer mit der Rolle "andi"
   20 |     await AuthHelper.loginAs(page, 'andi');
   21 |     
   22 |     await page.goto('/andi-content.html');
   23 |     await waitForNavigation(page);
   24 |     
   25 |     // Prüfe, ob die Seite tatsächlich angezeigt wird (nicht weitergeleitet)
   26 |     expect(page.url()).toContain('andi-content.html');
   27 |     
   28 |     // Optional: Prüfe auf spezifische Inhalte
   29 |     const pageContent = await page.textContent('body');
   30 |     expect(pageContent).toContain('Andi'); // Annahme: Die Seite enthält irgendwo den Text "Andi"
   31 |   });
   32 |   
   33 |   // Test für unberechtigten Zugriff
   34 |   test('Unberechtigter Benutzer wird von andi-content.html zu account.html weitergeleitet', async ({ page }) => {
   35 |     // Simuliere einen Benutzer ohne die Rolle "andi", z.B. mit der Rolle "ricardo"
   36 |     await AuthHelper.loginAs(page, 'ricardo');
   37 |     
   38 |     await page.goto('/andi-content.html');
   39 |     await waitForNavigation(page);
   40 |     
   41 |     // Prüfe, ob die Weiterleitung funktioniert
   42 |     expect(page.url()).toContain('account.html');
   43 |     
   44 |     // Optional: Prüfe auf Fehlermeldungen auf der Seite
   45 |     const pageContent = await page.textContent('body');
   46 |     expect(pageContent).toContain('Account'); // Annahme: Die Account-Seite enthält diesen Text
   47 |   });
   48 |   
   49 |   // Test für nicht eingeloggten Benutzer
   50 |   test('Nicht eingeloggter Benutzer wird zur Account-Seite weitergeleitet', async ({ page }) => {
   51 |     // Simuliere einen nicht eingeloggten Benutzer
   52 |     await AuthHelper.loginAs(page, null);
   53 |     
   54 |     await page.goto('/andi-content.html');
   55 |     await waitForNavigation(page);
   56 |     
   57 |     // Entsprechend der netlify.toml sollte ein nicht eingeloggter Benutzer
   58 |     // zur Account-Seite weitergeleitet werden
>  59 |     expect(page.url()).toContain('account.html');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
   60 |   });
   61 | });
   62 |
   63 | // Tests für Download-Zugriff
   64 | test.describe('Zugriff auf geschützte Downloads', () => {
   65 |   test('Benutzer "andi" kann auf seine Downloads zugreifen', async ({ page }) => {
   66 |     // Simuliere einen Benutzer mit der Rolle "andi"
   67 |     await AuthHelper.loginAs(page, 'andi');
   68 |     
   69 |     await page.goto('/downloads/andi/leitfaden_umgang_nps.pdf');
   70 |     await waitForNavigation(page);
   71 |     
   72 |     // Prüfe, ob kein Redirect erfolgt (bleibt auf der PDF-Seite)
   73 |     expect(page.url()).toContain('leitfaden_umgang_nps.pdf');
   74 |   });
   75 |   
   76 |   test('Benutzer ohne Berechtigung wird beim Zugriff auf Downloads weitergeleitet', async ({ page }) => {
   77 |     // Simuliere einen Benutzer mit einer anderen Rolle
   78 |     await AuthHelper.loginAs(page, 'ricardo');
   79 |     
   80 |     await page.goto('/downloads/andi/leitfaden_umgang_nps.pdf');
   81 |     await waitForNavigation(page);
   82 |     
   83 |     // Sollte zur Account-Seite weitergeleitet werden
   84 |     expect(page.url()).toContain('account.html');
   85 |   });
   86 | });
   87 |
   88 | // Tests für die allgemeinen Seiten
   89 | test.describe('Zugriff auf öffentliche Seiten', () => {
   90 |   test('Jeder kann auf die Hauptseite zugreifen', async ({ page }) => {
   91 |     await page.goto('/');
   92 |     await waitForNavigation(page);
   93 |     
   94 |     // Sollte auf der Hauptseite bleiben oder zu index.html weitergeleitet werden
   95 |     expect(page.url()).toMatch(/\/(index\.html)?$/);
   96 |   });
   97 |   
   98 |   test('Jeder kann auf die Info-Seite zugreifen', async ({ page }) => {
   99 |     await page.goto('/info.html');
  100 |     await waitForNavigation(page);
  101 |     
  102 |     // Sollte auf der Info-Seite bleiben
  103 |     expect(page.url()).toContain('info.html');
  104 |   });
  105 | });
  106 |
  107 | // Tests für Fallback-Regeln
  108 | test.describe('Fallback-Regeln für nicht definierte Seiten', () => {
  109 |   test('Nicht existierende Seite wird zur Hauptseite weitergeleitet', async ({ page }) => {
  110 |     await page.goto('/nicht-existierende-seite.html');
  111 |     await waitForNavigation(page);
  112 |     
  113 |     // Sollte zur Hauptseite weitergeleitet werden gemäß der letzten Regel in netlify.toml
  114 |     expect(page.url()).toMatch(/\/(index\.html)?$/);
  115 |   });
  116 | });
```