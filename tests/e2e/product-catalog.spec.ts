import { expect } from '@playwright/test';
import { test } from '../utils/test-helpers';
import { inventoryLocators } from '../locators/inventory.locators';
import { cartLocators } from '../locators/cart.locators';
import { cartHelpers } from '../helpers';
import { priceHelpers } from '../helpers/price.helpers';
import { users } from '../data/users.data';

test.describe('Product Catalog Tests', () => {
    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        await page.waitForSelector(inventoryLocators.inventoryContainer);
    });

    // Test 8: Add multiple products to cart using helper functions
    test('should add multiple products to cart @smoke', async ({ page }) => {
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

        // Add products to cart
        await cartHelpers.addMultipleProducts(page, items.map(item => item.name));

        // Verify cart items
        await page.click(inventoryLocators.shoppingCartLink);
        await cartHelpers.verifyCartItems(page, items);
    });

    // Test 9: Remove product from cart using helper functions
    test('should remove product from cart @smoke', async ({ page }) => {
        const items = [{
            name: inventoryLocators.products.backpack.name,
            quantity: 1,
            price: inventoryLocators.products.backpack.price
        }];

        // Add product to cart
        await cartHelpers.addMultipleProducts(page, items.map(item => item.name));

        // Verify cart items
        await page.click(inventoryLocators.shoppingCartLink);
        await cartHelpers.verifyCartItems(page, items);

        // Remove product and verify it's gone
        await page.click(inventoryLocators.products.backpack.removeButton);
        await expect(page.locator(`${cartLocators.cartList} .cart_item`)).not.toBeVisible();
        await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    });

    // Test 10: Display product information using price helper
    test('should display correct product information @regression', async ({ page }) => {
        const product = inventoryLocators.products.backpack;

        // Create Playwright locators once and reuse them
        const productTitleLocator = page.locator(product.titleLink);
        // Fix: Use the correct selector format for finding the price element
        // SauceDemo uses inventory_item elements with different structure than initially assumed
        const productPriceLocator = page.locator(
            `.inventory_item:has(${product.titleLink}) .inventory_item_price`
        );

        // Verify product title - using the stored locator
        await expect(productTitleLocator).toHaveText(product.name);

        // Verify product price using price helper and the stored locator
        await expect(productPriceLocator).toHaveText(priceHelpers.formatPrice(product.price));
        
        // Log performance information for debugging
        console.log(`Product validation complete for ${product.name}`);
    });

    // Test 11: Sort products by price high to low using price helper
    test('should sort products by price high to low @regression', async ({ page }) => {
        // Sort by price high to low
        await page.selectOption(inventoryLocators.sortDropdown, 'hilo');

        // Store locators for efficiency - creating them once
        const firstProduct = inventoryLocators.products.fleeceJacket;
        const productTitleLocator = page.locator(firstProduct.titleLink);
        
        // Fix: Use the correct selector format for finding the price element
        // Using :has() to find the inventory item that contains the specific title link
        const productPriceLocator = page.locator(
            `.inventory_item:has(${firstProduct.titleLink}) .inventory_item_price`
        );

        // Verify product information using stored locators
        await expect(productTitleLocator).toHaveText(firstProduct.name);
        await expect(productPriceLocator).toHaveText(priceHelpers.formatPrice(firstProduct.price));
    });

    // Test 12: Check cart navigation
    test('should maintain cart count across page navigation @regression', async ({ page }) => {
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

        // Add products to cart
        await cartHelpers.addMultipleProducts(page, items.map(item => item.name));

        // Navigate to cart and back
        await page.click(inventoryLocators.shoppingCartLink);
        await cartHelpers.verifyCartItems(page, items);
        await page.goBack();

        // Verify cart badge shows correct count
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    });
});
