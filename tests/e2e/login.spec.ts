import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login Flow', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        // Verify successful login by checking URL
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('should show error with invalid credentials', async () => {
        await loginPage.login('invalid_user', 'invalid_password');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username and password do not match');
    });

    test('should show error for locked out user', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Sorry, this user has been locked out');
    });
});
