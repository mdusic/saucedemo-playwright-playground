# SauceDemo Playwright Automation

End-to-end test automation suite for SauceDemo using Playwright.

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

## 🏗️ Project Structure

```
├── tests/
│   ├── e2e/                 # End-to-end test specs
│   ├── data/               # Test data and fixtures
│   └── utils/              # Test utilities
├── pages/                  # Page Object Models
├── .github/
│   └── workflows/          # GitHub Actions
└── playwright.config.ts    # Playwright configuration
```

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

Run specific test suites:

```bash
# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run all tests
npm run test

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

### Performance Test Tags

- `@performance`: Tests that verify loading times and responsiveness
- `@resilience`: Tests that verify behavior under problematic conditions

Run performance tests:
```bash
# Run all performance tests
npm test tests/e2e/performance.spec.ts

# Run only performance-tagged tests
npx playwright test --grep @performance
```

### Performance Testing Strategy

1. **Page Load Performance**
   - Measures time from navigation start to first image visible
   - Adapts expectations based on user type
   - Handles network state differently for performance user

2. **Click Performance**
   - Uses retry mechanism with exponential backoff
   - Verifies both success and timing of interactions
   - Adjusts retry attempts based on user type

3. **Image Loading**
   - Verifies image visibility and proper loading
   - Checks image dimensions for standard user
   - Handles expected failures for problem user
   - Ensures eventual loading for performance user

### Helper Functions

The `performanceHelpers` module provides utilities for:
- Retrying actions with exponential backoff
- Checking image load status
- Verifying image dimensions

Example usage:
```typescript
// Retry clicking with exponential backoff
const result = await performanceHelpers.retryClick(page, selector, {
    maxAttempts: 3,
    initialDelay: 100,
    maxDelay: 1000
});

// Check if image is properly loaded
const isLoaded = await performanceHelpers.checkImageLoaded(page, selector);

// Get image dimensions
const dimensions = await performanceHelpers.getImageDimensions(page, selector);
