import { test, expect } from '@playwright/test';
import { loginAs, waitForImagesLoaded, getScreenshotOptions, USER_TYPES } from '../helpers/visual-testing.helper';

/**
 * Visual Testing for Product Details Page
 * 
 * This test suite demonstrates visual testing for the product details page across different user types:
 * - standard_user: Normal functionality, all images load correctly
 * - problem_user: Has image loading issues (incorrect images)
 * - performance_glitch_user: Same visuals as standard_user but slower loading
 * 
 * Educational purpose:
 * These tests showcase how to:
 * 1. Set up visual baselines for different user types
 * 2. Compare problematic users against the standard user baseline
 * 3. Identify specific visual differences between user types
 * 4. Handle expected visual discrepancies in a testing framework
 */

test.describe('Product Details Visual Tests', () => {
  
  // Take a baseline screenshot for standard_user
  test('Capture product details baseline for standard_user @visual', async ({ page }) => {
    // Given: User logs in as standard_user
    await loginAs(page, 'standard');
    
    // When: Product catalog is loaded and user navigates to product details
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Click on the first product to go to details page
    await page.click('.inventory_item_name');
    await page.waitForSelector('.inventory_details_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Then: Take a screenshot for visual comparison
    // This will be used as the baseline for comparison
    await expect(page).toHaveScreenshot('product-details-standard-user.png', 
      getScreenshotOptions('standard', { fullPage: true })
    );
  });
  
  // Compare problem_user against standard_user baseline
  test('Compare problem_user product details against baseline @visual', async ({ page }) => {
    // Given: User logs in as problem_user
    await loginAs(page, 'problem');
    
    // When: Product catalog is loaded and user navigates to product details
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Click on the first product to go to details page
    await page.click('.inventory_item_name');
    await page.waitForSelector('.inventory_details_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Then: Take a screenshot and compare with standard_user
    // Note: This comparison is expected to fail due to image differences
    await expect(page).toHaveScreenshot('product-details-problem-user.png', 
      getScreenshotOptions('problem', { fullPage: true })
    );
  });
  
  // Compare performance_glitch_user against standard_user baseline
  test('Compare performance_glitch_user product details against baseline @visual', async ({ page }) => {
    // Given: User logs in as performance_glitch_user
    await loginAs(page, 'performance');
    
    // When: Product catalog is loaded and user navigates to product details
    await page.waitForSelector('.inventory_item_img', { 
      state: 'visible',
      timeout: 10000 // Longer timeout for performance_glitch_user
    });
    await waitForImagesLoaded(page, 10000);
    
    // Click on the first product to go to details page
    await page.click('.inventory_item_name');
    await page.waitForSelector('.inventory_details_img', { 
      state: 'visible',
      timeout: 10000 // Longer timeout for performance_glitch_user
    });
    await waitForImagesLoaded(page, 10000);
    
    // Then: Take a screenshot and compare with standard_user
    // This should pass as the final visual state should be the same
    await expect(page).toHaveScreenshot('product-details-performance-user.png', 
      getScreenshotOptions('performance', { fullPage: true })
    );
  });
  
  // Compare specific UI elements on product details page
  test('Compare product details image between user types @visual', async ({ page }) => {
    // First, capture standard_user product details image
    await loginAs(page, 'standard');
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Navigate to product details
    await page.click('.inventory_item_name');
    await page.waitForSelector('.inventory_details_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Take screenshot of just the product details image
    const productDetailsImage = page.locator('.inventory_details_img');
    await expect(productDetailsImage).toHaveScreenshot(
      'product-details-image-standard-user.png',
      getScreenshotOptions('standard')
    );
    
    // Now compare with problem_user
    await loginAs(page, 'problem');
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Navigate to product details
    await page.click('.inventory_item_name');
    await page.waitForSelector('.inventory_details_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Take screenshot of the product details image for problem_user
    const productDetailsImageProblem = page.locator('.inventory_details_img');
    await expect(productDetailsImageProblem).toHaveScreenshot(
      'product-details-image-problem-user.png',
      getScreenshotOptions('problem')
    );
  });
});

/**
 * Educational notes on visual testing best practices:
 * 
 * 1. Baseline Management:
 *    - Keep baselines in version control
 *    - Update baselines when intentional UI changes occur
 *    - Document expected differences between user types
 * 
 * 2. Handling Dynamic Content:
 *    - Use masks to ignore areas with dynamic content (dates, times, etc.)
 *    - Disable animations and transitions
 *    - Set fixed dimensions for consistent testing
 * 
 * 3. Selective Testing:
 *    - Test specific components rather than full pages when possible
 *    - Focus on areas known to have issues (like images for problem_user)
 *    - Use appropriate thresholds for comparison
 */
