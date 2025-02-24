/**
 * Shared components locators (menu, footer, etc.)
 * These elements appear across multiple pages
 */
export const sharedLocators = {
    // Menu elements
    menu: {
        openButton: { role: 'button', name: 'Open Menu' },
        closeButton: { role: 'button', name: 'Close Menu' },
        inventoryLink: '[data-test="inventory-sidebar-link"]',
        aboutLink: '[data-test="about-sidebar-link"]',
        logoutLink: '[data-test="logout-sidebar-link"]',
        resetLink: '[data-test="reset-sidebar-link"]'
    },

    // Footer elements
    footer: {
        container: '[data-test="footer"]',
        socialLinks: {
            twitter: '[data-test="social-twitter"]',
            facebook: '[data-test="social-facebook"]',
            linkedin: '[data-test="social-linkedin"]'
        },
        copyright: '[data-test="footer-copy"]'
    },

    // Common page elements
    title: '[data-test="title"]',
    secondaryHeader: '[data-test="secondary-header"]',
} as const;

/**
 * Helper functions for working with role-based locators
 */
export const getByRole = {
    button: (name: string) => ({ role: 'button', name })
} as const;
