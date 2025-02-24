/**
 * Login page locators
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
    passwordInfo: '[data-test="login-password"]'
} as const;
