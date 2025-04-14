/**
 * Shopping Cart page locators
 */
export const cartLocators = {
    // Page header elements
    title: '[data-test="title"]',
    secondaryHeader: '[data-test="secondary-header"]',
    
    // Cart list and labels
    cartList: '[data-test="cart-list"]',
    cartQuantityLabel: '[data-test="cart-quantity-label"]',
    cartDescriptionLabel: '[data-test="cart-desc-label"]',
    
    // Action buttons
    checkoutButton: '[data-test="checkout"]',
    continueShoppingButton: '[data-test="continue-shopping"]',

    // Helper functions for working with cart items
    getItemQuantity: (itemName: string) => ({
        // Using data-test attributes is more reliable than text filtering
        selector: `[data-test="cart-list"] [data-test="item-quantity"]`,
        text: '1'
    }),

    /**
     * Returns all necessary locators for a specific cart item
     * @param itemName - The name of the item (e.g., 'Sauce Labs Backpack')
     */
    getCartItemLocators(itemName: string) {
        return {
            container: `[data-test="cart-list"] div:has-text("${itemName}")`,
            quantity: `[data-test="cart-list"] div:has-text("${itemName}") [data-test="item-quantity"]`,
            description: `[data-test="cart-list"] div:has-text("${itemName}") .inventory_item_desc`,
            price: `[data-test="cart-list"] div:has-text("${itemName}") .inventory_item_price`
        };
    }
} as const;

/**
 * Type definitions for cart item data
 */
export interface CartItem {
    name: string;
    quantity: number;
    price: number;
}

/**
 * Best practices for working with cart items:
 * 1. Use data-test attributes whenever possible
 * 2. When filtering by text is necessary, use the full item name
 * 3. For quantity verification, combine the item name with the quantity locator
 * 4. Use the getCartItemLocators helper to get all locators for a specific item
 * 
 * Example usage:
 * ```typescript
 * // Get all locators for a specific item
 * const backpackLocators = cartLocators.getCartItemLocators('Sauce Labs Backpack');
 * 
 * // Verify quantity
 * await expect(page.locator(backpackLocators.quantity)).toHaveText('1');
 * 
 * // Verify price
 * await expect(page.locator(backpackLocators.price)).toHaveText('$29.99');
 * ```
 */
