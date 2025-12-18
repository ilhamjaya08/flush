# Flush Framework 🚀

A fast, clean, and Laravel-inspired MVC framework built for the Bun runtime.

## Features

- **⚡ Lightning Fast**: Built on Bun runtime for maximum performance
- **🎯 Laravel-inspired**: Familiar artisan-like CLI commands and MVC structure
- **📦 TypeScript First**: Full TypeScript support out of the box
- **🛠️ Rich CLI**: Powerful code generators and development tools
- **🔧 Middleware Support**: Flexible middleware system
- **📊 Built-in Validation**: Zod-powered request validation
- **🗄️ Database Ready**: Model system with migration support
- **🎨 Clean Architecture**: Well-organized MVC pattern

## Quick Start

### Installation

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Create new Flush project
bunx create-flush my-app
cd my-app

# Install dependencies
bun install

# Start development server
bun run dev
```

### Your First Route

```typescript
import { FlushApp } from '@flush/core';

const app = new FlushApp();

app.get('/', (req, res) => {
  return res.json({ message: 'Hello Flush!' });
});

app.listen();
```

## CLI Commands (Artisan-like)

### Project Management
```bash
flush new my-app              # Create new project
flush serve                   # Start development server
flush serve --port 8000       # Custom port
```

### Code Generation
```bash
flush make controller UserController --resource
flush make model User --migration
flush make middleware AuthMiddleware
flush make migration create_users_table
```

### Database Operations
```bash
flush db:migrate              # Run migrations
flush db:seed                 # Seed database
```

### Utilities
```bash
flush route:list              # List all routes
flush clear                   # Clear cache
```

## Framework Structure

```
my-flush-app/
├── src/
│   ├── controllers/          # Request handlers
│   ├── models/              # Data models
│   ├── middleware/          # Custom middleware
│   ├── routes/              # Route definitions
│   └── views/               # View templates
├── database/
│   ├── migrations/          # Database migrations
│   └── seeds/               # Database seeders
├── public/                  # Static assets
└── tests/                   # Test files
```

## Core Concepts

### Controllers

```typescript
import { Controller } from '@flush/core';
import type { FlushRequest, FlushResponse } from '@flush/core';

export class UserController extends Controller {
  async index(req: FlushRequest, res: FlushResponse) {
    const users = await User.all();
    return res.json(this.success(users));
  }
  
  async store(req: FlushRequest, res: FlushResponse) {
    const user = await User.create(req.body);
    return res.status(201).json(this.success(user));
  }
}
```

### Models

```typescript
import { Model } from '@flush/core';

export class User extends Model {
  static tableName = 'users';
  
  id?: number;
  name?: string;
  email?: string;
  
  static async findByEmail(email: string): Promise<User | null> {
    return this.where('email', email);
  }
}
```

### Middleware

```typescript
import type { MiddlewareFunction } from '@flush/core';

export const authMiddleware: MiddlewareFunction = (req, res, next) => {
  const token = req.header('authorization');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verify token logic here
  req.user = { id: 1, name: 'User' };
  next();
};
```

### Routes

```typescript
import { FlushApp } from '@flush/core';
import { UserController } from './controllers/UserController';

const app = new FlushApp();

// Basic routes
app.get('/', HomeController.index);
app.post('/users', UserController.store);

// Route groups
app.group('/api/v1', (router) => {
  router.get('/users', UserController.index);
  router.get('/users/:id', UserController.show);
});

// Middleware on routes
app.get('/protected', [authMiddleware], ProtectedController.index);
```

### Validation

```typescript
import { Validator } from '@flush/core';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18)
});

export class UserController extends Controller {
  async store(req: FlushRequest, res: FlushResponse) {
    const validation = Validator.validate(req.body, userSchema);
    
    if (!validation.success) {
      return res.status(400).json({
        errors: validation.errors
      });
    }
    
    const user = await User.create(validation.data);
    return res.json(this.success(user));
  }
}
```

## Built-in Middleware

```typescript
import { FlushApp, Middleware } from '@flush/core';

const app = new FlushApp();

// CORS
app.use(Middleware.cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

// Request logging
app.use(Middleware.logger());

// Rate limiting
app.use(Middleware.rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Authentication
app.use(Middleware.auth());
```

## Performance

Flush is built on Bun, which provides:
- **3x faster** startup than Node.js
- **Built-in bundler** and transpiler
- **Native TypeScript** support
- **Optimized HTTP server**

## Comparison with Other Frameworks

| Feature | Flush | Express | Fastify | Hono |
|---------|-------|---------|---------|------|
| Runtime | Bun | Node.js | Node.js | Any |
| TypeScript | ✅ Native | ➕ Plugin | ➕ Plugin | ✅ Native |
| CLI Tools | ✅ Rich | ❌ Basic | ❌ Basic | ❌ None |
| MVC Pattern | ✅ Built-in | ➕ Manual | ➕ Manual | ➕ Manual |
| Performance | ⚡ Excellent | 🔥 Good | ⚡ Excellent | ⚡ Excellent |

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Database ORM integration (Prisma/Drizzle)
- [ ] WebSocket support
- [ ] File upload handling
- [ ] Caching system
- [ ] Queue system
- [ ] Testing utilities
- [ ] Production deployment guides
- [ ] Plugin system

---

**Made with ❤️ for the Bun ecosystem**