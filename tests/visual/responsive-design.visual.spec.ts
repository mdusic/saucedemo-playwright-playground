import { test, expect } from '@playwright/test';
import { loginAs, waitForImagesLoaded, getScreenshotOptions, USER_TYPES } from '../helpers/visual-testing.helper';

/**
 * Visual Testing for Responsive Design
 * 
 * This test suite demonstrates visual testing across different viewport sizes:
 * - Desktop: Standard desktop viewport
 * - Tablet: Medium-sized viewport
 * - Mobile: Small viewport for mobile devices
 * 
 * Educational purpose:
 * These tests showcase how to:
 * 1. Test responsive design across different device sizes
 * 2. Capture visual differences in layout and design
 * 3. Ensure consistent user experience across devices
 * 4. Document responsive behavior for educational purposes
 */

// Define viewport sizes for different devices
const viewports = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 } // iPhone SE size
};

test.describe('Responsive Design Visual Tests', () => {
  
  // Test product catalog on desktop viewport
  test('Product catalog on desktop viewport @visual', async ({ page }) => {
    // Given: Desktop viewport size
    await page.setViewportSize(viewports.desktop);
    
    // When: User logs in and views product catalog
    await loginAs(page, 'standard');
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Then: Take a screenshot for visual comparison
    await expect(page).toHaveScreenshot('product-catalog-desktop.png', 
      getScreenshotOptions('standard', { fullPage: true })
    );
    
    // Educational comment: Desktop view typically shows multiple products in a row
    // and has more horizontal space for product information
  });
  
  // Test product catalog on tablet viewport
  test('Product catalog on tablet viewport @visual', async ({ page }) => {
    // Given: Tablet viewport size
    await page.setViewportSize(viewports.tablet);
    
    // When: User logs in and views product catalog
    await loginAs(page, 'standard');
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Then: Take a screenshot for visual comparison
    await expect(page).toHaveScreenshot('product-catalog-tablet.png', 
      getScreenshotOptions('standard', { fullPage: true })
    );
    
    // Educational comment: Tablet view may show fewer products per row
    // and might have adjusted spacing compared to desktop
  });
  
  // Test product catalog on mobile viewport
  test('Product catalog on mobile viewport @visual', async ({ page }) => {
    // Given: Mobile viewport size
    await page.setViewportSize(viewports.mobile);
    
    // When: User logs in and views product catalog
    await loginAs(page, 'standard');
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Then: Take a screenshot for visual comparison
    await expect(page).toHaveScreenshot('product-catalog-mobile.png', 
      getScreenshotOptions('standard', { fullPage: true })
    );
    
    // Educational comment: Mobile view typically shows products in a single column
    // with adjusted layout for smaller screens
  });
  
  // Test product details page on different viewports
  test('Product details page on different viewports @visual', async ({ page }) => {
    // First test desktop view
    await page.setViewportSize(viewports.desktop);
    await loginAs(page, 'standard');
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Navigate to product details
    await page.click('.inventory_item_name');
    await page.waitForSelector('.inventory_details_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    await expect(page).toHaveScreenshot('product-details-desktop.png', 
      getScreenshotOptions('standard', { fullPage: true })
    );
    
    // Then test mobile view of the same product
    await page.setViewportSize(viewports.mobile);
    
    // Need to login again after viewport change to ensure proper rendering
    await loginAs(page, 'standard');
    await page.waitForSelector('.inventory_item_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    // Navigate to product details
    await page.click('.inventory_item_name');
    await page.waitForSelector('.inventory_details_img', { state: 'visible' });
    await waitForImagesLoaded(page);
    
    await expect(page).toHaveScreenshot('product-details-mobile.png', 
      getScreenshotOptions('standard', { fullPage: true })
    );
  });
});

/**
 * Educational notes on responsive visual testing best practices:
 * 
 * 1. Viewport Selection:
 *    - Test common breakpoints (desktop, tablet, mobile)
 *    - Consider testing specific device dimensions for critical devices
 *    - Document the viewport sizes being tested
 * 
 * 2. Test Considerations:
 *    - Check for element visibility and proper layout
 *    - Verify text readability and image scaling
 *    - Ensure interactive elements are accessible
 * 
 * 3. Maintenance:
 *    - Update baselines when responsive design changes
 *    - Document expected differences between viewport sizes
 *    - Consider using different thresholds for different viewports
 */
