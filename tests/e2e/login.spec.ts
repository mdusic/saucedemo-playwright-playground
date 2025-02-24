import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { users, loginErrors } from '../data/users.data';
import { loginLocators } from '../locators/login.locators';
import { inventoryLocators } from '../locators/inventory.locators';
import { test } from '../utils/test-helpers';

/**
 * Test suite for login functionality
 * Tests various login scenarios including successful and failed attempts
 */
test.describe('Login Functionality', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
        // Verify we're on the login page before each test
        await loginPage.verifyLoginPage();
    });

    test('should login successfully with valid credentials @smoke', async ({ page, loginPage }) => {
        // When: User logs in with valid credentials
        await loginPage.login(
            users.standard.username,
            users.standard.password
        );

        // Then: Should be redirected to inventory page
        await expect(page).toHaveURL(/.*inventory.html/);
        
        // And: Inventory container should be visible
        await expect(page.locator(inventoryLocators.inventoryContainer)).toBeVisible();
        
        // And: Page title should be correct
        const title = await loginPage.getPageTitle();
        expect(title).toBe(users.standard.expectedTitle);
    });

    test('should show error with invalid credentials @regression', async ({ loginPage }) => {
        // When: User attempts to login with invalid credentials
        await loginPage.login(
            'invalid_user',
            'wrong_password'
        );

        // Then: Error message should be displayed
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginErrors.invalidCredentials);
    });

    test('should show error for locked out user @regression', async ({ loginPage }) => {
        // When: Locked out user attempts to login
        await loginPage.login(
            users.locked.username,
            users.locked.password
        );

        // Then: Error message should be displayed
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(users.locked.expectedError);
    });

    test('should maintain error message visibility @regression', async ({ page, loginPage }) => {
        // When: User attempts to login with invalid credentials
        await loginPage.login(
            'invalid_user',
            'wrong_password'
        );

        // Then: Error should remain visible
        await expect(page.locator(loginLocators.errorMessage)).toBeVisible();
    });
});
