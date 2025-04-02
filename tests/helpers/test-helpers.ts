import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

type Fixtures = {
    loginPage: LoginPage;
};

/**
 * Custom test fixture that includes page objects and helper functions
 */
export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});

/**
 * Helper function to generate a random string
 * 
 * USE CASES:
 * - Creating unique usernames/emails for test users
 * - Testing input fields with random data
 * - Creating unique identifiers for test data
 * 
 * @param length Length of the string to generate
 * @returns Random string
 * 
 * @example
 * // Generate a random username
 * const username = `user_${generateRandomString(8)}`;
 */
export function generateRandomString(length: number): string {
    return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Helper function to wait for a specific condition to be true
 * 
 * USE CASES:
 * - Waiting for UI states that don't have specific selectors
 * - Polling for application state changes
 * - Custom wait conditions beyond standard Playwright waits
 * 
 * @param condition Function that returns a promise resolving to boolean
 * @param description Description of what we're waiting for (used in timeout error)
 * @param timeout Maximum time to wait in milliseconds
 * @param interval Interval between checks in milliseconds
 * 
 * @example
 * // Wait for cart count to reach 3
 * await waitForCondition(
 *     async () => {
 *         const count = await page.locator('.cart-count').textContent();
 *         return count === '3';
 *     },
 *     'Cart count to equal 3'
 * );
 */
export async function waitForCondition(
    condition: () => Promise<boolean>,
    description: string = 'Condition',
    timeout: number = 5000,
    interval: number = 100
): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (await condition()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    // If we get here, the condition never became true within the timeout
    throw new Error(`Timed out after ${timeout}ms waiting for: ${description}`);
}

/**
 * Helper function to retry an action multiple times before giving up
 * 
 * USE CASES:
 * - Handling flaky UI interactions
 * - Dealing with race conditions
 * - Retrying operations that might fail due to timing issues
 * 
 * This is different from waitForCondition because:
 * - It retries a complete action, not just checking a condition
 * - It handles and suppresses errors until the final attempt
 * - It's designed for active interactions, not passive waiting
 * 
 * @param action Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param interval Interval between attempts in milliseconds
 * 
 * @example
 * // Retry clicking a button that might be temporarily covered
 * await retry(async () => {
 *     await page.click('#submit-button');
 *     await expect(page.locator('.success-message')).toBeVisible();
 * });
 */
export async function retry<T>(
    action: () => Promise<T>,
    maxAttempts: number = 3,
    interval: number = 1000
): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await action();
        } catch (error) {
            lastError = error as Error;
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }
    }
    
    throw lastError;
}

/**
 * Helper function to check if an element exists without failing the test
 * 
 * USE CASES:
 * - Checking for optional elements that may or may not appear
 * - Conditional test flows based on UI state
 * - Verifying elements are NOT present without using negative assertions
 * 
 * @param locator Playwright locator
 * @returns Promise resolving to boolean
 * 
 * @example
 * // Check if a welcome message exists and take different actions
 * if (await elementExists(page.locator('.welcome-message'))) {
 *     await page.click('.dismiss-welcome');
 * }
 */
export async function elementExists(locator: any): Promise<boolean> {
    try {
        await expect(locator).toBeVisible({ timeout: 1000 });
        return true;
    } catch {
        return false;
    }
}
