import { expect } from '@playwright/test';
import { test } from '../utils/test-helpers';
import { ProductsPage } from '../../pages/ProductsPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { users } from '../data/users.data';
import { inventoryLocators } from '../locators/inventory.locators';
import { cartLocators } from '../locators/cart.locators';
import { checkoutLocators } from '../locators/checkout.locators';
import { cartHelpers, checkoutHelpers } from '../helpers';

test.describe('Checkout Flow', () => {
    let productsPage: ProductsPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        productsPage = new ProductsPage(page);
        checkoutPage = new CheckoutPage(page);
        await productsPage.waitForReady();
    });

    test('should complete checkout successfully @smoke', async ({ page }) => {
        const items = [
            { 
                name: inventoryLocators.products.backpack.name,
                quantity: 1,
                price: inventoryLocators.products.backpack.price
            },
            {
                name: inventoryLocators.products.bikeLight.name,
                quantity: 1,
                price: inventoryLocators.products.bikeLight.price
            }
        ];
        
        // Add items to cart using helper
        await cartHelpers.addMultipleProducts(page, items.map(item => item.name));
        
        // Navigate to cart and proceed to checkout
        await productsPage.goToCart();
        await page.click(cartLocators.checkoutButton);

        // Fill shipping details using helper
        await checkoutHelpers.fillShippingForm(page, {
            firstName: 'Test',
            lastName: 'User',
            postalCode: '1337'
        });

        // Verify order summary using helper
        await checkoutHelpers.verifyOrderSummary(page, items);
        
        // Complete checkout using helper
        await checkoutHelpers.completeCheckout(page);
        
        // Verify success message
        await expect(page.locator(checkoutLocators.complete.header))
            .toHaveText('Thank you for your order!');
    });

    test('should show error for missing checkout information @regression', async ({ page }) => {
        // Add an item and go to checkout
        const product = inventoryLocators.products.backpack;
        await cartHelpers.addMultipleProducts(page, [product.name]);
        
        await productsPage.goToCart();
        await page.click(cartLocators.checkoutButton);

        // Try to continue without filling information
        await page.click(checkoutLocators.information.continueButton);

        // Verify error message
        await expect(page.locator(checkoutLocators.information.errorMessage))
            .toBeVisible();
    });

    test('should calculate correct total with tax @regression', async ({ page }) => {
        const items = [{
            name: inventoryLocators.products.backpack.name,
            quantity: 1,
            price: inventoryLocators.products.backpack.price
        }];
        
        // Add backpack and proceed to checkout
        await cartHelpers.addMultipleProducts(page, items.map(item => item.name));
        await productsPage.goToCart();
        await page.click(cartLocators.checkoutButton);

        // Fill shipping details using helper
        await checkoutHelpers.fillShippingForm(page, {
            firstName: 'Test',
            lastName: 'User',
            postalCode: '1337'
        });

        // Verify order summary using helper
        await checkoutHelpers.verifyOrderSummary(page, items);

        // Verify subtotal matches product price
        const subtotalText = await page.locator(checkoutLocators.overview.subtotalLabel).textContent();
        const subtotal = parseFloat(subtotalText?.replace('Item total: $', '') || '0');
        expect(subtotal).toBe(items[0].price);

        // Verify tax is 8% of subtotal
        const taxText = await page.locator(checkoutLocators.overview.taxLabel).textContent();
        const tax = parseFloat(taxText?.replace('Tax: $', '') || '0');
        expect(tax).toBeCloseTo(subtotal * 0.08, 2);

        // Verify total is subtotal + tax
        const totalText = await page.locator(checkoutLocators.overview.totalLabel).textContent();
        const total = parseFloat(totalText?.replace('Total: $', '') || '0');
        expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    test('should show error when postal code is missing', async ({ page }) => {
        // Add items to cart
        await cartHelpers.addMultipleProducts(page, [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt'
        ]);
        
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
        await cartHelpers.addMultipleProducts(page, itemsToAdd);
        
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
