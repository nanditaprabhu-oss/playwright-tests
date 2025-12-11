import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
  const { username, password } = user;

  test(`List screen tests - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
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
      await test.step('Is the list visible?', async () => {

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
      await page.locator('a.close-window').click();

      // Open Debtors with outstanding invoices
      await page.getByText('Debtors with outstanding').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Debtors with outstanding invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      
      // Open Debtors with balance overdue
      await page.getByText('Debtors with balance overdue').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Debtors with balance overdue');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
      
      // Open Debtors with credit limit exceeded
      await page.getByText('Debtors with credit limit exceeded').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Debtors with credit limit exceeded');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
      await debtorsLink.click({ timeout: 5000 });

       // Wait for the Invoices button to be visible
      const invoicesLink = page.locator('a').filter({ hasText: /^Invoices$/ });
      await invoicesLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Invoices menu
      await invoicesLink.click({ timeout: 5000 });

      //Open All invoices list screen
      await page.getByText('All invoices').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      // Open Paid invoices
      await page.getByText('Paid Invoices').first().click({ timeout: 10000 });
      await expect(page.locator('.window-title-text')).toHaveText('Paid Invoices');
      await page.locator('.ag-center-cols-container').first().waitFor({state: 'visible',timeout: 50000});
      await page.locator('a.close-window').click();

      
      // Open Outstanding invoices
      await page.getByText('Outstanding invoices').nth(2).click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Outstanding invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
     
      // Open Overdue invoices
      await page.getByText('Overdue invoices').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Overdue invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click({ timeout: 5000 });
      await invoicesLink.click({ timeout: 10000 });
 
      // Wait for the Disputes button to be visible
      const disputesLink = page.locator('a').filter({ hasText: /^Disputes$/ });
      await disputesLink.waitFor({ state: 'visible', timeout: 50000 }); // 20000
      await page.waitForTimeout(15000);

      // Click on the Disputes menu
      await disputesLink.click({ timeout: 50000 });

      //Open All disputes list screen
      await page.getByText('All disputes').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All disputes');
      await page.locator('.ag-center-cols-container').first().waitFor({state: 'visible',timeout: 20000});
      await page.locator('a.close-window').click();

      // Oustanding Disputes
      await page.getByText('Outstanding queries').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Outstanding queries');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      
      // Overdue disputes
      await page.getByText('Disputes overdue').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Disputes overdue');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
     
      // Closed disputes
      await page.getByText('Closed disputes').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Closed disputes');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
      await disputesLink.click({ timeout: 5000 });

      // Wait for the Actions button to be visible
      const actionsLink = page.locator('a').filter({ hasText: /^Actions$/ });
      await actionsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Invoices menu
      await actionsLink.click({ timeout: 5000 });

      //Open All actions list screen
      await page.getByText('All actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      // Open Letter actions
      await page.getByText('Letter actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Letter actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      
      // Open Telephone actions
      await page.getByText('Telephone actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Telephone actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
     
      // Open Reminder actions
      await page.getByText('Reminder actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Reminder actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
      await actionsLink.click({ timeout: 5000 });

      
      // Wait for the Requests button to be visible
      const requestsLink = page.locator('a').filter({ hasText: /^Requests$/ });
      await requestsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Invoices menu
      await requestsLink.click({ timeout: 5000 });

      //Open All requests list screen
      await page.getByText('All requests').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All requests');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      // Open Pending requests
      await page.getByText('Pending requests').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Pending requests');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

       
      // Open My Sent Requests
      await page.getByText('My Sent Requests').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('My Sent Requests');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
      await requestsLink.click({ timeout: 5000 });

      // Wait for the Customer group button to be visible
      const customergroupsLink = page.locator('a').filter({ hasText: /^Customer groups$/ });
      await customergroupsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Customer groups menu
      await customergroupsLink.click({ timeout: 5000 });

      //Open All customer groups list screen
      await page.getByText('All customer groups').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All customer groups');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      // Open Customer groups with outstanding balance
      await page.getByText('Customer groups with outstanding balance').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Customer groups with outstanding balance');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();

      
      // Open Customer groups with balance overdue
      await page.getByText('Customer groups with balance overdue').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Customer groups with balance overdue');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
     
      // Open Customer groups with credit limit exceeded
      await page.getByText('Customer groups with credit limit exceeded').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Customer groups with credit limit exceeded');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({state: 'visible',timeout: 2500000});
      await page.locator('a.close-window').click();
      await customergroupsLink.click({ timeout: 5000 });


    });
 
    
  });
});
