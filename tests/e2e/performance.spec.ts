import { test, expect } from '@playwright/test';
import { performanceHelpers } from '../helpers/performance.helpers';
import { inventoryLocators } from '../locators/inventory.locators';
import { loginLocators } from '../locators/login.locators';
import { users } from '../data/users.data';

// Define expected performance characteristics for each user type
const performanceExpectations = {
    standard: {
        maxLoadTime: 3000,
        maxClickTime: 1000,
        imageLoadTimeout: 5000,
        testTimeout: 30000,
        waitTimeout: 5000
    },
    performance: {
        minLoadTime: 3000,   // Should be slower than standard user
        maxLoadTime: 15000,  // But not too slow
        maxClickTime: 5000,
        imageLoadTimeout: 10000,
        testTimeout: 60000,
        waitTimeout: 30000
    },
    problem: {
        maxLoadTime: 3000,
        maxClickTime: 2000,
        imageLoadTimeout: 5000,
        testTimeout: 30000,
        waitTimeout: 5000,
        expectedImageIssues: true
    }
};

// Test with different user types
for (const [userType, userData] of Object.entries({
    standard: users.standard,
    performance: users.performance,
    problem: users.problem
})) {
    test.describe(`Performance and Resilience Tests (${userType} user)`, () => {
        const expectations = performanceExpectations[userType];

        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.fill(loginLocators.usernameInput, userData.username);
            await page.fill(loginLocators.passwordInput, userData.password);
            await page.click(loginLocators.loginButton);
        });

        test('should exhibit expected page load performance @performance', async ({ page }) => {
            test.setTimeout(expectations.testTimeout);
            
            const start = Date.now();
            
            // Navigate to inventory page
            await page.goto('/inventory.html', { waitUntil: 'domcontentloaded' });
            
            if (userType !== 'performance') {
                await page.waitForLoadState('networkidle');
            }
            
            // Wait for inventory container with appropriate timeout
            await expect(page.locator(inventoryLocators.inventoryContainer)).toBeVisible({
                timeout: expectations.waitTimeout
            });

            // Wait for first image to be visible
            const firstImage = page.locator(`${inventoryLocators.products.backpack.imageLink} img`);
            await firstImage.waitFor({ 
                state: 'visible',
                timeout: expectations.waitTimeout
            });
            
            const loadTime = Date.now() - start;
            console.log(`Page load time (${userType}): ${loadTime}ms`);

            if (userType === 'performance') {
                // For performance user, we expect slower loading
                expect(loadTime, 'Performance user loaded too quickly')
                    .toBeGreaterThan(expectations.minLoadTime);
                expect(loadTime, `Load time (${loadTime}ms) exceeded maximum (${expectations.maxLoadTime}ms)`)
                    .toBeLessThan(expectations.maxLoadTime);
            } else {
                expect(loadTime, `Page load time (${loadTime}ms) exceeded maximum (${expectations.maxLoadTime}ms)`)
                    .toBeLessThan(expectations.maxLoadTime);
            }
        });

        test('should handle "Add to Cart" button with expected performance @resilience', async ({ page }) => {
            const firstProduct = inventoryLocators.products.backpack;
            const addToCartButton = `[data-test="add-to-cart-${firstProduct.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}"]`;
            
            const clickResult = await performanceHelpers.retryClick(page, addToCartButton, {
                maxAttempts: userType === 'problem' ? 5 : 3,
                initialDelay: userType === 'performance' ? 200 : 100,
                maxDelay: expectations.maxClickTime
            });
            
            console.log(`Click performance (${userType}):`, clickResult);

            if (userType === 'problem') {
                // For problem user, we don't expect consistent success
                console.log('Problem user click result:', clickResult);
            } else {
                // For other users, verify success and performance
                expect(clickResult.success, `Failed to click button after ${clickResult.attempts} attempts`)
                    .toBe(true);
                expect(clickResult.totalTime, `Click took too long (${clickResult.totalTime}ms)`)
                    .toBeLessThan(expectations.maxClickTime);
                
                // Verify the item was added
                const cartBadge = page.locator('.shopping_cart_badge');
                await expect(cartBadge).toHaveText('1');
            }
        });

        test('should handle image loading with expected performance @resilience', async ({ page }) => {
            await expect(page.locator(inventoryLocators.inventoryContainer)).toBeVisible();

            // Test each product image
            for (const [name, product] of Object.entries(inventoryLocators.products)) {
                const selector = `${product.imageLink} img`;
                const image = page.locator(selector);
                
                try {
                    // Wait for image to be visible
                    await image.waitFor({ 
                        state: 'visible', 
                        timeout: expectations.imageLoadTimeout 
                    });

                    if (userType === 'standard') {
                        // For standard user, verify image dimensions
                        const dimensions = await performanceHelpers.getImageDimensions(page, selector);
                        
                        // Images should have actual dimensions
                        expect(dimensions.width, `Image ${name} has no display width`)
                            .toBeGreaterThan(0);
                        expect(dimensions.height, `Image ${name} has no display height`)
                            .toBeGreaterThan(0);
                        expect(dimensions.naturalWidth, `Image ${name} has no natural width`)
                            .toBeGreaterThan(0);
                        expect(dimensions.naturalHeight, `Image ${name} has no natural height`)
                            .toBeGreaterThan(0);
                    } else if (userType === 'performance') {
                        // For performance user, verify image loads properly
                        const isLoaded = await performanceHelpers.checkImageLoaded(page, selector);
                        expect(isLoaded, `Image ${name} failed to load properly`)
                            .toBe(true);
                    }
                } catch (error) {
                    if (userType !== 'problem') {
                        throw error; // Re-throw for standard and performance users
                    }
                    // For problem user, log the error but continue
                    console.log(`Expected image issue for problem user: ${name}`);
                }
            }
        });
    });
}
