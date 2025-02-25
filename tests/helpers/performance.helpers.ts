import { Page } from '@playwright/test';

/**
 * Helper functions for performance and resilience testing
 */
export const performanceHelpers = {
    /**
     * Retries clicking an element with exponential backoff
     */
    async retryClick(
        page: Page,
        selector: string,
        options = { maxAttempts: 3, initialDelay: 100, maxDelay: 1000 }
    ): Promise<{ success: boolean; attempts: number; totalTime: number }> {
        let attempts = 0;
        let delay = options.initialDelay;
        const start = Date.now();

        while (attempts < options.maxAttempts) {
            try {
                await page.waitForSelector(selector, { state: 'visible', timeout: delay });
                await page.click(selector);
                return {
                    success: true,
                    attempts: attempts + 1,
                    totalTime: Date.now() - start
                };
            } catch (error) {
                attempts++;
                if (attempts === options.maxAttempts) {
                    return {
                        success: false,
                        attempts,
                        totalTime: Date.now() - start
                    };
                }
                delay = Math.min(delay * 2, options.maxDelay);
                await page.waitForTimeout(delay + Math.random() * 100);
            }
        }
        return {
            success: false,
            attempts,
            totalTime: Date.now() - start
        };
    },

    /**
     * Checks if an image is properly loaded
     */
    async checkImageLoaded(page: Page, selector: string): Promise<boolean> {
        return page.evaluate((sel) => {
            const img = document.querySelector(sel) as HTMLImageElement;
            return img && img.complete && img.naturalWidth > 0;
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
