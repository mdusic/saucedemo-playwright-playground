import { Page, expect } from '@playwright/test';
import { inventoryLocators } from '../locators/inventory.locators';
import { cartLocators } from '../locators/cart.locators';
import { priceHelpers } from './price.helpers';

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
    name: string;
    quantity: number;
    price: number;
}

/**
 * Helper functions for working with the shopping cart
 * These functions handle common cart operations and verifications
 */
export const cartHelpers = {
    /**
     * Adds multiple products to the cart
     * @param page - Playwright page object
     * @param products - Array of product names to add
     * @example
     * await cartHelpers.addMultipleProducts(page, ['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
     */
    async addMultipleProducts(page: Page, products: string[]) {
        // Wait for inventory container to be visible
        await page.waitForSelector(inventoryLocators.inventoryContainer, { state: 'visible' });

        for (const productName of products) {
            // Find the product in our inventory locators
            const product = Object.values(inventoryLocators.products)
                .find(p => p.name === productName);
            
            if (!product) {
                throw new Error(`Product "${productName}" not found in inventory locators`);
            }
            
            // Convert product name to kebab case for the button selector
            const productId = product.name.toLowerCase().replace(/ /g, '-');
            const addToCartButton = `[data-test="add-to-cart-${productId}"]`;
            await page.waitForSelector(addToCartButton, { state: 'visible' });
            await page.click(addToCartButton);
        }
    },

    /**
     * Verifies items in the cart match expected quantities and prices
     * @param page - Playwright page object
     * @param items - Array of cart items to verify
     * @example
     * await cartHelpers.verifyCartItems(page, [
     *   { name: 'Sauce Labs Backpack', quantity: 1, price: 29.99 }
     * ]);
     */
    async verifyCartItems(page: Page, items: CartItem[]) {
        // Wait for cart list to be visible
        await page.waitForSelector('.cart_list', { state: 'visible' });

        for (const item of items) {
            const locators = cartLocators.getCartItemLocators(item.name);
            
            // Verify quantity
            const quantityLocator = page.locator(locators.quantity);
            await expect(quantityLocator).toHaveText(String(item.quantity));
            
            // Verify price
            const priceLocator = page.locator(locators.price);
            await expect(priceLocator).toHaveText(priceHelpers.formatPrice(item.price));
        }
    },

    /**
     * Calculates the total value of items in the cart
     * @param items - Array of cart items
     * @returns Object containing subtotal, tax, and total
     */
    calculateCartTotals(items: CartItem[]) {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = priceHelpers.calculateTax(subtotal);
        const total = priceHelpers.calculateTotal(subtotal, tax);

        return { subtotal, tax, total };
    }
} as const;
