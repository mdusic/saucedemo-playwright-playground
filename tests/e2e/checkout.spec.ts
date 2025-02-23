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
});
