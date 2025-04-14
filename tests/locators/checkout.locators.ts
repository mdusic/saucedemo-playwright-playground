/**
 * Checkout process locators
 * Covers all three stages: Information, Overview, and Complete
 */

import { cartLocators } from './cart.locators';

/**
 * Checkout page locators
 */
export const checkoutLocators = {
    // Checkout Information page
    information: {
        // Page container
        container: '[data-test="checkout-info-container"]',
        
        // Form fields
        firstName: '[data-test="firstName"]',
        lastName: '[data-test="lastName"]',
        postalCode: '[data-test="postalCode"]',
        
        // Action buttons
        continueButton: '[data-test="continue"]',
        cancelButton: '[data-test="cancel"]',
        
        // Error handling
        errorMessage: '[data-test="error"]',
        errorCloseButton: '[data-test="error-button"]'
    },
    
    // Checkout Overview page
    overview: {
        // Cart labels
        cartQuantityLabel: '[data-test="cart-quantity-label"]',
        cartDescriptionLabel: '[data-test="cart-desc-label"]',
        
        // Summary elements
        subtotalLabel: '[data-test="subtotal-label"]',
        taxLabel: '[data-test="tax-label"]',
        totalLabel: '[data-test="total-label"]',
        
        // Action buttons
        finishButton: '[data-test="finish"]',
        cancelButton: '[data-test="cancel"]',

        // Helper functions for cart items (reusing cart locators)
        getItemLocators: cartLocators.getCartItemLocators
    },
    
    // Checkout Complete page
    complete: {
        // Success message elements
        header: '[data-test="complete-header"]',
        text: '[data-test="complete-text"]',
        
        // Action buttons
        backHomeButton: '[data-test="back-to-products"]'
    }
} as const;

/**
 * Type definitions for checkout data
 */
export interface CheckoutInformation {
    firstName: string;
    lastName: string;
    postalCode: string;
}

/**
 * Best practices for working with checkout locators:
 * 
 * 1. Information Page:
 * ```typescript
 * // Fill out checkout information
 * await page.fill(checkoutLocators.information.firstName, 'John');
 * await page.fill(checkoutLocators.information.lastName, 'Doe');
 * await page.fill(checkoutLocators.information.postalCode, '12345');
 * ```
 * 
 * 2. Overview Page:
 * ```typescript
 * // Verify item in cart
 * const itemLocators = checkoutLocators.overview.getItemLocators('Sauce Labs Backpack');
 * await expect(page.locator(itemLocators.quantity)).toHaveText('1');
 * await expect(page.locator(itemLocators.price)).toHaveText('$29.99');
 * ```
 * 
 * 3. Complete Page:
 * ```typescript
 * // Verify order completion
 * await expect(page.locator(checkoutLocators.complete.header))
 *     .toHaveText('Thank you for your order!');
 * ```
 */
