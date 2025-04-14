import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginLocators } from '../tests/locators/login.locators';

/**
 * Page Object Model class for the Login page
 * Contains all interactions and verifications for the login functionality
 */
export class LoginPage extends BasePage {
    // No need to redefine locators that are already in the locators file
    // We'll use them directly from the imported loginLocators

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the login page
     */
    async goto() {
        await this.page.goto('/');
        await this.waitForLoginForm();
    }

    /**
     * Perform complete login with provided credentials
     * This is the recommended method for most test cases when you need to perform a standard login
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async login(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    /**
     * Enter username in the username field
     * Only use this method instead of login() when you need to perform specific steps separately,
     * such as for negative tests or special interaction testing
     * @param username - Username to enter
     */
    async enterUsername(username: string) {
        await this.typeWithDelay(loginLocators.usernameInput, username);
    }

    /**
     * Enter password in the password field
     * Only use this method instead of login() when you need to perform specific steps separately,
     * such as for negative tests or special interaction testing
     * @param password - Password to enter
     */
    async enterPassword(password: string) {
        await this.typeWithDelay(loginLocators.passwordInput, password);
    }

    /**
     * Click the login button
     * Only use this method instead of login() when you need to perform specific steps separately,
     * such as for negative tests or special interaction testing
     */
    async clickLogin() {
        await this.page.click(loginLocators.loginButton);
    }

    /**
     * Get the error message if present
     * @returns Promise<string | null> - Error message text or null if not present
     */
    async getErrorMessage(): Promise<string | null> {
        const errorElement = this.page.locator(loginLocators.errorMessage);
        if (await errorElement.isVisible()) {
            return errorElement.textContent();
        }
        return null;
    }

    /**
     * Wait for the login form to be visible
     */
    private async waitForLoginForm() {
        await this.waitForElement(loginLocators.usernameInput);
        await this.waitForElement(loginLocators.passwordInput);
        await this.waitForElement(loginLocators.loginButton);
    }

    /**
     * Verify that we're on the login page
     */
    async verifyLoginPage() {
        await expect(this.page.locator(loginLocators.usernameInput)).toBeVisible();
        await expect(this.page.locator(loginLocators.passwordInput)).toBeVisible();
        await expect(this.page.locator(loginLocators.loginButton)).toBeVisible();
    }

    /**
     * Get the page title text
     */
    async getPageTitle(): Promise<string | null> {
        const titleElement = this.page.locator(loginLocators.pageTitle);
        if (await titleElement.isVisible()) {
            return titleElement.textContent();
        }
        return null;
    }

    /**
     * Check if error message is visible
     */
    async isErrorMessageVisible(): Promise<boolean> {
        return this.page.locator(loginLocators.errorMessage).isVisible();
    }
}
