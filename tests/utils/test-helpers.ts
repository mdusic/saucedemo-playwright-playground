import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Custom test fixture that includes page objects and helper functions
 */
export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});

/**
 * Helper function to generate a random string
 * @param length Length of the string to generate
 * @returns Random string
 */
export function generateRandomString(length: number): string {
    return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Helper function to wait for a condition
 * @param condition Function that returns a promise resolving to boolean
 * @param timeout Maximum time to wait in milliseconds
 * @param interval Interval between checks in milliseconds
 */
export async function waitForCondition(
    condition: () => Promise<boolean>,
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
    return false;
}

/**
 * Helper function to retry an action
 * @param action Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param interval Interval between attempts in milliseconds
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
 * Helper function to check if an element exists
 * @param locator Playwright locator
 * @returns Promise resolving to boolean
 */
export async function elementExists(locator: any): Promise<boolean> {
    try {
        await expect(locator).toBeVisible({ timeout: 1000 });
        return true;
    } catch {
        return false;
    }
}
