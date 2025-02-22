import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model class for the Login page
 * Contains all interactions and verifications for the login functionality
 */
export class LoginPage extends BasePage {
    // Selectors using data-test attributes
    private readonly usernameInput = '[data-test="username"]';
    private readonly passwordInput = '[data-test="password"]';
    private readonly loginButton = '[data-test="login-button"]';
    private readonly errorMessage = '[data-test="error"]';
    private readonly inventoryContainer = '[data-test="inventory-container"]';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the login page
     */
    async goto() {
        await this.page.goto('https://www.saucedemo.com/');
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
        await this.page.fill(this.usernameInput, username);
    }

    /**
     * Enter password in the password field
     * @param password - Password to enter
     */
    async enterPassword(password: string) {
        await this.page.fill(this.passwordInput, password);
    }

    /**
     * Click the login button
     */
    async clickLogin() {
        await this.clickFirstElement(this.loginButton);
    }

    /**
     * Get the error message if present
     * @returns Promise<string | null> - Error message text or null if not present
     */
    async getErrorMessage(): Promise<string> {
        try {
            await this.waitForElement(this.errorMessage);
            return await this.page.locator(this.errorMessage).textContent() || '';
        } catch {
            return '';
        }
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
        await this.waitForElement(this.usernameInput);
        await this.waitForElement(this.passwordInput);
        await this.waitForElement(this.loginButton);
    }

    /**
     * Check if error message is visible
     */
    async isErrorMessageVisible(): Promise<boolean> {
        return this.page.locator(this.errorMessage).isVisible();
    }
}
