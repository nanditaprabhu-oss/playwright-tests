import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
  const { username, password } = user;

  test(`Load List screen tests Debtors,Invoices,Disputes,Requests,Customer groups and Actions- User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
    test.setTimeout(250000);


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
    await test.step('Open List screens-Debtors, Invoices, Disputes, Requests, Customer groups and Actions including their submenus', async () => {

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

      // Open Debtors with outstanding invoices
      const startTime1 = Date.now();
      await page.getByText('Debtors with outstanding').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Debtors with outstanding invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs1 = Date.now() - startTime1;
      console.log(`Debtors with outstanding loading time ${loadTimeMs1} ms`);
      await page.locator('a.close-window').click();


      // Open Debtors with balance overdue
      const startTime2 = Date.now();
      await page.getByText('Debtors with balance overdue').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Debtors with balance overdue');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs2 = Date.now() - startTime2;
      console.log(`Debtors with balance overdue loading time ${loadTimeMs2} ms`);
      await page.locator('a.close-window').click();

      // Open Debtors with credit limit exceeded
      const startTime4 = Date.now();
      await page.getByText('Debtors with credit limit exceeded').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Debtors with credit limit exceeded');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs4 = Date.now() - startTime4;
      console.log(`Debtors with credit limit exceeded loading time ${loadTimeMs4} ms`);
      await page.locator('a.close-window').click();
      await debtorsLink.click({ timeout: 5000 });

      // Wait for the Invoices button to be visible
      const invoicesLink = page.locator('a').filter({ hasText: /^Invoices$/ });
      await invoicesLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Invoices menu
      await invoicesLink.click({ timeout: 12000, force: true });

      //Open All invoices list screen
      const startTime5 = Date.now();
      await page.getByText('All invoices').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs5 = Date.now() - startTime5;
      console.log(`All Invoices loading time ${loadTimeMs5} ms`);
      await page.locator('a.close-window').click();

      // Open Paid invoices
      const startTime6 = Date.now();
      await page.getByText('Paid Invoices').first().click({ timeout: 10000 });
      await expect(page.locator('.window-title-text')).toHaveText('Paid Invoices');
      await page.locator('.ag-center-cols-container').first().waitFor({ state: 'visible', timeout: 50000 });
      const loadTimeMs6 = Date.now() - startTime6;
      console.log(`Paid Invoices loading time ${loadTimeMs6} ms`);
      await page.locator('a.close-window').click();


      // Open Outstanding invoices
      const startTime7 = Date.now();
      await page.getByText('Outstanding invoices').nth(2).click({ timeout: 9000 });
      await expect(page.locator('.window-title-text')).toHaveText('Outstanding invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 90000 });
      const loadTimeMs7 = Date.now() - startTime7;
      console.log(`Outstanding invoices loading time ${loadTimeMs7} ms`);
      await page.locator('a.close-window').click();

      // Open Overdue invoices
      const startTime8 = Date.now();
      await page.getByText('Overdue invoices').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Overdue invoices');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs8 = Date.now() - startTime8;
      console.log(`Overdue Invoices loading time ${loadTimeMs8} ms`);
      await page.locator('a.close-window').click({ timeout: 5000 });
      await invoicesLink.click({ timeout: 50000 });

      // Wait for the Actions button to be visible
      const actionsLink = page.locator('a').filter({ hasText: /^Actions$/ });
      await actionsLink.waitFor({ state: 'visible', timeout: 9000 }); // 20000
      await page.waitForTimeout(9000);
      //await page.pause();

      // Click on the Invoices menu
      await actionsLink.click({ timeout: 12000, force: true });

      //Open All actions list screen
      const startTime13 = Date.now();
      await page.getByText('All actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs13 = Date.now() - startTime13;
      console.log(`All actions loading time ${loadTimeMs13} ms`);
      await page.locator('a.close-window').click();

      // Open Letter actions
      const startTime14 = Date.now();
      await page.getByText('Letter actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Letter actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs14 = Date.now() - startTime14;
      console.log(`Letter actions loading time ${loadTimeMs14} ms`);
      await page.locator('a.close-window').click();


      // Open Telephone actions
      const startTime15 = Date.now();
      await page.getByText('Telephone actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Telephone actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs15 = Date.now() - startTime15;
      console.log(`Telephone actions loading time ${loadTimeMs15} ms`);
      await page.locator('a.close-window').click();

      // Open Reminder actions
      const startTime16 = Date.now();
      await page.getByText('Reminder actions').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Reminder actions');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs16 = Date.now() - startTime16;
      console.log(`Reminder loading time ${loadTimeMs16} ms`);
      await page.locator('a.close-window').click();
      await actionsLink.click({ timeout: 5000 });



      // Wait for the Disputes button to be visible
      const disputesLink = page.locator('.middle-align', { hasText: /^Disputes$/ });
      await disputesLink.waitFor({ state: 'visible', timeout: 9000 }); // 20000
      await page.waitForTimeout(9000);

      // Click on the Disputes menu
      await disputesLink.click({ timeout: 12000, force: true });

      //Open All disputes list screen
      const startTime9 = Date.now();
      await page.getByText('All disputes').first().click({ timeout: 40000 });
      await expect(page.locator('.window-title-text')).toHaveText('All disputes');
      await page.locator('.ag-center-cols-container').first().waitFor({ state: 'visible', timeout: 20000 });
      const loadTimeMs9 = Date.now() - startTime9;
      console.log(`All disputes loading time ${loadTimeMs9} ms`);
      await page.locator('a.close-window').click();

      // Oustanding Disputes
      const startTime10 = Date.now();
      await page.getByText('Outstanding queries').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Outstanding queries');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs10 = Date.now() - startTime10;
      console.log(`Outstanding disputes loading time ${loadTimeMs10} ms`);
      await page.locator('a.close-window').click();


      // Overdue disputes
      const startTime11 = Date.now();
      await page.getByText('Disputes overdue').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Disputes overdue');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs11 = Date.now() - startTime11;
      console.log(`Overdue disputes loading time ${loadTimeMs11} ms`);
      await page.locator('a.close-window').click();

      // Closed disputes
      const startTime12 = Date.now();
      await page.getByText('Closed disputes').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Closed disputes');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 150000 });
      const loadTimeMs12 = Date.now() - startTime12;
      console.log(`Closed disputes loading time ${loadTimeMs12} ms`);
      await page.locator('a.close-window').click();
      await disputesLink.click({ timeout: 5000 });


      // Wait for the Requests button to be visible
      const requestsLink = page.locator('a').filter({ hasText: /^Requests$/ });
      await requestsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      //await page.waitForTimeout(60000);

      // Click on the Invoices menu
      await requestsLink.click({ timeout: 12000, force: true });


      //Open All requests list screen
      const startTime17 = Date.now();
      await page.getByText('All requests').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All requests');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs17 = Date.now() - startTime17;
      console.log(`All Requests loading time ${loadTimeMs17} ms`);
      await page.locator('a.close-window').click();

      // Open Pending requests
      const startTime18 = Date.now();
      await page.getByText('Pending requests').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Pending requests');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs18 = Date.now() - startTime18;
      console.log(`Pending Requests loading time ${loadTimeMs18} ms`);
      await page.locator('a.close-window').click();


      // Open My Sent Requests
      const startTime19 = Date.now();
      await page.getByText('My Sent Requests').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('My Sent Requests');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs19 = Date.now() - startTime19;
      console.log(`Sent Requests loading time ${loadTimeMs19} ms`);
      await page.locator('a.close-window').click();
      await requestsLink.click({ timeout: 5000 });

      // Wait for the Customer group button to be visible
      const customergroupsLink = page.locator('a').filter({ hasText: /^Customer groups$/ });
      await customergroupsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
      await page.waitForTimeout(5000);

      // Click on the Customer groups menu
      await customergroupsLink.click({ timeout: 60000, force: true });

      //Open All customer groups list screen
      const startTime20 = Date.now();
      await page.getByText('All customer groups').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('All customer groups');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 150000 });
      const loadTimeMs20 = Date.now() - startTime20;
      console.log(`All Debtors groups loading time ${loadTimeMs20} ms`);
      await page.locator('a.close-window').click();

      // Open Customer groups with outstanding balance
      const startTime21 = Date.now();
      await page.getByText('Customer groups with outstanding balance').first().click({ timeout: 10000 });
      await expect(page.locator('.window-title-text')).toHaveText('Customer groups with outstanding balance');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 150000 });
      const loadTimeMs21 = Date.now() - startTime21;
      console.log(`Debtors groups with balance outstanding loading time ${loadTimeMs21} ms`);
      await page.locator('a.close-window').click();


      // Open Customer groups with balance overdue
      const startTime22 = Date.now();
      await page.getByText('Customer groups with balance overdue').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Customer groups with balance overdue');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs22 = Date.now() - startTime22;
      console.log(`Debtors groups with balance overdue loading time ${loadTimeMs22} ms`);
      await page.locator('a.close-window').click();

      // Open Customer groups with credit limit exceeded
      const startTime23 = Date.now();
      await page.getByText('Customer groups with credit limit exceeded').first().click({ timeout: 5000 });
      await expect(page.locator('.window-title-text')).toHaveText('Customer groups with credit limit exceeded');
      await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
      const loadTimeMs23 = Date.now() - startTime22;
      console.log(`Debtors groups with credit limit exceeded loading time ${loadTimeMs22} ms`);
      await page.locator('a.close-window').click();
      await customergroupsLink.click({ timeout: 5000 });


    });


  });
});
