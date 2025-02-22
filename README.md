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

We use tags to categorize our tests:
- `@smoke`: Critical path tests, run on every PR
- `@regression`: Full test suite, run nightly
- `@flaky`: Tests that need investigation

## 🚀 Running Tests

```bash
# Run all tests
npx playwright test

# Run smoke tests only
npx playwright test --grep @smoke

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run a specific test file
npx playwright test login.spec.ts
```
