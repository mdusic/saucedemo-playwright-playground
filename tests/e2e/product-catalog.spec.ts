import { test } from '../utils/test-helpers';
import { ProductsPage } from '../../pages/ProductsPage';
import { loginData } from '../data/login-data';

// This describes all our tests for the product catalog page
test.describe('Product Catalog Tests', () => {
    let productsPage: ProductsPage;

    // Before each test, we need to:
    // 1. Log in to the website
    // 2. Create a new ProductsPage object
    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.goto();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password);
        productsPage = new ProductsPage(page);
        await productsPage.waitForReady();
    });

    // Test 1: Add a product to cart
    test('should add product to cart @smoke', async () => {
        // Add "Sauce Labs Backpack" to cart
        await productsPage.addProductToCart('Sauce Labs Backpack');
        
        // Check that cart shows 1 item
        const cartQuantity = await productsPage.getCartQuantity();
        await test.expect(cartQuantity, 'Cart should show 1 item').toBe(1);
    });

    // Test 2: Remove a product from cart
    test('should remove product from cart @smoke', async () => {
        // First add the backpack
        await productsPage.addProductToCart('Sauce Labs Backpack');
        
        // Then remove it
        await productsPage.removeProductFromCart('Sauce Labs Backpack');
        
        // Check that cart is empty (0 items)
        const cartQuantity = await productsPage.getCartQuantity();
        await test.expect(cartQuantity, 'Cart should be empty').toBe(0);
    });

    // Test 3: Check that product sorting works
    test('should sort products by price @regression', async () => {
        // First sort products from highest to lowest price
        await productsPage.sortProducts('hilo');
        const highToLowPrices = await productsPage.getProductPrices();
        
        // Check each price is higher than the next one
        for (let i = 1; i < highToLowPrices.length; i++) {
            await test.expect(highToLowPrices[i-1], 'Products should be sorted high to low')
                .toBeGreaterThanOrEqual(highToLowPrices[i]);
        }

        // Then sort products from lowest to highest price
        await productsPage.sortProducts('lohi');
        const lowToHighPrices = await productsPage.getProductPrices();
        
        // Check each price is lower than the next one
        for (let i = 1; i < lowToHighPrices.length; i++) {
            await test.expect(lowToHighPrices[i-1], 'Products should be sorted low to high')
                .toBeLessThanOrEqual(lowToHighPrices[i]);
        }
    });

    // Test 4: Add multiple products to cart
    test('should add multiple products to cart @regression', async () => {
        // Add two different products
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        
        // Check that cart shows 2 items
        const cartQuantity = await productsPage.getCartQuantity();
        await test.expect(cartQuantity, 'Cart should show 2 items').toBe(2);

        // Remove both products
        await productsPage.removeProductFromCart('Sauce Labs Backpack');
        await productsPage.removeProductFromCart('Sauce Labs Bike Light');
        
        // Check that cart is empty again
        const finalQuantity = await productsPage.getCartQuantity();
        await test.expect(finalQuantity, 'Cart should be empty after removing items').toBe(0);
    });

    // Test 5: Check cart navigation
    test('should navigate through cart @regression', async () => {
        // Add first product and go to cart
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await productsPage.openCart();
        
        // Go back to products and add another item
        await productsPage.continueShopping();
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        
        // Check that cart shows 2 items
        const cartQuantity = await productsPage.getCartQuantity();
        await test.expect(cartQuantity, 'Cart should show 2 items').toBe(2);
    });
});
