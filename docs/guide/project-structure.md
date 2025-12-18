# Project Structure

Understanding the Flush project structure helps you organize your code effectively and follow best practices.

## Default Structure

When you create a new Flush project, you get this structure:

```
my-flush-app/
├── src/                    # Application source code
│   ├── controllers/        # Request handlers
│   ├── models/            # Data models
│   ├── middleware/        # Custom middleware
│   ├── routes/            # Route definitions
│   ├── views/             # View templates (optional)
│   └── index.ts           # Application entry point
├── database/              # Database related files
│   ├── migrations/        # Database migrations
│   └── seeds/             # Database seeders
├── public/                # Static assets
├── tests/                 # Test files
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```

## Core Directories

### `src/` Directory

The main application code lives here:

#### `src/controllers/`
Contains controller classes that handle HTTP requests:

```typescript
// src/controllers/UserController.ts
export class UserController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    // Handle GET /users
  }
}
```

#### `src/models/`
Data models and business logic:

```typescript
// src/models/User.ts
export class User extends Model {
  static tableName = 'users';
  
  static async findByEmail(email: string) {
    // Custom model methods
  }
}
```

#### `src/middleware/`
Custom middleware functions:

```typescript
// src/middleware/AuthMiddleware.ts
export const authMiddleware: MiddlewareFunction = (req, res, next) => {
  // Authentication logic
  next();
};
```

#### `src/routes/`
Route definitions and organization:

```typescript
// src/routes/index.ts
export function routes(app: FlushApp) {
  app.get('/', HomeController.index);
}
```

#### `src/index.ts`
Application entry point:

```typescript
import { FlushApp } from 'flush-core';
import { routes } from './routes';

const app = new FlushApp();
routes(app);
app.listen();
```

### `database/` Directory

Database-related files:

#### `database/migrations/`
Database schema changes:

```typescript
// database/migrations/001_create_users_table.ts
export class CreateUsersTable extends Migration {
  async up() {
    await this.createTable('users', (table) => {
      table.id();
      table.string('name');
      table.string('email');
      table.timestamps();
    });
  }
}
```

#### `database/seeds/`
Sample data for development:

```typescript
// database/seeds/UserSeeder.ts
export class UserSeeder {
  async run() {
    await User.create({
      name: 'John Doe',
      email: 'john@example.com'
    });
  }
}
```

### `public/` Directory

Static assets served directly:

```
public/
├── images/
├── css/
├── js/
└── favicon.ico
```

### `tests/` Directory

Test files organized by type:

```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── helpers/          # Test utilities
```

## Configuration Files

### `package.json`

Project metadata and dependencies:

```json
{
  "name": "my-flush-app",
  "scripts": {
    "dev": "flush serve",
    "build": "bun build src/index.ts --outdir dist",
    "start": "bun run dist/index.js",
    "test": "bun test"
  },
  "dependencies": {
    "flush-core": "^0.1.0",
    "flush-cli": "^0.1.0"
  }
}
```

### `tsconfig.json`

TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Organizing Large Applications

### Feature-Based Structure

For larger applications, organize by features:

```
src/
├── features/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── routes/
│   ├── users/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── posts/
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── types/
└── index.ts
```

### Modular Routes

Split routes by feature:

```typescript
// src/routes/index.ts
import { authRoutes } from '../features/auth/routes';
import { userRoutes } from '../features/users/routes';
import { postRoutes } from '../features/posts/routes';

export function routes(app: FlushApp) {
  authRoutes(app);
  userRoutes(app);
  postRoutes(app);
}
```

## Environment Configuration

### Environment Files

```
.env                 # Default environment
.env.local          # Local overrides (gitignored)
.env.development    # Development environment
.env.production     # Production environment
.env.test          # Test environment
```

### Configuration Module

```typescript
// src/config/index.ts
export const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  database: {
    url: process.env.DATABASE_URL || 'sqlite:./dev.db'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key'
  }
};
```

## Best Practices

### 1. Consistent Naming

```typescript
// Controllers: PascalCase with "Controller" suffix
UserController.ts
PostController.ts

// Models: PascalCase, singular
User.ts
Post.ts

// Middleware: camelCase with "Middleware" suffix
authMiddleware.ts
corsMiddleware.ts
```

### 2. Barrel Exports

Use index files to simplify imports:

```typescript
// src/controllers/index.ts
export { UserController } from './UserController';
export { PostController } from './PostController';

// Usage
import { UserController, PostController } from '../controllers';
```

### 3. Path Aliases

Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@controllers/*": ["./src/controllers/*"],
      "@models/*": ["./src/models/*"],
      "@middleware/*": ["./src/middleware/*"]
    }
  }
}
```

Usage:

```typescript
import { UserController } from '@controllers/UserController';
import { User } from '@models/User';
import { authMiddleware } from '@middleware/AuthMiddleware';
```

### 4. Separate Concerns

Keep different concerns in separate files:

```typescript
// Good: Separate files
src/
├── controllers/UserController.ts    # HTTP handling
├── services/UserService.ts         # Business logic
├── models/User.ts                   # Data access
└── validators/UserValidator.ts      # Validation rules

// Avoid: Everything in one file
src/controllers/UserController.ts    # HTTP + business + data + validation
```

### 5. Configuration Management

Centralize configuration:

```typescript
// src/config/database.ts
export const databaseConfig = {
  url: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  }
};

// src/config/app.ts
export const appConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};
```

## CLI Generators

Use Flush CLI to maintain consistent structure:

```bash
# Generate with proper structure
flush make controller UserController --resource
flush make model User --migration
flush make middleware AuthMiddleware

# Creates files in correct locations with proper naming
```