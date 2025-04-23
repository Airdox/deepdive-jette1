# Test info

- Name: Netlify Redirects >> should redirect andi to andi-content.html
- Location: C:\Users\User\Desktop\Meine projekete\dein-projekt\tests\redirects.spec.js:4:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8888/andi-content.html
Call log:
  - navigating to "http://localhost:8888/andi-content.html", waiting until "load"

    at C:\Users\User\Desktop\Meine projekete\dein-projekt\tests\redirects.spec.js:5:16
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Netlify Redirects', () => {
   4 |   test('should redirect andi to andi-content.html', async ({ page }) => {
>  5 |     await page.goto('http://localhost:8888/andi-content.html');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8888/andi-content.html
   6 |     await expect(page).toHaveURL('http://localhost:8888/andi-content.html');
   7 |   });
   8 |
   9 |   test('should redirect unauthorized user to account.html', async ({ page }) => {
  10 |     await page.goto('http://localhost:8888/ricardo-content.html');
  11 |     await expect(page).toHaveURL('http://localhost:8888/account.html');
  12 |   });
  13 | });
```