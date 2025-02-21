import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the login page
 * Contains all interactions and verifications for the login functionality
 */
export class LoginPage extends BasePage {
    // Selectors as private readonly fields for better maintainability
    private readonly usernameInput = '[data-test="username"]';
    private readonly passwordInput = '[data-test="password"]';
    private readonly loginButton = '[data-test="login-button"]';
    private readonly errorMessage = '[data-test="error"]';
    private readonly inventoryContainer = '#inventory_container';

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
     * Perform login with provided credentials
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
     * @param username - Username to enter
     */
    async enterUsername(username: string) {
        await this.typeWithDelay(this.usernameInput, username);
    }

    /**
     * Enter password in the password field
     * @param password - Password to enter
     */
    async enterPassword(password: string) {
        await this.typeWithDelay(this.passwordInput, password);
    }

    /**
     * Click the login button
     */
    async clickLogin() {
        await this.page.click(this.loginButton);
    }

    /**
     * Get the error message if present
     * @returns Promise<string | null> - Error message text or null if not present
     */
    async getErrorMessage(): Promise<string | null> {
        if (await this.isElementVisible(this.errorMessage)) {
            return this.getElementText(this.errorMessage);
        }
        return null;
    }

    /**
     * Check if login was successful
     * @returns Promise<boolean> - True if login was successful
     */
    async isLoginSuccessful(): Promise<boolean> {
        return this.isElementVisible(this.inventoryContainer);
    }

    /**
     * Wait for the login form to be visible
     */
    private async waitForLoginForm() {
        await this.waitForElement(this.usernameInput);
        await this.waitForElement(this.passwordInput);
        await this.waitForElement(this.loginButton);
    }

    /**
     * Verify that we're on the login page
     */
    async verifyLoginPage() {
        await expect(this.page.locator(this.usernameInput)).toBeVisible();
        await expect(this.page.locator(this.passwordInput)).toBeVisible();
        await expect(this.page.locator(this.loginButton)).toBeVisible();
    }
}
