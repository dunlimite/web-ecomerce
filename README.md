# web-ecomerce

## CI Pipeline

This project now includes a production-oriented GitHub Actions CI setup for the protected delivery branches:

- `main`
- `staging`
- `dev`

The pipeline runs on pushes to those branches, pull requests targeting those branches, and manual dispatches.

## What The Pipeline Checks

1. `Lint And Static Quality`
   Runs ESLint and uploads a JSON report artifact from `reports/lint/eslint-report.json`.

2. `CI Smoke Tests`
   Runs repository smoke tests with the Node test runner and uploads a JUnit test report from `reports/tests/junit.xml`.

3. `Production Build Verification`
   Creates the production build, generates a build metadata report at `reports/build/build-report.json`, and uploads both the report and the `dist/` bundle as artifacts.

4. `Dependency Vulnerability Audit`
   Runs `npm audit` with a high-severity threshold and uploads the JSON audit report from `reports/security/npm-audit.json`.

5. `Filesystem Security Scan`
   Runs Trivy against the repository filesystem for high and critical issues, uploads the SARIF report artifact, and publishes the scan into GitHub code scanning.

6. `Pull Request Dependency Review`
   On pull requests only, checks dependency diffs and fails if a newly introduced dependency has a high-severity issue.

7. `CodeQL`
   Runs GitHub CodeQL on `main`, `staging`, and `dev`, plus weekly on Monday for scheduled code scanning coverage.

## End-To-End Flow

1. A developer pushes to `dev`, `staging`, or `main`, or opens a pull request into one of those branches.
2. GitHub Actions starts the `CI` workflow and cancels older in-progress runs for the same ref.
3. Each quality gate runs in its own job so lint, tests, build, and security checks can fail independently.
4. Every job uploads its report artifact even when the job fails, which makes debugging much easier.
5. Trivy SARIF results and CodeQL findings are also published into GitHub Security for centralized visibility.
6. When all required jobs pass, the branch is ready for promotion or merge under branch protection rules.

## Recommended Branch Policy

For the strongest setup, configure GitHub branch protection on `main`, `staging`, and `dev` and require these checks before merge:

- `Lint And Static Quality`
- `CI Smoke Tests`
- `Production Build Verification`
- `Dependency Vulnerability Audit`
- `Filesystem Security Scan`
- `CodeQL / Analyze JavaScript with CodeQL`

## Local Commands

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:ci`
