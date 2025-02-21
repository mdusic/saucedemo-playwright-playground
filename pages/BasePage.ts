import { Page } from '@playwright/test';

/**
 * Base page object that all other page objects should extend.
 * Contains common functionality and utilities used across pages.
 */
export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Waits for navigation to complete after an action
     */
    protected async waitForNavigation() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Checks if an element is visible
     * @param selector - The selector to check
     * @returns Promise<boolean> - Whether the element is visible
     */
    protected async isElementVisible(selector: string): Promise<boolean> {
        const element = this.page.locator(selector);
        return await element.isVisible();
    }

    /**
     * Gets text content of an element
     * @param selector - The selector to get text from
     * @returns Promise<string> - The text content
     */
    protected async getElementText(selector: string): Promise<string> {
        const element = this.page.locator(selector);
        return await element.textContent() || '';
    }

    /**
     * Clicks an element and waits for navigation
     * @param selector - The selector to click
     */
    protected async clickAndWaitForNavigation(selector: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(selector)
        ]);
    }

    /**
     * Types text into an input field with a delay
     * @param selector - The input selector
     * @param text - The text to type
     */
    protected async typeWithDelay(selector: string, text: string) {
        await this.page.locator(selector).type(text, { delay: 100 });
    }

    /**
     * Waits for an element to be visible
     * @param selector - The selector to wait for
     * @param timeout - Optional timeout in milliseconds
     */
    protected async waitForElement(selector: string, timeout?: number) {
        await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    }
}
