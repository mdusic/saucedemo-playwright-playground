import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * This class represents the Products page of the website.
 * It contains all the methods we need to interact with products, like:
 * - Adding/removing products from cart
 * - Opening/closing the cart
 * - Sorting products
 * - Getting product prices
 */
export class ProductsPage extends BasePage {
    // These are the selectors we use to find elements on the page
    // We use data-test attributes because they're more reliable than classes or IDs
    private readonly addToCartButtons = '[data-test^="add-to-cart-"]';
    private readonly removeButtons = '[data-test^="remove-"]';
    private readonly cartLink = '[data-test="shopping-cart-link"]';
    private readonly sortDropdown = '[data-test="product-sort-container"]';
    private readonly inventoryContainer = '[data-test="inventory-container"]';
    private readonly itemPrices = '[data-test="inventory-item-price"]';
    private readonly continueShoppingButton = '[data-test="continue-shopping"]';
    private readonly burgerMenu = 'button:has-text("Open Menu")';
    private readonly inventorySidebarLink = '[data-test="inventory-sidebar-link"]';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Wait for the products page to be fully loaded
     */
    async waitForReady(): Promise<void> {
        await this.waitForElement(this.inventoryContainer);
    }

    /**
     * Add a product to the shopping cart
     * @param productName - The exact name of the product to add
     */
    async addProductToCart(productName: string): Promise<void> {
        // Convert product name to match the button ID format
        const productId = productName.toLowerCase().replace(/\s+/g, '-');
        const selector = `[data-test="add-to-cart-${productId}"]`;
        await this.clickFirstElement(selector);
    }

    /**
     * Remove a product from the shopping cart
     * @param productName - The exact name of the product to remove
     */
    async removeProductFromCart(productName: string): Promise<void> {
        // Convert product name to match the button ID format
        const productId = productName.toLowerCase().replace(/\s+/g, '-');
        const selector = `[data-test="remove-${productId}"]`;
        await this.clickFirstElement(selector);
    }

    /**
     * Get the number of items currently in the cart
     * @returns The number of items in the cart
     */
    async getCartQuantity(): Promise<number> {
        // We can count how many remove buttons are visible
        // since each item in cart has a remove button
        return await this.page.locator(this.removeButtons).count();
    }

    /**
     * Open the shopping cart page
     */
    async openCart(): Promise<void> {
        await this.clickFirstElement(this.cartLink);
        await this.waitForNavigation();
    }

    /**
     * Go back to shopping from the cart page
     */
    async continueShopping(): Promise<void> {
        await this.clickFirstElement(this.continueShoppingButton);
        await this.waitForNavigation();
    }

    /**
     * Sort the products on the page
     * @param order - How to sort: 'za' (Z to A), 'lohi' (price low to high), 'hilo' (price high to low)
     */
    async sortProducts(order: 'za' | 'lohi' | 'hilo'): Promise<void> {
        await this.waitForElement(this.sortDropdown);
        await this.page.selectOption(this.sortDropdown, order);
        // Give the page a moment to re-sort
        await this.page.waitForTimeout(500);
    }

    /**
     * Get all product prices from the page
     * @returns Array of prices as numbers (e.g. [29.99, 9.99, 15.99])
     */
    async getProductPrices(): Promise<number[]> {
        await this.waitForElement(this.itemPrices);
        // Get all price texts (e.g. ["$29.99", "$9.99"])
        const prices = await this.page.locator(this.itemPrices).allTextContents();
        // Convert price texts to numbers by removing the "$" and parsing
        return prices.map(price => parseFloat(price.replace('$', '')));
    }
}
