# Installation

Learn how to install and set up Flush Framework in different environments.

## System Requirements

- **Bun**: Version 1.0.0 or higher
- **Operating System**: macOS, Linux, or Windows
- **Memory**: 512MB RAM minimum
- **Disk Space**: 100MB available space

## Installing Bun

First, install the Bun runtime:

### macOS and Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Package Managers

```bash
# Homebrew (macOS)
brew tap oven-sh/bun
brew install bun

# Scoop (Windows)
scoop install bun

# npm (Cross-platform)
npm install -g bun
```

Verify your installation:

```bash
bun --version
```

## Creating a New Project

### Using create-flush (Recommended)

The easiest way to start a new Flush project:

```bash
bunx create-flush my-app
cd my-app
bun install
```

### Manual Installation

If you prefer to set up manually:

```bash
# Create project directory
mkdir my-app && cd my-app

# Initialize package.json
bun init

# Install Flush packages
bun add flush-core flush-cli

# Install dev dependencies
bun add -d @types/bun typescript
```

Create the basic structure:

```bash
mkdir -p src/{controllers,models,middleware,routes}
mkdir -p database/{migrations,seeds}
mkdir -p public tests
```

## Project Configuration

### TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Package.json Scripts

Update your `package.json`:

```json
{
  "scripts": {
    "dev": "flush serve",
    "build": "bun build src/index.ts --outdir dist --target bun",
    "start": "bun run dist/index.js",
    "test": "bun test"
  }
}
```

## Environment Setup

### Development Environment

Create `.env` file for development:

```bash
# Application
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DATABASE_URL="sqlite:./database/dev.db"

# Security
JWT_SECRET=your-secret-key
```

### Production Environment

For production, set these environment variables:

```bash
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

## IDE Setup

### VS Code

Install recommended extensions:

```json
{
  "recommendations": [
    "oven.bun-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode"
  ]
}
```

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Docker Setup

### Dockerfile

```dockerfile
FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist .
COPY --from=prerelease /usr/src/app/package.json .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.js" ]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/flush_app
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=flush_app
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Verification

Verify your installation by creating a simple app:

```typescript
// src/index.ts
import { FlushApp } from 'flush-core';

const app = new FlushApp();

app.get('/', (req, res) => {
  res.json({ message: 'Flush is working!' });
});

app.listen();
```

Run the application:

```bash
bun run dev
```

Visit `http://localhost:3000` to see your app running.

## Troubleshooting

### Common Issues

**Bun not found**
```bash
# Add to your shell profile
export PATH="$HOME/.bun/bin:$PATH"
```

**Permission denied**
```bash
# Fix permissions
chmod +x ~/.bun/bin/bun
```

**TypeScript errors**
```bash
# Install types
bun add -d @types/bun
```

**Port already in use**
```bash
# Use different port
flush serve --port 8000
```

### Getting Help

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/ilhamjaya08/flush-framework/issues)
2. Join our [Discord community](https://discord.gg/flush-framework)
3. Read the [troubleshooting guide](/guide/troubleshooting)