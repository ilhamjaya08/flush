# Publishing Guide

## Prerequisites

1. **NPM Account**: Make sure you have an npm account and are logged in:
   ```bash
   npm login
   ```

2. **Enable 2FA**: Required for publishing packages:
   ```bash
   npm profile enable-2fa auth-and-writes
   ```

3. **Fix Package Issues**: Run this in each package directory:
   ```bash
   npm pkg fix
   ```

## Publishing Process

### Option 1: Automated Release (Recommended)

```bash
# Patch release (0.1.0 → 0.1.1)
bun run release:patch

# Minor release (0.1.0 → 0.2.0)  
bun run release:minor

# Major release (0.1.0 → 1.0.0)
bun run release:major
```

### Option 2: Manual Steps

1. **Build all packages:**
   ```bash
   bun run build
   ```

2. **Bump versions:**
   ```bash
   bun run version:patch  # or minor/major
   ```

3. **Commit version changes:**
   ```bash
   git add .
   git commit -m "chore: bump version to 0.1.1"
   git tag v0.1.1
   git push origin main --tags
   ```

4. **Publish to npm:**
   ```bash
   bun run publish:all
   ```

## Package Structure

- `@flush/core` - Framework core functionality
- `@flush/cli` - CLI tool (flush command)
- `create-flush` - Project scaffolder (like create-react-app)

## First Time Setup

If publishing for the first time:

1. **Create npm organization:**
   ```bash
   npm org create flush-framework
   ```

2. **Or change package names** in all package.json files to use your own scope:
   ```json
   {
     "name": "@your-username/flush-core"
   }
   ```

## Verification

After publishing, users should be able to:

```bash
# Create new project
bunx create-flush my-app

# Or install manually
bun add @flush/core @flush/cli
```

## Troubleshooting

- **403 Forbidden**: You don't have publish access to the organization
- **Version already exists**: Bump the version number
- **Build errors**: Make sure all TypeScript compiles without errors

## Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Version numbers are bumped
- [ ] Changelog is updated
- [ ] All packages build successfully
- [ ] Published packages work in a fresh project