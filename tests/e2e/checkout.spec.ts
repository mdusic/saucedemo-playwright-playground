import { expect } from '@playwright/test';
import { test } from '../utils/test-helpers';
import { ProductsPage } from '../../pages/ProductsPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { loginData } from '../data/login-data';

test.describe('Checkout Flow', () => {
    let productsPage: ProductsPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.goto();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password);
        productsPage = new ProductsPage(page);
        checkoutPage = new CheckoutPage(page);
        await productsPage.waitForReady();
    });

    test('should complete checkout successfully @smoke', async ({ page }) => {
        // Add items to cart
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        
        // Navigate to cart and proceed to checkout
        await productsPage.goToCart();
        await page.locator('[data-test="checkout"]').click();

        // Fill shipping details
        await checkoutPage.fillShippingDetails('Test', 'User', '1337');

        // Verify order summary
        await checkoutPage.verifyOrderSummary();

        // Complete order
        await checkoutPage.completeOrder();

        // Verify confirmation
        await checkoutPage.verifyOrderConfirmation();

        // Return to products
        await checkoutPage.returnToProducts();
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('should show error when postal code is missing', async ({ page }) => {
        // Add items to cart
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        await productsPage.addProductToCart('Sauce Labs Fleece Jacket');
        await productsPage.addProductToCart('Sauce Labs Bolt T-Shirt');
        
        // Navigate to cart and proceed to checkout
        await productsPage.goToCart();
        await page.locator('[data-test="checkout"]').click();

        // Fill shipping details without postal code
        await checkoutPage.fillShippingDetails('Test', 'User');

        // Verify error message
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage, 'Error message should be shown for missing postal code')
            .toBe('Error: Postal Code is required');
    });

    test('should preserve cart items after canceling checkout', async ({ page }) => {
        // Add all items to cart
        const itemsToAdd = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket'
        ];
        
        // Add items and verify each one is added
        for (const item of itemsToAdd) {
            await productsPage.addProductToCart(item);
        }
        
        // Navigate to cart and proceed to checkout
        await productsPage.goToCart();
        await page.locator('[data-test="checkout"]').click();

        // Fill shipping details but cancel
        await checkoutPage.fillShippingDetails('Test', 'User that will not complete', '1337');
        await checkoutPage.cancelCheckout();

        // Verify all items are still in cart
        for (const item of itemsToAdd) {
            const isInCart = await productsPage.verifyItemInCart(item);
            expect(isInCart, `${item} should still be in cart after canceling checkout`).toBeTruthy();
        }

        // Clean up - remove all items from cart
        for (const item of itemsToAdd) {
            await productsPage.removeFromCart(item);
        }
    });
});
