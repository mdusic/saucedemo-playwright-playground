import { Page, expect } from '@playwright/test';
import { checkoutLocators } from '../locators/checkout.locators';
import { CartItem, cartHelpers } from './cart.helpers';
import { priceHelpers } from './price.helpers';

/**
 * Represents shipping details for checkout
 */
export interface ShippingDetails {
    firstName: string;
    lastName: string;
    postalCode: string;
}

/**
 * Helper functions for the checkout process
 * These functions handle form filling and order verification
 */
export const checkoutHelpers = {
    /**
     * Fills out the shipping information form
     * @param page - Playwright page object
     * @param details - Shipping details to fill in
     * @example
     * await checkoutHelpers.fillShippingForm(page, {
     *   firstName: 'John',
     *   lastName: 'Doe',
     *   postalCode: '12345'
     * });
     */
    async fillShippingForm(page: Page, details: ShippingDetails) {
        // Fill out each field
        await page.fill(checkoutLocators.information.firstName, details.firstName);
        await page.fill(checkoutLocators.information.lastName, details.lastName);
        await page.fill(checkoutLocators.information.postalCode, details.postalCode);
        
        // Continue to next step
        await page.click(checkoutLocators.information.continueButton);
    },

    /**
     * Verifies the complete order summary including items, subtotal, tax, and total
     * @param page - Playwright page object
     * @param items - Array of items to verify
     * @example
     * await checkoutHelpers.verifyOrderSummary(page, [
     *   { name: 'Sauce Labs Backpack', quantity: 1, price: 29.99 }
     * ]);
     */
    async verifyOrderSummary(page: Page, items: CartItem[]) {
        // First verify all items are present with correct quantities
        for (const item of items) {
            const locators = checkoutLocators.overview.getItemLocators(item.name);
            const quantityLocator = page.locator(locators.quantity);
            await expect(quantityLocator).toHaveText(String(item.quantity));
        }

        // Calculate expected totals
        const { subtotal, tax, total } = cartHelpers.calculateCartTotals(items);

        // Verify subtotal
        const subtotalLocator = page.locator(checkoutLocators.overview.subtotalLabel);
        await expect(subtotalLocator).toHaveText(`Item total: ${priceHelpers.formatPrice(subtotal)}`);

        // Verify tax
        const taxLocator = page.locator(checkoutLocators.overview.taxLabel);
        await expect(taxLocator).toHaveText(`Tax: ${priceHelpers.formatPrice(tax)}`);

        // Verify total
        const totalLocator = page.locator(checkoutLocators.overview.totalLabel);
        await expect(totalLocator).toHaveText(`Total: ${priceHelpers.formatPrice(total)}`);
    },

    /**
     * Completes the checkout process and verifies success
     * @param page - Playwright page object
     */
    async completeCheckout(page: Page) {
        // Click finish button
        await page.click(checkoutLocators.overview.finishButton);
        
        // Verify success message
        const headerLocator = page.locator(checkoutLocators.complete.header);
        await expect(headerLocator).toHaveText('Thank you for your order!');
    }
} as const;
