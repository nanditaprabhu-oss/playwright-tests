import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
  const { username, password } = user;

  test(`Scroll through history - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
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

    // Open debtor list screen>>Go to Debtors with outstanding invoices drop down menu

      await test.step('Open notes for large customer groups', async () => {
            // Wait for the Customer group button to be visible
      
      const customergroupsLink = page.locator('a').filter({ hasText: /^Customer groups$/ });
      await customergroupsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);
      // Click on the Customer groups menu
      await customergroupsLink.click({ timeout: 5000 });
      //Open All customer groups list screen
      await page.getByText('All customer groups').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All customer groups');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 60000});

      //Customer group 1
      const searchTerm = 'ISS-F';
      await page.getByRole('textbox').first().click({ timeout: 10000 });
      await page.getByRole('textbox').first().fill(searchTerm);
      await page.keyboard.press('Enter');
      await page.locator('.ag-overlay-loading-center').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});      
      const firstRow = page.locator('.ag-center-cols-container .ag-row[row-index="0"]');
      await firstRow.waitFor({ state: 'visible', timeout: 30000 });
      await page.getByLabel('Press Space to toggle all').check({timeout:90000});
      await page.waitForTimeout(300); // Wait after checkbox
      await page.locator('a').filter({ hasText: 'Notes' }).click({timeout:90000});
      const start = Date.now();
      await expect(page.locator('.ag-cell[col-id="note_text"] span').first()).toContainText(/\S/, { timeout: 30000 });
      const loadTimeMs = Date.now() - start;
      console.log(`Notes loaded for customer ISS-F in ${loadTimeMs} ms`);
      await page.locator('a').filter({ hasText: 'Cancel' }).click({ timeout: 120000 });
      await page.locator('a.close-window').click();



    //Customer group 2
      await page.getByText('All customer groups').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All customer groups');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 60000});
      const searchTerm1 = 'JDW_PEST';
      await page.getByRole('textbox').first().click({ timeout: 10000 });
      await page.getByRole('textbox').first().fill(searchTerm1);
      await page.keyboard.press('Enter');
      await page.locator('.ag-overlay-loading-center').waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});      
      const firstRow1 = page.locator('.ag-center-cols-container .ag-row[row-index="0"]');
      await firstRow1.waitFor({ state: 'visible', timeout: 60000 });
      await page.getByLabel('Press Space to toggle all').check({timeout:90000});
      await page.waitForTimeout(6000); // Wait after checkbox
      await page.locator('a').filter({ hasText: 'Notes' }).click({timeout:90000});
      const start1 = Date.now();
      await expect(page.locator('.ag-cell[col-id="note_text"] span').first()).toContainText(/\S/, { timeout: 30000 });
      const loadTimeMs1 = Date.now() - start1;
      console.log(`Notes loaded for JDW_PEST in ${loadTimeMs1} ms`);
      await page.locator('a').filter({ hasText: 'Cancel' }).click({ timeout: 90000 });
      await page.locator('a.close-window').click();


      
    //Customer group 3
      await page.getByText('All customer groups').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All customer groups');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 60000});
      const searchTerm2 = 'SODEXO-D';
      await page.getByRole('textbox').first().click({ timeout: 10000 });
      await page.getByRole('textbox').first().fill(searchTerm2);
      await page.keyboard.press('Enter');
      await page.locator('.ag-overlay-loading-center').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});      
      const firstRow2 = page.locator('.ag-center-cols-container .ag-row[row-index="0"]');
      await firstRow2.waitFor({ state: 'visible', timeout: 30000 });
      await page.getByLabel('Press Space to toggle all').check({timeout:90000});
      await page.waitForTimeout(300); // Wait after checkbox
      await page.locator('a').filter({ hasText: 'Notes' }).click({timeout:90000});
      const start2 = Date.now();
      await expect(page.locator('.ag-cell[col-id="note_text"] span').first()).toContainText(/\S/, { timeout: 30000 });
      const loadTimeMs2 = Date.now() - start2;
      console.log(`Notes loaded for SODEXO-D in ${loadTimeMs2} ms`);
      await page.locator('a').filter({ hasText: 'Cancel' }).click({ timeout: 90000 });
      await page.locator('a.close-window').click();


      //Customer group 4
      await page.getByText('All customer groups').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All customer groups');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 60000});
      const searchTerm3 = 'COMPASS-D';
      await page.getByRole('textbox').first().click({ timeout: 10000 });
      await page.getByRole('textbox').first().fill(searchTerm3);
      await page.keyboard.press('Enter');
      await page.locator('.ag-overlay-loading-center').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});      
      const firstRow3 = page.locator('.ag-center-cols-container .ag-row[row-index="0"]');
      await firstRow3.waitFor({ state: 'visible', timeout: 30000 });
      await page.getByLabel('Press Space to toggle all').check({timeout:90000});
      await page.waitForTimeout(300); // Wait after checkbox
      await page.locator('a').filter({ hasText: 'Notes' }).click({timeout:90000});
      const start3 = Date.now();
      await expect(page.locator('.ag-cell[col-id="note_text"] span').first()).toContainText(/\S/, { timeout: 30000 });
      const loadTimeMs3 = Date.now() - start3;
      console.log(`Notes loaded for COMPASS-D in ${loadTimeMs3} ms`);
      await page.locator('a').filter({ hasText: 'Cancel' }).click({ timeout: 90000 });
      await page.locator('a.close-window').click();

      //Customer group 5
      await page.getByText('All customer groups').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All customer groups');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 60000});
      const searchTerm4 = 'GREENKING-D';
      await page.getByRole('textbox').first().click({ timeout: 10000 });
      await page.getByRole('textbox').first().fill(searchTerm4);
      await page.keyboard.press('Enter');
      await page.locator('.ag-overlay-loading-center').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});      
      const firstRow4 = page.locator('.ag-center-cols-container .ag-row[row-index="0"]');
      await firstRow4.waitFor({ state: 'visible', timeout: 30000 });
      await page.getByLabel('Press Space to toggle all').check({timeout:90000});
      await page.waitForTimeout(300); // Wait after checkbox
      await page.locator('a').filter({ hasText: 'Notes' }).click({timeout:90000});
      const start4 = Date.now();
      await expect(page.locator('.ag-cell[col-id="note_text"] span').first()).toContainText(/\S/, { timeout: 30000 });
      const loadTimeMs4 = Date.now() - start4;
      console.log(`Notes loaded for GREENKING-D in ${loadTimeMs4} ms`);
      await page.locator('a').filter({ hasText: 'Cancel' }).click({ timeout: 90000 });
      await page.locator('a.close-window').click();

});
});

});
