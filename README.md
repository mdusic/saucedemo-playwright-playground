# SauceDemo Playwright Automation

End-to-end test automation suite for SauceDemo using Playwright.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Running Tests](#-running-tests)
- [Page Object Model](#-page-object-model-best-practices)
- [Branching Strategy](#-branching-strategy)
- [Development Workflow](#-development-workflow)
- [Pull Request Guidelines](#-pull-request-guidelines)
- [CI/CD](#-cicd)
- [Test Tags](#-test-tags)
- [Performance Testing](#-performance-testing)
- [Troubleshooting](#-troubleshooting)

## 🚀 Quick Start

Follow these steps to get started with the project:

```bash
# 1. Clone the repository
git clone <repository-url>
cd saucedemo-playwright-playground

# 2. Install dependencies
npm install

# 3. Run the tests in headed mode to see the browser
npm run test:headed

# 4. View the test report
npm run report
```

### Prerequisites

- Node.js 14 or higher
- npm or yarn
- Git

## 🏗️ Project Structure

```
├── tests/                  # Test files
│   ├── e2e/                # End-to-end test specs
│   │   ├── login.spec.ts   # Login functionality tests
│   │   ├── product-catalog.spec.ts # Product catalog tests
│   │   └── ...
│   ├── data/               # Test data and fixtures
│   ├── helpers/            # Helper functions for tests
│   ├── locators/           # Selector definitions
│   └── utils/              # Utility functions and test extensions
├── pages/                  # Page Object Models
│   ├── BasePage.ts         # Base page with common functionality
│   ├── LoginPage.ts        # Login page actions and verifications
│   └── ...
├── .github/
│   └── workflows/          # GitHub Actions CI configuration
├── playwright.config.ts    # Playwright configuration
└── package.json            # Project dependencies and scripts
```

## 🧪 Running Tests

This project includes different test groups that can be run separately:

```bash
# Run all tests
npm test

# Run tests in headed mode (with browser visible)
npm run test:headed

# Run only smoke tests (critical path)
npm run test:smoke

# Run only regression tests
npm run test:regression

# Run tests with UI mode for debugging
npm run test:ui

# Run tests with interactive debugging
npm run test:debug

# Run visual tests
npm run test:visual

# Generate test code from UI interactions
npm run codegen
```

### Test Results and Reports

To view the HTML report after test execution:

```bash
npm run report
```

The report will open in your default browser and show test results with screenshots for failures.

## 🧪 Page Object Model Best Practices

1. **Selector Priority**
   - Use data-test attributes as the first choice: `[data-test="login-button"]`
   - Use ARIA roles when appropriate: `getByRole('button', { name: 'Open Menu' })`
   - Only use classes/IDs when no better option exists

2. **Page Object Structure**
   ```typescript
   class ProductsPage {
     // Selectors as private readonly fields
     private readonly addToCartButton = '[data-test="add-to-cart"]';
     
     // Simple, focused methods
     async addProductToCart(productName: string) {
       const selector = `[data-test="add-to-cart-${productName}"]`;
       await this.clickFirstElement(selector);
     }
     
     // Methods return promises when async
     async getCartQuantity(): Promise<number> {
       return await this.page.locator(this.removeButtons).count();
     }
   }
   ```

3. **Test Structure**
   ```typescript
   test('should add product to cart @smoke', async () => {
     // Given: Start from a known state
     await loginPage.login(username, password);
     
     // When: Perform the action
     await productsPage.addProductToCart('Sauce Labs Backpack');
     
     // Then: Verify the result
     const quantity = await productsPage.getCartQuantity();
     expect(quantity).toBe(1, 'Cart should show 1 item');
   });
   ```

## 🌳 Branching Strategy

We follow a simplified GitFlow strategy:

- `main`: Production-ready code, protected branch
- `develop`: Integration branch for features
- `feature/*`: Feature branches for new tests/functionality
- `fix/*`: Bug fix branches
- `refactor/*`: Test refactoring branches

### Branch Naming Convention

- Feature branches: `feature/login-tests`
- Bug fixes: `fix/flaky-checkout-test`
- Refactoring: `refactor/page-object-structure`

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

Types:
- `test`: New tests or test modifications
- `feat`: New features in test framework
- `fix`: Bug fixes
- `refactor`: Code refactoring
- `docs`: Documentation updates
- `chore`: Maintenance tasks

Examples:
```
test(login): add validation for locked user
feat(pom): implement shopping cart page object
fix(checkout): resolve flaky payment validation
```

## 🔄 Development Workflow

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards
3. Commit changes with meaningful messages
4. Push your branch and create a PR to `develop`

## 🔍 Pull Request Guidelines

1. PR Title Format: `[Type] Description`
   Example: `[Test] Add checkout flow validation`

2. PR Description Template:
   ```markdown
   ## Changes
   - Added new test for...
   - Updated selector to use data-test...
   - Simplified login page methods...

   ## Testing
   - [ ] All tests pass locally
   - [ ] No flaky tests introduced
   - [ ] Code follows best practices
   ```

3. Review Checklist:
   - Tests are clear and focused
   - Selectors use data-test attributes where possible
   - Code is well-commented and easy to understand
   - No unnecessary complexity

## 🔄 CI/CD

Tests are automatically run on every push to the repository using GitHub Actions. Check the `.github/workflows` directory for the configuration.

## 🏷️ Test Tags

We use the following tags to organize our tests:

- `@smoke`: Critical path tests that should run on every commit
- `@regression`: Comprehensive tests for thorough validation
- `@visual`: Visual regression tests
- `@api`: API integration tests
- `@performance`: Performance-related tests
- `@resilience`: Tests that verify behavior under problematic conditions

Run specific test suites:

```bash
# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run all tests
npm run test
```

## 🚀 Performance Testing

Our test suite includes performance and resilience tests for different user types:

### User Types and Expectations

1. **Standard User**
   - Page load time: < 3000ms
   - Click response time: < 1000ms
   - All images should load properly with correct dimensions

2. **Performance Glitch User**
   - Page load time: 3000ms - 15000ms (intentionally slower)
   - Click response time: < 5000ms
   - Images should eventually load properly

3. **Problem User**
   - Page load time: < 3000ms
   - Click response time: < 2000ms
   - Expected to have image loading issues

Run performance tests:
```bash
# Run all performance tests
npm test tests/e2e/performance.spec.ts

# Run only performance-tagged tests
npx playwright test --grep @performance
```

## 🔧 Troubleshooting

### Common Issues

1. **Tests fail due to timeouts**
   - Check the application performance
   - Increase timeout values in `playwright.config.ts`
   - Use retry mechanisms for flaky elements

2. **Selector not found errors**
   - Verify the selector is correct and exists in the application
   - Use the Playwright Inspector (`npm run test:debug`) to debug
   - Consider using more reliable selectors (data-test attributes)

3. **Visual differences**
   - Check if the application UI has changed
   - Update visual baseline using `--update-snapshots` flag

### Debug Strategies

1. **Use Playwright UI Mode**
   ```bash
   npm run test:ui
   ```

2. **Use Playwright Inspector**
   ```bash 
   npm run test:debug
   ```

3. **Enable Verbose Logging**
   ```bash
   DEBUG=pw:api npm test
   ```

4. **Examine Traces and Screenshots**
   - Check the `test-results` directory for traces
   - Use the HTML report to examine failures
