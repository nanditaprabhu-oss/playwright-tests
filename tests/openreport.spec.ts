import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
    const { username, password } = user;

    test(`Open reports on Debtor list, Invoice list and Dispute list screens- User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
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
        await test.step('Open Debtors reports', async () => {

            // Find an 'a' (link) element with the exact text "Debtors" (using a regular expression for an exact match).
            const debtorLink = page.locator('a').filter({ hasText: /^Debtors$/ });

            // Wait for the Debtors button to be visible
            await debtorLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
            await page.waitForTimeout(5000);

            // Click on the Debtors menu
            await debtorLink.click({ timeout: 12000, force: true });
            //Open All debtors list screen
            await page.getByText('All debtors').first().click({ timeout: 5000 });
            await expect(page.locator('.window-title-text')).toHaveText('All debtors');
            await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
            await page.locator('input[name="pageSize"]').click();
            await page.locator('input[name="pageSize"]').fill('500');
            await page.locator('input[name="pageSize"]').press('Enter');
            await page.getByLabel('Press Space to toggle all').check();
            await page.locator('a').filter({ hasText: 'Reports' }).click();
            await page.getByText('Customers with outstanding').click();
            const page1Promise = page.waitForEvent('popup');
            await page.getByTitle('OK').click();
            const page1 = await page1Promise;
            await page1.getByText('Debtors with outstanding').nth(2).click();
            const originalTab = page;
            console.log('Debtor report opened successfully');
            let tabToClose;

            for (const p of page.context().pages()) {
                try {
                    if (await p.locator('#div5').isVisible({ timeout: 6000 })) {
                        tabToClose = p;
                        break;
                    }
                } catch {
                    // ignore pages where #div5 does not exist
                }
            }

            // Continue using the original tab
            await originalTab.bringToFront();
            await page.locator('a.close-window').click();
            await debtorLink.click({ timeout: 5000 });
        })


        // Start a new test step named 'Is the list visible?'.
        await test.step('Open Invoice reports', async () => {

            // Find an 'a' (link) element with the exact text "Debtors" (using a regular expression for an exact match).
            const invoiceLink = page.locator('a').filter({ hasText: /^Invoices$/ });

            // Wait for the Debtors button to be visible
            await invoiceLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
            await page.waitForTimeout(5000);

            // Click on the Debtors menu
            await invoiceLink.click({ timeout: 12000, force: true });
            //Open All debtors list screen
            await page.getByText('All invoices').first().click({ timeout: 5000 });
            await expect(page.locator('.window-title-text')).toHaveText('All invoices');
            await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
            await page.locator('input[name="pageSize"]').click();
            await page.locator('input[name="pageSize"]').fill('500');
            await page.locator('input[name="pageSize"]').press('Enter');
            await page.getByLabel('Press Space to toggle all').check();
            await page.locator('a').filter({ hasText: 'Reports' }).click();
            await page.getByText('Short invoices Excel overview').click();
            const page3Promise = page.waitForEvent('popup');
            await page.getByTitle('OK').click();
            const page3 = await page3Promise;
            await page3.getByRole('cell', { name: 'Short Invoices Excel Overview' }).click();
            const originalTab = page;
            console.log('Invoices report opened successfully');
            let tabToClose;

            for (const p of page.context().pages()) {
                try {
                    if (await p.locator('#div5').isVisible({ timeout: 6000 })) {
                        tabToClose = p;
                        break;
                    }
                } catch {
                    // ignore pages where #div5 does not exist
                }
            }

            // Continue using the original tab
            await originalTab.bringToFront();
            await page.locator('a.close-window').click();
            await invoiceLink.click({ timeout: 5000 });



        })

        await test.step('Open Dispute reports', async () => {

            // Find an 'a' (link) element with the exact text "Debtors" (using a regular expression for an exact match).
            const actionLink = page.locator('a').filter({ hasText: /^Disputes$/ });

            // Wait for the Debtors button to be visible
            await actionLink.waitFor({ state: 'visible', timeout: 20000 }); // 20000
            await page.waitForTimeout(5000);

            // Click on the Debtors menu
            await actionLink.click({ timeout: 12000, force: true });
            //Open All debtors list screen
            await page.getByText('All disputes').first().click({ timeout: 5000 });
            await expect(page.locator('.window-title-text')).toHaveText('All disputes');
            await page.locator('.ag-center-cols-container .ag-row').first().waitFor({ state: 'visible', timeout: 120000 });
            await page.locator('input[name="pageSize"]').click();
            await page.locator('input[name="pageSize"]').fill('500');
            await page.locator('input[name="pageSize"]').press('Enter');
            await page.getByLabel('Press Space to toggle all').check();
            await page.locator('a').filter({ hasText: 'Reports' }).click();
            await page.getByText('Summary disputes').click();
            const page4Promise = page.waitForEvent('popup');
            await page.getByTitle('OK').click();
            const page4 = await page4Promise;
            await page4.getByRole('cell', { name: 'Summary disputes' }).click();
            const originalTab = page;
            console.log('Disputes report opened successfully');
            let tabToClose;

            for (const p of page.context().pages()) {
                try {
                    if (await p.locator('#div5').isVisible({ timeout: 6000 })) {
                        tabToClose = p;
                        break;
                    }
                } catch {
                    // ignore pages where #div5 does not exist
                }
            }

            // Continue using the original tab
            await originalTab.bringToFront();

        })
    });
});
