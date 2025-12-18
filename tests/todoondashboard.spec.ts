import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
    const { username, password } = user;

    test(`Open ToDo list on dashboard - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
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


        await test.step('Click Phone action from ToDo list on the dashboard', async () => {

            const frame = page.frameLocator('#div5 iframe');

            const phoneAction = frame
                .locator('#dtActionsToDo')
                .getByText('Phone action', { exact: true });

            await expect(phoneAction).toBeVisible({ timeout: 60000 });
            await phoneAction.click();
            await expect(page.locator('#div5')).toBeVisible({ timeout: 60000 });
            const originalTab = page;
            console.log('To do action on Dashboard -Phone action test passed');
            // Find the tab/page that has the #div5 element visible
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

        });


        await test.step('Click Dunning letter action from ToDo list on the dashboard', async () => {

            const frame = page.frameLocator('#div5 iframe');

            const letterAction = frame
                .locator('#dtActionsToDo')
                .getByText('Dunning letter action', { exact: true });

            await expect(letterAction).toBeVisible({ timeout: 60000 });
            await letterAction.click();
            await expect(page.locator('#div5')).toBeVisible({ timeout: 60000 });
            const originalTab = page;
            console.log('To do action on Dashboard -Dunning letter action test passed');
            // Find the tab/page that has the #div5 element visible
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

        });

        await test.step('Click Query action from ToDo list on the dashboard', async () => {

            const frame = page.frameLocator('#div5 iframe');

            const queryAction = frame
                .locator('#dtActionsToDo')
                .getByText('Query', { exact: true });

            await expect(queryAction).toBeVisible({ timeout: 60000 });
            await queryAction.click();
            await expect(page.locator('#div5')).toBeVisible({ timeout: 60000 });
            const originalTab = page;
            console.log('To do action on Dashboard -Query action test passed');
            // Find the tab/page that has the #div5 element visible
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

        });

        await test.step('Click Reminder action from ToDo list on the dashboard', async () => {

            const frame = page.frameLocator('#div5 iframe');

            const reminderAction = frame
                .locator('#dtActionsToDo')
                .getByText('Reminder action', { exact: true });

            await expect(reminderAction).toBeVisible({ timeout: 60000 });
            await reminderAction.click();
            await expect(page.locator('#div5')).toBeVisible({ timeout: 60000 });
            const originalTab = page;
            console.log('To do action on Dashboard -Reminder action action test passed');
            // Find the tab/page that has the #div5 element visible
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

        });

        await test.step('Click Callback action from ToDo list on the dashboard', async () => {

            const frame = page.frameLocator('#div5 iframe');

            const callbackAction = frame
                .locator('#dtActionsToDo')
                .getByText('Callback action', { exact: true });

            await expect(callbackAction).toBeVisible({ timeout: 60000 });
            await callbackAction.click();
            await expect(page.locator('#div5')).toBeVisible({ timeout: 60000 });
            const originalTab = page;
            console.log('To do action on Dashboard -Callback action action test passed');
            // Find the tab/page that has the #div5 element visible
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

        });
    });
});