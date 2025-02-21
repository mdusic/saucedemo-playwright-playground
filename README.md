# SauceDemo Playwright Automation

This repository contains automated tests for the SauceDemo website using Playwright with TypeScript. The project demonstrates various testing approaches including E2E testing, data-driven testing, API mocking, and visual regression testing.

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
