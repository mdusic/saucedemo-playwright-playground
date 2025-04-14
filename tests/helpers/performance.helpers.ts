import { Page } from '@playwright/test';

/**
 * Helper functions for performance and resilience testing
 */
export const performanceHelpers = {
    /**
     * Retries clicking an element with exponential backoff
     * 
     * This function is useful for situations where elements might not be
     * immediately clickable due to:
     * - Animation effects
     * - Slow page loading
     * - Performance glitches in the application
     * - Network latency
     * 
     * It uses exponential backoff, meaning each retry waits longer
     * than the previous one, which helps handle temporary issues.
     * 
     * @param page - Playwright Page object 
     * @param selector - CSS selector for the element to click
     * @param options - Configuration options for retry behavior
     * @returns Object containing success status, number of attempts made, and total time taken
     */
    async retryClick(
        page: Page,
        selector: string,
        options = { 
            maxAttempts: 3,    // Maximum number of click attempts
            initialDelay: 100, // Initial wait time in ms
            maxDelay: 1000     // Maximum wait time in ms
        }
    ): Promise<{ success: boolean; attempts: number; totalTime: number }> {
        let attempts = 0;
        let delay = options.initialDelay;
        const start = Date.now();

        while (attempts < options.maxAttempts) {
            try {
                // Wait for element to be visible before attempting to click
                await page.waitForSelector(selector, { state: 'visible', timeout: delay });
                // Try to click the element
                await page.click(selector);
                
                // If we get here, the click was successful
                return {
                    success: true,
                    attempts: attempts + 1,
                    totalTime: Date.now() - start
                };
            } catch (error) {
                // Click failed, increment attempt counter
                attempts++;
                
                // If we've reached the maximum number of attempts, return failure
                if (attempts === options.maxAttempts) {
                    return {
                        success: false,
                        attempts,
                        totalTime: Date.now() - start
                    };
                }
                
                // Double the delay for next attempt (exponential backoff)
                // but don't exceed the maximum delay
                delay = Math.min(delay * 2, options.maxDelay);
                
                // Wait before trying again, with a small random component to avoid
                // potential timing issues
                await page.waitForTimeout(delay + Math.random() * 100);
            }
        }
        
        // This should never be reached due to the return in the if-statement above,
        // but is needed for TypeScript to understand all code paths return a value
        return {
            success: false,
            attempts,
            totalTime: Date.now() - start
        };
    },

    /**
     * Checks if an image is properly loaded and returns detailed information
     * about the image state to help with debugging
     * 
     * @param page - Playwright Page object
     * @param selector - CSS selector for the image
     * @returns Object with load status, dimensions and error details if any
     */
    async checkImageLoaded(page: Page, selector: string): Promise<{
        loaded: boolean;
        exists: boolean;
        dimensions?: {
            naturalWidth: number;
            naturalHeight: number;
            width: number;
            height: number;
        };
        errorInfo?: string;
    }> {
        return page.evaluate((sel) => {
            // Find the image element
            const img = document.querySelector(sel) as HTMLImageElement;
            
            // Check if image element exists
            if (!img) {
                return {
                    loaded: false,
                    exists: false,
                    errorInfo: `Image element not found with selector: ${sel}`
                };
            }
            
            // Check if image has loaded successfully
            const isLoaded = img.complete && img.naturalWidth > 0;
            
            // Collect information about the image for debugging
            const dimensions = {
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                width: img.width,
                height: img.height
            };
            
            // Determine error info for failed images
            let errorInfo: string | undefined = undefined;
            if (!isLoaded) {
                if (img.complete && img.naturalWidth === 0) {
                    errorInfo = 'Image failed to load (naturalWidth is 0)';
                } else if (!img.complete) {
                    errorInfo = 'Image loading incomplete';
                }
            }
            
            return {
                loaded: isLoaded,
                exists: true,
                dimensions,
                errorInfo
            };
        }, selector);
    },

    /**
     * Gets image dimensions
     */
    async getImageDimensions(page: Page, selector: string): Promise<{
        naturalWidth: number;
        naturalHeight: number;
        width: number;
        height: number;
    }> {
        return page.evaluate((sel) => {
            const img = document.querySelector(sel) as HTMLImageElement;
            return {
                naturalWidth: img?.naturalWidth || 0,
                naturalHeight: img?.naturalHeight || 0,
                width: img?.width || 0,
                height: img?.height || 0
            };
        }, selector);
    }
} as const;
