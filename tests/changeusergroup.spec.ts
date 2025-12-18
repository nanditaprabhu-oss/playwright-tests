import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
  const { username, password } = user;

  test(`Change Usergroup on Home screen and check loading of lists screens - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
    test.setTimeout(200000);


    await test.step('Login operations', async () => {
      await page.goto(url);

      // Only works with 2.6.x
      await page.getByRole('combobox').click();

      await test.step('Change login language', async () => {
        await page.getByText('English').click();
      });

      // Only works after 2.6.x
      await page.locator('input[name="username"]').click({ timeout: 5000 });
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="username"]').press('Tab');
      await page.getByRole('textbox', { name: 'Password:' }).fill(password);
      await page.getByRole('button', { name: 'Continue' }).click({ timeout: 5000 });

      await test.step('If condition for the modal that appears when already logged in', async () => {
        // --- Optional "Yes" Button and Popup Operations ---
        // Define the "Yes" button selector
        const yesButton = page.getByRole('button', { name: 'Yes' });
        try {
          // Wait up to 2 seconds for the button to become visible (timeout: 2000ms)
          await yesButton.waitFor({ state: 'visible', timeout: 2000 });
          // Click the "Yes" button
          await yesButton.click();
          // If the button is found and visible (no error thrown), execute the following:
          // console.log('"Yes" button found, clicking and starting popup operations.');
        } catch (error) {
          // If the button does not become visible within 2 seconds (waitFor throws an error)
          // The 'catch' block runs, logs the message, and the test continues.
          // console.log('Optional "Yes" button not found, skipping popup steps.');
        }
      });
    });

    await test.step('Are we on Creditnext/root?', async () => {
      try {
        await page.waitForURL(/.*\/CreditNext\/root.*/, { timeout: 30000 });
      } catch (error) {
        throw new Error('Login procedure failed. Not redirected to /CreditNext/root as expected.');
        //await page.goto('https://rtk_perf.onguardconnext.com/CreditNext/root', { timeout: 10000 });
      }
    });

    // await test.step('Change dashboard language', async () => {
    //   await page.locator('#lang').selectOption('130');
    // });

    // Start a new test step named 'Is the list visible?'.
    await test.step('Is the list visible?', async () => {

      // Find an 'a' (link) element with the exact text "Debtors" (using a regular expression for an exact match).
      const debtorsLink = page.locator('a').filter({ hasText: /^Debtors$/ });

      // Wait for the Debtors button to be visible
      await debtorsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Debtors menu
      await debtorsLink.click({ timeout: 12000, force: true });
      const startTime = Date.now();
      //Open All debtors list screen
      await page.getByText('All debtors').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All debtors');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs = Date.now() - startTime;
      console.log(`All Debtors loading time ${loadTimeMs} ms`);
      await page.locator('a.close-window').click();

      //Change the usergroup

      const userGroup = page.locator('#userGroup');

      await userGroup.waitFor({ state: 'visible', timeout: 60000 });

      const options = await page.locator('#userGroup option').count();

      // Skip first option if it’s default
      await userGroup.selectOption({ index: 1 });

      try {
        await page.waitForURL(/.*\/CreditNext\/root.*/, { timeout: 60000 });
      }
      catch (error) {
        throw new Error('Login procedure failed. Not redirected to /CreditNext/root as expected.');
      };

      // Find an 'a' (link) element with the exact text "Debtors" (using a regular expression for an exact match).

      const debtorsLink1 = page.locator('a').filter({ hasText: /^Debtors$/ });

      // Wait for the Debtors button to be visible
      await debtorsLink1.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Debtors menu
      await debtorsLink.click({ timeout: 12000, force: true });
      const startTimenew = Date.now();
      //Open All debtors list screen
      await page.getByText('All debtors').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All debtors');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMsnew = Date.now() - startTimenew;
      console.log(`All Debtors loading time after usergroup change ${loadTimeMsnew} ms`);
      await page.locator('a.close-window').click();

      await debtorsLink.click({ timeout: 5000 });

      // Wait for the Invoices button to be visible
      const invoicesLink = page.locator('a').filter({ hasText: /^Invoices$/ });
      await invoicesLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      //Change usergroup
      await page.locator('#userGroup option').count();

      // Skip first option if it’s default
      await userGroup.selectOption({ index: 2 });
      // Find an 'a' (link) element with the exact text "Debtors" (using a regular expression for an exact match).
      const debtorsLink2 = page.locator('a').filter({ hasText: /^Debtors$/ });

      // Wait for the Debtors button to be visible
      await debtorsLink2.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Debtors menu
      await debtorsLink.click({ timeout: 12000, force: true });
      const startTimenew2 = Date.now();
      //Open All debtors list screen
      await page.getByText('All debtors').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All debtors');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMsnew2 = Date.now() - startTimenew2;
      console.log(`All Debtors loading time after usergroup back to original ${loadTimeMsnew2} ms`);
      await page.locator('a.close-window').click();

    });

  });
});
