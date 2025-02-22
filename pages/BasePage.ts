import { Page } from '@playwright/test';

/**
 * BasePage provides common functionality that all page objects can use.
 * This helps avoid duplicating code across different page classes.
 */
export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Click the first element that matches the selector
     * @param selector - The selector to find the element
     */
    protected async clickFirstElement(selector: string) {
        await this.waitForElement(selector);
        await this.page.locator(selector).first().click();
    }

    /**
     * Wait for element(s) to be visible on the page
     * @param selector - The selector to find the element(s)
     * @param timeout - How long to wait (in milliseconds) before giving up
     */
    protected async waitForElement(selector: string, timeout = 10000) {
        await this.page.locator(selector).first().waitFor({ 
            state: 'visible', 
            timeout 
        });
    }

    /**
     * Wait for page navigation to complete
     */
    protected async waitForNavigation() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Types text into an input field with a delay
     * @param selector - The input selector
     * @param text - The text to type
     * @param delay - Delay between keystrokes in milliseconds
     */
    protected async typeWithDelay(selector: string, text: string, delay = 100) {
        await this.waitForElement(selector);
        await this.page.locator(selector).type(text, { delay });
    }
}
