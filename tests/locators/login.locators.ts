/**
 * Login page locators
 * 
 * Contains all selectors needed for interacting with the login page.
 * Using data-test attributes wherever possible for reliability.
 */
export const loginLocators = {
    // Input fields
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',

    // Error messages and buttons
    errorMessage: '[data-test="error"]',
    errorCloseButton: '[data-test="error-button"]',

    // Information elements
    credentialsList: '[data-test="login-credentials"]',
    passwordInfo: '[data-test="login-password"]',
    
    // Page elements
    pageTitle: '.title' // Added for consistency with other page elements
} as const;
