import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
  const { username, password } = user;

  test(`Advanced search - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
    test.setTimeout(2500000);


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
    await test.step('Advanced Search, Create filter, show list', async () => {
      await page.waitForTimeout(500); // Brief pause between steps

      // Find an 'a' (link) element with the exact text "Debtors" (using a regular expression for an exact match).
      const debtorsLink = page.locator('a').filter({ hasText: /^Debtors$/ });

      // Wait for the Debtors button to be visible
      await debtorsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Debtors menu
      await debtorsLink.click({ timeout: 5000 });

            //Open All debtors list screen
      await page.getByText('All debtors').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All debtors');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.getByLabel('Press Space to toggle all').check({timeout:90000});
      await page.waitForTimeout(300); // Wait after checkbox

      await page.locator('a').filter({ hasText: 'Advanced search' }).click({timeout:90000});
      await page.waitForTimeout(600); // Wait for panel to open

      await page.locator('#tab-Debtors').getByText('Balance open', { exact: true }).click({timeout:90000});
      await page.waitForTimeout(400); // Wait after selecting field

      await expect(page.locator('.add_remove_items_outer > ul > li > a')).toBeVisible({timeout:90000});

      await page.locator('.add_remove_items_outer > ul > li > a').click({timeout:90000});
      await page.waitForTimeout(300); // Wait for dropdown

      await page.getByText('is greater than', { exact: true }).click({timeout:90000});
      await page.waitForTimeout(350); // Wait after selecting operator

      await page.getByRole('textbox', { name: 'Enter a value' }).click({timeout:90000});
      await page.waitForTimeout(200); // Pause before typing

      await page.getByRole('textbox', { name: 'Enter a value' }).fill('10000');
      await page.waitForTimeout(300); // Wait after typing value

      await expect(page.locator('.pull-left')).toBeVisible({timeout:90000});

      await page.locator('.pull-left').click({timeout:90000});
      await page.waitForTimeout(300); // Wait after adding criterion

      await page.getByTitle('OK').click({timeout:90000});
      await page.waitForTimeout(500); // Wait for dialog to process

      await page.getByRole('textbox', { name: '(*)' }).click();
      await page.waitForTimeout(200); // Pause before typing name

      await page.getByRole('textbox', { name: '(*)' }).fill('gt10007');
      await page.waitForTimeout(400); // Review the name before saving

      // Try to save the created selection
      await page.getByTitle('Save', { exact: true }).click({timeout:90000});
      await page.waitForTimeout(700); // Wait for save to complete  

      // Handle potential pop-ups
      try {
        await page.waitForTimeout(500); // Wait after closing popup
        await page.getByRole('button', { name: 'OK' }).click();
        await page.waitForTimeout(500); // Wait after clicking OK
      } catch (error) {
        
      }
      
      // Change to selections tab
      await page.getByText('Selections').click({timeout:90000});
      await page.waitForTimeout(500); // Wait for tab to load

      // Handle potential pop-ups
      try {
        await page.getByRole('button', { name: 'Yes' }).click();
        await page.waitForTimeout(300); // Wait after closing popup
      } catch (error) {
        
      }

      await page.locator('#advanceSearch').locator('a.btn-box.close-window').click();

      // Open saved selection
      await page.getByText('gt10007').first().click({timeout:90000});
      await page.waitForTimeout(900); // Wait for filtered list to load        

      // Check that any gridcell with content exists (not checking for specific text)
      // This will match any gridcell that has at least one character
      const cellLocator = page.getByRole('gridcell').filter({ hasText: /.+/ });

      // Assert that at least one gridcell with content is visible on the page.
      // The test will wait up to 10000ms (90 seconds) for it to become visible before failing.
      await expect(cellLocator.first()).toBeVisible({ timeout: 10000 });

    });
    })
});