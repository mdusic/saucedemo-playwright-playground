import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../data/login-data';
import { test } from '../utils/test-helpers';

/**
 * Test suite for login functionality
 * Tests various login scenarios including successful and failed attempts
 */
test.describe('Login Functionality', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
        // Verify we're on the login page before each test
        await loginPage.verifyLoginPage();
    });

    test('should login successfully with valid credentials @smoke', async () => {
        // When: User logs in with valid credentials
        await loginPage.login(
            loginData.validUser.username,
            loginData.validUser.password
        );

        // Then: Login should be successful
        await expect(async () => {
            const isSuccessful = await loginPage.isLoginSuccessful();
            expect(isSuccessful).toBe(true);
        }).toPass({ timeout: 10000 });
    });

    test('should show error with invalid credentials @regression', async () => {
        // When: User attempts to login with invalid credentials
        await loginPage.login(
            loginData.invalidUser.username,
            loginData.invalidUser.password
        );

        // Then: Error message should be displayed
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.invalidUser.expectedError);
    });

    test('should show error for locked out user @regression', async () => {
        // When: Locked out user attempts to login
        await loginPage.login(
            loginData.lockedUser.username,
            loginData.lockedUser.password
        );

        // Then: Appropriate error message should be displayed
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.lockedUser.expectedError);
    });

    test('should maintain error message visibility @regression', async () => {
        // When: User attempts to login with invalid credentials
        await loginPage.login(
            loginData.invalidUser.username,
            loginData.invalidUser.password
        );

        // Then: Error should remain visible
        await expect(async () => {
            const errorMessage = await loginPage.getErrorMessage();
            expect(errorMessage).not.toBeNull();
        }).toPass();
    });
});
