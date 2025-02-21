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

## 🧪 Page Object Model Structure

Each page object should:
1. Encapsulate selectors
2. Provide high-level actions
3. Include validation methods

Example:
```typescript
class LoginPage {
  // Selectors as private fields
  private readonly usernameInput = ...;
  
  // Public actions
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
  
  // Validation methods
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

## 🔍 Pull Request Guidelines

1. PR Title Format: `[Type] Description`
   Example: `[Test] Add checkout flow validation`

2. PR Description should include:
   - Purpose of changes
   - Test scenarios covered
   - Any known limitations
   - Screenshots (if UI changes)

3. PR Checklist:
   - [ ] Tests pass locally
   - [ ] No flaky tests
   - [ ] Code follows POM pattern
   - [ ] Documentation updated
   - [ ] PR is small and focused

## 🛠️ Test Data Management

1. Use fixtures for test data
2. Implement data isolation
3. Use environment variables for configuration

## 📝 Environment Variables

```bash
BASE_URL=https://www.saucedemo.com
DEFAULT_PASSWORD=secret_sauce
TEST_ENV=staging
```

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test login.spec.ts

# Run tests in headed mode
npx playwright test --headed
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📋 PR Template

When creating a PR, use our template in `.github/pull_request_template.md`

## 🚀 Features

- End-to-End tests for key user flows
- Data-driven testing
- API mocking capabilities
- Visual regression testing
- CI/CD integration with GitHub Actions

## 📁 Project Structure

```
├── tests/
│   ├── e2e/           # End-to-end test scenarios
│   ├── api/           # API testing and mocking
│   ├── visual/        # Visual regression tests
│   └── data/          # Test data files
├── pages/             # Page Object Models
├── fixtures/          # Test fixtures and common setup
├── utils/             # Helper functions and utilities
└── config/            # Environment configurations
```

## 🛠️ Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Run tests:
   ```bash
   # Run all tests
   npm test

   # Run specific test file
   npx playwright test tests/e2e/login.spec.ts

   # Run tests with UI mode
   npx playwright test --ui
   ```

## 🧪 Test Categories

- **Authentication Tests**: Login/Logout flows
- **Shopping Cart Tests**: Add/Remove items, Cart management
- **Checkout Tests**: Complete purchase flow
- **Visual Tests**: UI consistency checks
- **API Mock Tests**: Various API response scenarios

## 📊 Reports

Test reports are automatically generated after each test run and can be found in the `playwright-report` directory.

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
```
