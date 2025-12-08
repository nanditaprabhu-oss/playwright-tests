import { test, expect } from '@playwright/test';
import credentials from './data/credentials';

const { url } = credentials;

credentials.users.forEach((user, index) => {
  const { username, password } = user;

  test(`UK CreditNext Performance Test No:5 - User: ${username} (${index + 1}/${credentials.users.length})`, async ({ page }) => {
    test.setTimeout(60000);

    // Random wait before starting the test not required.
    // await test.step('Random wait before starting the test', async () => {
    //   const numberRandom = Math.floor(Math.random() * 10000);
    //   await page.waitForTimeout(numberRandom);
    // });

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

      await page.waitForTimeout(500);

      // Click the Debtors link
      await debtorsLink.click({ timeout: 5000 });

      // Find an element with the text "Debtors with outstanding". If multiple elements match, select the first one.
      // Then, click it. Wait up to 10000ms (10 seconds).
      await page.getByText('Debtors with outstanding').first().click({ timeout: 5000 });

      const loadingOverlay = page.locator('.ag-overlay-loading-wrapper');
      await expect(loadingOverlay).toBeHidden({ timeout: 5000 });

      // Define the search term - change this to search for any string
      const searchTerm = 'C00037';

      await page.getByRole('textbox').first().click({ timeout: 20000 });
      await page.getByRole('textbox').first().fill(searchTerm);

      // Check that any gridcell with content exists (not checking for specific text)
      // This will match any gridcell that has at least one character
      const cellLocator = page.getByRole('gridcell').filter({ hasText: /.+/ });

      // Assert that at least one gridcell with content is visible on the page.
      // The test will wait up to 5000ms (90 seconds) for it to become visible before failing.
      await expect(cellLocator.first()).toBeVisible({ timeout: 5000 });

      // End the 'Is the list visible?' test step.
    });


    /* Turn off for 259 validation.
    
    // Start a new test step named 'Change positions of columns'.
    await test.step('Change positions of columns', async () => {

      // Define a locator for the element that contains the text "Debtor name".
      const debtorNameElement = page.getByText('Debtor name');

      // Define a constant for the horizontal distance (in pixels) we want to drag the element.
      const pixelsToDragRight = 500;

      // Get the element's position (x, y) and dimensions (width, height) from the page.
      // This is an asynchronous operation, so we 'await' it.
      const boundingBox = await debtorNameElement.boundingBox({ timeout: 5000 });

      // Check if the boundingBox is null or undefined (which happens if the element is not found or not visible).
      if (!boundingBox) {
        // If the element isn't found, stop the test and throw an error with a clear message.
        throw new Error('No item found to drag or the item is not visible.');
      }

      // Calculate the starting X-coordinate (horizontal center) of the element to begin the drag.
      const startX = boundingBox.x + boundingBox.width / 2;

      // Calculate the starting Y-coordinate (vertical center) of the element.
      const startY = boundingBox.y + boundingBox.height / 2;

      // Calculate the target X-coordinate by adding the desired drag distance to the starting X-coordinate.
      const endX = startX + pixelsToDragRight;

      // The target Y-coordinate remains the same as the start, as we are only moving horizontally.
      const endY = startY;

      // --- Start of the mouse drag-and-drop sequence ---

      // Move the mouse cursor to the calculated starting position (the center of the element).
      await page.mouse.move(startX, startY);

      // Press and hold the left mouse button (simulating a "click and hold").
      await page.mouse.down();

      // Move the mouse (while the button is still held down) to the target coordinates.
      // The '{ steps: 5 }' option makes the movement smoother, simulating a more human-like drag in 5 small steps.
      await page.mouse.move(endX, endY, { steps: 5 });

      // Release the left mouse button to "drop" the element at its new location.
      await page.mouse.up();

      // End the 'Change positions of columns' test step.

      
    });
    */
  });
});
