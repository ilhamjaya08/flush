# Getting Started

This guide will help you create your first Flush application in minutes.

## Prerequisites

Make sure you have Bun installed on your system:

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

## Creating a New Project

The fastest way to get started is using the `create-flush` scaffolding tool:

```bash
# Create new project
bunx create-flush my-app

# Navigate to project
cd my-app

# Install dependencies
bun install
```

## Project Structure

Your new Flush project will have this structure:

```
my-app/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Data models
│   ├── middleware/     # Custom middleware
│   ├── routes/         # Route definitions
│   └── index.ts        # Application entry point
├── database/
│   ├── migrations/     # Database migrations
│   └── seeds/          # Database seeders
├── public/             # Static assets
├── tests/              # Test files
├── package.json
└── tsconfig.json
```

## Your First Route

Open `src/routes/index.ts` and you'll see:

```typescript
import type { FlushApp } from 'flush-core';
import { HomeController } from './controllers/HomeController';

export function routes(app: FlushApp) {
  app.get('/', HomeController.index);
  
  app.group('/api', (router) => {
    router.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });
}
```

## Starting the Development Server

Run the development server:

```bash
bun run dev
```

Your application will be available at `http://localhost:3000`.

## Making Your First Controller

Generate a new controller using the CLI:

```bash
flush make controller UserController --resource
```

This creates `src/controllers/UserController.ts` with CRUD methods:

```typescript
import { Controller } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';

export class UserController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    const users = []; // TODO: Fetch from database
    res.json(this.success(users));
  }

  static async show(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    // TODO: Find user by id
    res.json(this.success({ id, name: 'Sample User' }));
  }

  static async store(req: FlushRequest, res: FlushResponse) {
    const data = req.body;
    // TODO: Validate and create user
    res.status(201).json(this.success(data, 'User created successfully'));
  }

  static async update(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    const data = req.body;
    // TODO: Find and update user
    res.json(this.success(data, 'User updated successfully'));
  }

  static async destroy(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    // TODO: Delete user
    res.json(this.success(null, 'User deleted successfully'));
  }
}
```

## Adding Routes

Add the new controller to your routes:

```typescript
import { UserController } from './controllers/UserController';

export function routes(app: FlushApp) {
  app.get('/', HomeController.index);
  
  app.group('/api', (router) => {
    router.get('/users', UserController.index);
    router.get('/users/:id', UserController.show);
    router.post('/users', UserController.store);
    router.put('/users/:id', UserController.update);
    router.delete('/users/:id', UserController.destroy);
  });
}
```

## Testing Your API

Test your new endpoints:

```bash
# Get all users
curl http://localhost:3000/api/users

# Get specific user
curl http://localhost:3000/api/users/1

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Next Steps

Now that you have a basic application running:

1. [Learn about routing](/guide/routing) - Define complex route patterns
2. [Explore controllers](/guide/controllers) - Handle business logic
3. [Set up models](/guide/models) - Manage your data
4. [Add middleware](/guide/middleware) - Handle cross-cutting concerns
5. [Implement validation](/guide/validation) - Validate incoming requests

## Available CLI Commands

Flush provides powerful CLI commands to speed up development:

```bash
# Generate components
flush make controller PostController --resource
flush make model Post --migration
flush make middleware AuthMiddleware

# Database operations
flush db:migrate
flush db:seed

# Development tools
flush serve --port 8000
flush route:list
```