/**
 * User credentials and expected behaviors for different user types
 */
export const users = {
    standard: {
        username: 'standard_user',
        password: 'secret_sauce',
        type: 'standard',
        expectedTitle: 'Products'
    },
    locked: {
        username: 'locked_out_user',
        password: 'secret_sauce',
        type: 'locked',
        expectedError: 'Epic sadface: Sorry, this user has been locked out.'
    },
    problem: {
        username: 'problem_user',
        password: 'secret_sauce',
        type: 'problem'
    },
    performance: {
        username: 'performance_glitch_user',
        password: 'secret_sauce',
        type: 'performance'
    },
    error: {
        username: 'error_user',
        password: 'secret_sauce',
        type: 'error'
    },
    visual: {
        username: 'visual_user',
        password: 'secret_sauce',
        type: 'visual'
    }
} as const;

/**
 * Common error messages
 */
export const loginErrors = {
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    lockedOut: 'Epic sadface: Sorry, this user has been locked out.'
} as const;
