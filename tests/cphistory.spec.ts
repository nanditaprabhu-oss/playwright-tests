import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
    const { username, password } = user;

    test(`Open Committed payment details - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
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

        await test.step('Open CP detail', async () => {
            // Wait for the Customer group button to be visible

            const customerLink = page.locator('a').filter({ hasText: /^Debtors$/ });
            await customerLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
            await page.waitForTimeout(5000);
            // Click on the Customer groups menu
            await customerLink.click({ timeout: 5000 });
            //Open All customer groups list screen
            await page.getByText('All debtors').first().click({ timeout: 5000 });
            await expect(page.locator('.window-title-text')).toHaveText('All debtors');
            await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 60000 });

            //Customer group 1
            const searchTerm = 'D-000244950-00001';
            await page.getByRole('textbox').first().click({ timeout: 10000 });
            await page.getByRole('textbox').first().fill(searchTerm);
            await page.keyboard.press('Enter');
            await page.locator('.ag-overlay-loading-center').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => { });
            const firstRow = page.locator('.ag-center-cols-container .ag-row[row-index="0"]');
            await firstRow.waitFor({ state: 'visible', timeout: 30000 });
            await page.getByLabel('Press Space to toggle all').check({ timeout: 90000 });
            await page.waitForTimeout(300); // Wait after checkbox
            await page.locator('a').filter({ hasText: 'History committed payments' }).click({ timeout: 90000 });
            await expect(page.getByText('Completed', { exact: true })).toBeVisible({ timeout: 60000 });
            await page.locator('a', { hasText: 'Committed payment details' }).click();
            const committedContent = page.locator('#committed-payment-content-wrap');
            await expect(committedContent).toBeVisible({ timeout: 60_000 });
            console.log('Committed Payment opened is Visible');


        });
    });
});