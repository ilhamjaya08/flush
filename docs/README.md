# Flush Framework Documentation

This directory contains the official documentation for Flush Framework, built with VitePress.

## Development

### Prerequisites

- [Bun](https://bun.sh) runtime installed
- Node.js 18+ (for VitePress compatibility)

### Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview built site
bun run preview
```

## Structure

```
docs/
├── .vitepress/
│   ├── config.js       # VitePress configuration
│   └── dist/           # Built documentation (generated)
├── public/
│   ├── flush-logo.png  # Framework logo
│   └── flush-icon.png  # Favicon
├── guide/              # User guides
├── api/                # API reference
├── examples/           # Code examples
├── index.md            # Homepage
├── changelog.md        # Version history
└── contributing.md     # Contribution guide
```

## Writing Documentation

### Guidelines

1. **Clear and Concise**: Write in simple, easy-to-understand language
2. **Code Examples**: Include working code examples for all features
3. **TypeScript**: Use TypeScript in all code examples
4. **Testing**: Ensure all code examples work correctly

### Markdown Features

VitePress supports enhanced markdown features:

#### Code Blocks with Syntax Highlighting

```typescript
import { FlushApp } from 'flush-core';

const app = new FlushApp();
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});
```

#### Custom Containers

::: tip
This is a tip container
:::

::: warning
This is a warning container
:::

::: danger
This is a danger container
:::

#### Code Groups

::: code-group

```typescript [TypeScript]
const app = new FlushApp();
```

```javascript [JavaScript]
const app = new FlushApp();
```

:::

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

```bash
# Build the documentation
bun run build

# Deploy to GitHub Pages (if configured)
# The built files are in .vitepress/dist/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `bun run dev`
5. Build to ensure no errors: `bun run build`
6. Submit a pull request

## Links

- [Flush Framework](https://github.com/flush-framework/flush)
- [VitePress Documentation](https://vitepress.dev)
- [Live Documentation](https://flush-framework.dev)