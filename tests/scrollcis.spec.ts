import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
    const { username, password } = user;

    test(`Scroll through Customer information screen - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
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
                } catch (error) {
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

        await test.step('Scroll through letter history', async () => {
            const debtorsLink = page.locator('a').filter({ hasText: /^Debtors$/ });
            await debtorsLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
            await page.waitForTimeout(5000);
            await debtorsLink.click({ timeout: 5000 });
            await page.getByText('Debtors with outstanding').first().click({ timeout: 5000 });
            await expect(page.locator('.window-title-text')).toHaveText('Debtors with outstanding invoices');
            await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 15000 });
            const searchTerm = 'D-0003006';
            await page.getByRole('textbox').first().click({ timeout: 10000 });
            await page.getByRole('textbox').first().fill(searchTerm);
            await page.keyboard.press('Enter');
            await page.locator('.ag-overlay-loading-center').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => { });
            const firstRow = page.locator('.ag-center-cols-container .ag-row[row-index="0"]');
            await firstRow.waitFor({ state: 'visible', timeout: 30000 });

            // Quick search for debtors with number starting with 'D' and export to excel all those filtered records.
            const cellLocator = page.getByRole('gridcell').filter({ hasText: /.+/ });
            await page.getByLabel('Press Space to toggle all').check({ timeout: 90000 });
            await page.locator('a').filter({ hasText: 'Customer information screen' }).click({ timeout: 90000 });
            const totalPagesText = await page.locator('.selected-debtors-number').innerText();

            const totalPages = Number(totalPagesText.replace('/', '').trim());

            const nextBtn = page.getByText('❯Next');
            const currentPage = page.locator('.current-debtor-number strong');

            for (let pageNo = 1; pageNo < totalPages; pageNo++) {

                // wait until page number is updated
                await expect(currentPage).toHaveText(String(pageNo), { timeout: 30_000 });
                await page.locator('.ag-center-cols-viewport').waitFor({ state: 'visible', timeout: 30_000 });
                await Promise.all([page.waitForLoadState('networkidle'), nextBtn.click()]);
            }



        })
    })
});
