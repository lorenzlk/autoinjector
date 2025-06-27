# Contributing to AutoInjector

Thank you for your interest in contributing to AutoInjector! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/autoinjector.git
   cd autoinjector
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

## Project Structure

```
AutoInjector/
├── index.js              # Main Express server
├── steps/                 # Workflow steps
│   ├── fetch.js          # HTML content fetching
│   ├── extract.js        # DOM analysis & candidate extraction
│   └── generate_snippet.js # JavaScript snippet generation
├── test-injection.js     # Testing utilities
├── visual-test.js        # Visual testing tools
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Multi-container setup
└── .github/              # GitHub Actions workflows
```

## Making Changes

### Workflow Steps

The AutoInjector follows a 3-step workflow:

1. **Fetch** (`steps/fetch.js`): Retrieves HTML content from target URLs
2. **Extract** (`steps/extract.js`): Analyzes DOM structure and finds injection candidates
3. **Generate** (`steps/generate_snippet.js`): Creates JavaScript injection snippets

### Key Principles

- **Universal Compatibility**: Code should work on any website
- **Non-Disruptive**: Never interfere with existing content or ads
- **Performance**: Minimize processing time and memory usage
- **Security**: Validate inputs and prevent XSS/injection attacks

### Adding New Features

1. **Site Type Detection**: Add new patterns to `extract.js`
2. **Scoring Logic**: Update `calculateInjectionScore()` function
3. **Context Parameters**: Add new context types for targeting
4. **Selector Generation**: Improve CSS selector reliability

## Testing

### Manual Testing

1. **Console Testing**:
   ```javascript
   // Test injection on any website
   // (See visual-test.js for complete code)
   ```

2. **Workflow Testing**:
   ```bash
   npm test
   curl "http://localhost:3000/?url=https://example.com&context=after_ad"
   ```

3. **Visual Testing**:
   ```bash
   npm run visual-test
   ```

### Automated Testing

- Unit tests: `npm test`
- Linting: `npm run lint`
- Security audit: `npm audit`

### Test Coverage

Focus testing on:
- [ ] Different website types (WordPress, news, e-commerce)
- [ ] Various DOM structures and layouts
- [ ] Edge cases (no candidates found, malformed HTML)
- [ ] Security scenarios (XSS attempts, invalid URLs)

## Code Style

### JavaScript Guidelines

- Use ES6+ features (modules, async/await, destructuring)
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names
- Add comments for complex logic
- Keep functions focused and small

### Formatting

```bash
npm run format  # Auto-format with Prettier
npm run lint    # Check code style
```

### Error Handling

- Always use try-catch for async operations
- Provide meaningful error messages
- Log errors with context (request ID, URL, etc.)
- Return appropriate HTTP status codes

## Submitting Changes

### Pull Request Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Thoroughly**:
   ```bash
   npm test
   npm run lint
   npm audit
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add support for new site type"
   ```

5. **Push and Create PR**:
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(extract): add support for Shopify sites`
- `fix(security): prevent XSS in URL validation`
- `docs(readme): update deployment instructions`

### PR Guidelines

- **Title**: Clear, descriptive summary
- **Description**: Explain what changes and why
- **Testing**: Include test results and manual testing steps
- **Screenshots**: For UI/visual changes
- **Breaking Changes**: Clearly document any breaking changes

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Docker image builds successfully
- [ ] Production deployment tested

## Getting Help

### Resources

- [GitHub Issues](https://github.com/lorenzlk/autoinjector/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/lorenzlk/autoinjector/discussions) - Questions and community chat
- [Documentation](README.md) - Project overview and usage guide

### Contact

- **Project Maintainer**: Lorenzo Lorenz
- **Email**: contact@autoinjector.dev
- **GitHub**: [@lorenzlk](https://github.com/lorenzlk)

## Code of Conduct

### Our Standards

- **Be Respectful**: Treat all contributors with respect
- **Be Collaborative**: Work together constructively
- **Be Patient**: Help newcomers learn and grow
- **Be Professional**: Keep discussions focused and productive

### Reporting Issues

Report unacceptable behavior to contact@autoinjector.dev.

---

Thank you for contributing to AutoInjector! 🎯 