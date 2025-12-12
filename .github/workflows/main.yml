name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # allows manual run
    {}

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright Tests
        run: npx playwright test

      - name: Upload HTML Report
        if: always()   # upload even if tests fail
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
