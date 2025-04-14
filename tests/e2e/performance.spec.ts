import { test, expect } from '@playwright/test';
import { performanceHelpers } from '../helpers';
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
            // Set a longer timeout for this test based on user type
            test.setTimeout(expectations.testTimeout);
            
            // Start measuring page load time
            const start = Date.now();
            
            // Navigate to inventory page - only wait for DOM to be ready initially
            await page.goto('/inventory.html', { waitUntil: 'domcontentloaded' });
            
            // For normal users, we want to wait until the network is fully idle
            // For performance glitch users, we skip this wait as they're intentionally slow
            if (userType !== 'performance') {
                // Wait for all network activity to finish for standard users
                await page.waitForLoadState('networkidle');
            }
            
            // Wait for the main inventory container to be visible
            // Using appropriate timeout based on user type
            await expect(page.locator(inventoryLocators.inventoryContainer)).toBeVisible({
                timeout: expectations.waitTimeout
            });

            // Wait for the first product image to be visible
            // This is a key indicator that the page is usable
            const firstImage = page.locator(`${inventoryLocators.products.backpack.imageLink} img`);
            await firstImage.waitFor({ 
                state: 'visible',
                timeout: expectations.waitTimeout
            });
            
            // Calculate total load time and log it
            const loadTime = Date.now() - start;
            console.log(`Page load time (${userType}): ${loadTime}ms`);

            // Verify the load time meets our expectations
            if (userType === 'performance') {
                // For performance glitch user:
                // 1. Should be slower than standard (minimum threshold)
                // 2. But not too slow (maximum threshold)
                expect(loadTime, 'Performance user loaded too quickly')
                    .toBeGreaterThan(expectations.minLoadTime);
                expect(loadTime, `Load time (${loadTime}ms) exceeded maximum (${expectations.maxLoadTime}ms)`)
                    .toBeLessThan(expectations.maxLoadTime);
            } else {
                // For standard and problem users:
                // Should be faster than the maximum threshold
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
                const imageSelector = `${product.imageLink} img`;
                const productName = product.name || name;
                
                console.log(`Checking image for ${productName}...`);
                
                // Try to wait for the image with appropriate timeout
                try {
                    await page.waitForSelector(imageSelector, { 
                        state: 'visible',
                        timeout: expectations.imageLoadTimeout
                    });
                    
                    // Use enhanced image check function to get detailed status
                    const imageStatus = await performanceHelpers.checkImageLoaded(page, imageSelector);
                    
                    console.log(`Image status for ${productName}:`, JSON.stringify(imageStatus, null, 2));
                    
                    if (userType === 'problem' && expectations.expectedImageIssues) {
                        // For problem user, we expect some images might not load correctly
                        console.log(`Problem user image check - expected issues: ${imageStatus.errorInfo || 'none'}`);
                    } else {
                        // For standard and performance users, images should eventually load
                        if (!imageStatus.loaded) {
                            console.error(`Image failed to load properly: ${imageStatus.errorInfo}`);
                            
                            if (imageStatus.exists && imageStatus.dimensions) {
                                console.error(`Image dimensions: ${JSON.stringify(imageStatus.dimensions)}`);
                            }
                        }
                        
                        // Only assert for non-problem users to avoid test failures
                        // for users that are expected to have image issues
                        expect(imageStatus.loaded, 
                            `Product image for ${productName} should load correctly`).toBeTruthy();
                    }
                    
                } catch (error) {
                    if (userType === 'problem' && expectations.expectedImageIssues) {
                        // Expected for problem user, so just log it
                        console.log(`Expected image timeout for problem user: ${productName}`);
                    } else {
                        // Unexpected timeout for standard/performance user
                        throw error;
                    }
                }
            }
        });
    });
}
