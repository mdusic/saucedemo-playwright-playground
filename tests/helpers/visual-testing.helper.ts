/**
 * Visual Testing Helper Functions
 * 
 * This module provides helper functions for visual testing in the SauceDemo project.
 * It follows the educational focus of the project by providing well-documented
 * utilities that demonstrate best practices for visual testing.
 */

import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * User types available in SauceDemo with their credentials and visual characteristics
 */
export const USER_TYPES = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Normal functionality, all images load correctly',
    expectedVisualIssues: false
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'Has image loading issues (incorrect images)',
    expectedVisualIssues: true,
    knownIssues: [
      'Product images show dog pictures instead of the correct product images',
      'Some buttons may have styling issues',
      'Form interactions might behave unexpectedly'
    ]
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'Same visuals as standard_user but slower loading',
    expectedVisualIssues: false,
    performanceIssues: true
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'Cannot login, shows error message',
    expectedVisualIssues: false
  }
};

/**
 * Login as a specific user type
 * 
 * This function uses the existing LoginPage class to perform the login,
 * following the project's Page Object Model pattern.
 * 
 * @param page - Playwright page object
 * @param userType - Type of user to login as (standard, problem, performance, locked)
 * @returns Promise that resolves when login is complete or rejects if login fails
 * 
 * @example
 * // Login as standard user
 * await loginAs(page, 'standard');
 * 
 * @example
 * // Login as problem user with expected visual issues
 * await loginAs(page, 'problem');
 */
export async function loginAs(
  page: Page, 
  userType: 'standard' | 'problem' | 'performance' | 'locked'
): Promise<void> {
  const user = USER_TYPES[userType];
  const loginPage = new LoginPage(page);
  
  // Navigate to login page
  await loginPage.goto();
  
  // Use the existing login method from LoginPage
  await loginPage.login(user.username, user.password);
  
  // For locked user, we expect to stay on the login page with an error
  if (userType === 'locked') {
    await loginPage.isErrorMessageVisible();
    return;
  }
  
  // For other users, wait for products page to load
  // Use a longer timeout for performance_glitch_user
  const timeout = userType === 'performance' ? 10000 : 5000;
  await page.waitForSelector('.inventory_list', { timeout });
}

/**
 * Wait for all images on the page to complete loading
 * 
 * This is important for visual testing to ensure all visual elements
 * are fully loaded before taking screenshots.
 * 
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 * 
 * @example
 * // Wait for all images to load with default timeout
 * await waitForImagesLoaded(page);
 * 
 * @example
 * // Wait for all images with longer timeout for performance_glitch_user
 * await waitForImagesLoaded(page, 10000);
 */
export async function waitForImagesLoaded(page: Page, timeout = 5000): Promise<void> {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every(img => img.complete);
  }, { timeout });
}

/**
 * Get screenshot options based on user type
 * 
 * This function returns appropriate screenshot options for different user types,
 * taking into account their expected visual characteristics.
 * 
 * @param userType - Type of user (standard, problem, performance, locked)
 * @param customOptions - Additional options to merge with defaults
 * @returns Screenshot options object for use with toHaveScreenshot
 * 
 * @example
 * // Get default screenshot options for standard user
 * const options = getScreenshotOptions('standard');
 * await expect(page).toHaveScreenshot('example.png', options);
 */
export function getScreenshotOptions(
  userType: 'standard' | 'problem' | 'performance' | 'locked',
  customOptions: Record<string, any> = {}
): Record<string, any> {
  // Base options for all screenshots
  const baseOptions = {
    animations: 'disabled',
    fullPage: false,
    // Add maxDiffPixelRatio to handle minor platform differences
    maxDiffPixelRatio: 0.05,
    // Add platform-specific snapshot suffix to handle cross-platform testing
    // This ensures snapshots are compared against the correct platform-specific baseline
    snapshotSuffix: process.env.CI ? '-linux' : '-darwin',
  };
  
  // User-specific options
  const userOptions: Record<string, any> = {};
  
  if (userType === 'problem') {
    // For problem user, we expect visual differences
    // In a real project, you might adjust threshold or use masks
    // for specific areas known to be different
    userOptions.threshold = 0.2; // Higher threshold to accommodate known differences
  }
  
  // Merge all options, with custom options taking precedence
  return {
    ...baseOptions,
    ...userOptions,
    ...customOptions
  };
}

/**
 * Educational notes on visual testing:
 * 
 * 1. Baseline Creation:
 *    - Always create baselines using the standard_user as this represents the "correct" state
 *    - Store baselines in version control and update them when intentional UI changes occur
 *    - Document the visual state that each baseline represents
 * 
 * 2. Comparison Strategy:
 *    - For standard_user and performance_glitch_user, expect exact matches to baseline
 *    - For problem_user, expect differences and focus tests on documenting these differences
 *    - Use targeted element screenshots rather than full page when possible
 * 
 * 3. Handling Dynamic Content:
 *    - Use masks to ignore areas with dynamic content (dates, times, etc.)
 *    - Disable animations and transitions for consistent screenshots
 *    - Consider time-dependent elements that might change between test runs
 * 
 * 4. Maintenance Best Practices:
 *    - Update baselines when the application UI intentionally changes
 *    - Document why certain thresholds or masks are used
 *    - Keep visual tests focused on critical UI elements
 */
