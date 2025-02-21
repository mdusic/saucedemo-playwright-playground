/**
 * Test data for login scenarios
 */
export const loginData = {
    validUser: {
        username: 'standard_user',
        password: 'secret_sauce',
        expectedTitle: 'Products'
    },
    invalidUser: {
        username: 'invalid_user',
        password: 'wrong_password',
        expectedError: 'Epic sadface: Username and password do not match any user in this service'
    },
    lockedUser: {
        username: 'locked_out_user',
        password: 'secret_sauce',
        expectedError: 'Epic sadface: Sorry, this user has been locked out.'
    }
};
