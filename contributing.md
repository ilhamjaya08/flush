# Contributing to Flush Framework

We love your input! We want to make contributing to Flush Framework as easy and transparent as possible.

## Development Process

We use GitHub to host code, track issues and feature requests, and accept pull requests.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/ilhamjaya08/flush.git
cd flush
```

### 2. Install Dependencies

```bash
# Install Bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Install project dependencies
bun install
```

### 3. Set Up Development Environment

```bash
# Build all packages
bun run build

# Run tests
bun test

# Start example app for testing
cd examples/basic-app
bun run dev
```

## Project Structure

```
flush-framework/
├── packages/
│   ├── core/           # Framework core (@flush/core)
│   ├── cli/            # CLI tool (@flush/cli)
│   └── create-flush/   # Project scaffolder
├── examples/           # Example applications
├── docs/              # Documentation (VitePress)
└── scripts/           # Build and release scripts
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clear, concise code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
bun test

# Test CLI commands
cd packages/cli
bun run build
bun run dist/cli.js --help

# Test example apps
cd examples/basic-app
bun run dev
```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use strict mode settings
- Add JSDoc comments for public APIs

```typescript
/**
 * Creates a new user in the database
 * @param userData - The user data to create
 * @returns Promise resolving to the created user
 */
export async function createUser(userData: CreateUserData): Promise<User> {
  // Implementation
}
```

### Naming Conventions

- **Classes**: PascalCase (`UserController`, `FlushApp`)
- **Functions/Variables**: camelCase (`createUser`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_PORT`, `MAX_RETRIES`)
- **Files**: PascalCase for classes, camelCase for utilities

### Code Organization

- Keep functions small and focused
- Use meaningful variable names
- Prefer composition over inheritance
- Write self-documenting code

## Testing

### Writing Tests

```typescript
import { test, expect } from 'bun:test';
import { FlushApp } from '../src/FlushApp';

test('FlushApp should create routes', () => {
  const app = new FlushApp();
  
  app.get('/test', (req, res) => {
    res.json({ message: 'test' });
  });
  
  const routes = app.getRoutes();
  expect(routes).toHaveLength(1);
  expect(routes[0].path).toBe('/test');
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test packages/core/tests/FlushApp.test.ts

# Run tests with coverage
bun test --coverage
```

## Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Add TypeScript types in examples
- Test all code examples

### Building Documentation

```bash
cd docs
bun install
bun run dev    # Development server
bun run build  # Build for production
```

## Submitting Changes

### 1. Commit Your Changes

Use conventional commit messages:

```bash
# Features
git commit -m "feat: add user authentication middleware"

# Bug fixes
git commit -m "fix: resolve routing parameter parsing issue"

# Documentation
git commit -m "docs: update installation guide"

# Tests
git commit -m "test: add controller validation tests"
```

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

- Use a clear title and description
- Reference any related issues
- Include screenshots for UI changes
- Add tests for new features

## Pull Request Process

1. **Review**: Maintainers will review your PR
2. **Feedback**: Address any requested changes
3. **Approval**: PR gets approved by maintainers
4. **Merge**: PR is merged into main branch

## Reporting Issues

### Bug Reports

Include:
- Flush version
- Bun version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Code examples (if applicable)

### Feature Requests

Include:
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Examples from other frameworks (if applicable)

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

### Communication

- Use GitHub Issues for bug reports and feature requests
- Use GitHub Discussions for questions and ideas
- Join our Discord for real-time chat
- Be patient with response times

## Development Tips

### Debugging

```bash
# Enable debug logging
DEBUG=flush:* bun run dev

# Use Bun's built-in debugger
bun --inspect src/index.ts
```

### Performance Testing

```bash
# Benchmark your changes
bun run benchmark

# Profile memory usage
bun --heap-prof src/index.ts
```

### Local Package Testing

```bash
# Link local packages for testing
cd packages/core
bun link

cd your-test-project
bun link flush-core
```

## Release Process

Maintainers handle releases:

1. Update version numbers
2. Update changelog
3. Create git tags
4. Publish to npm
5. Create GitHub release

## Getting Help

- **Documentation**: Check the [docs](https://flush-framework.dev)
- **GitHub Issues**: Search existing issues first
- **Discord**: Join our community chat
- **Email**: Contact maintainers directly for sensitive issues

## Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Documentation credits
- Annual contributor highlights

Thank you for contributing to Flush Framework! 🚀