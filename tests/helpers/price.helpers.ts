/**
 * Helper functions for working with prices throughout the application
 * These functions handle common price-related operations like formatting,
 * parsing, and calculations
 */

/**
 * Constants for price calculations
 */
export const PRICE_CONSTANTS = {
    TAX_RATE: 0.08, // 8% tax rate
    CURRENCY: '$'
} as const;

export const priceHelpers = {
    /**
     * Formats a number into a price string with currency symbol
     * @param price - The price to format
     * @returns Formatted price string (e.g., "$29.99")
     */
    formatPrice: (price: number): string => {
        return `${PRICE_CONSTANTS.CURRENCY}${price.toFixed(2)}`;
    },

    /**
     * Parses a price string into a number
     * @param priceText - The price string to parse (e.g., "$29.99" or "29.99")
     * @returns The parsed price as a number
     */
    parsePrice: (priceText: string): number => {
        return parseFloat(priceText.replace(PRICE_CONSTANTS.CURRENCY, ''));
    },

    /**
     * Calculates tax amount based on subtotal
     * @param subtotal - The subtotal amount before tax
     * @returns The calculated tax amount
     */
    calculateTax: (subtotal: number): number => {
        return subtotal * PRICE_CONSTANTS.TAX_RATE;
    },

    /**
     * Calculates total including tax
     * @param subtotal - The subtotal amount before tax
     * @param tax - The tax amount
     * @returns The total amount including tax
     */
    calculateTotal: (subtotal: number, tax: number): number => {
        return subtotal + tax;
    }
} as const;
