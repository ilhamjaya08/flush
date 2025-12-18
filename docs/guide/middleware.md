# Middleware

Middleware functions execute during the request-response cycle. They can modify requests, responses, or terminate the request cycle.

## Built-in Middleware

Flush provides several built-in middleware:

```typescript
import { FlushApp, Middleware } from 'flush-core';

const app = new FlushApp();

// CORS middleware
app.use(Middleware.cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

// Request logging
app.use(Middleware.logger());

// JSON body parser
app.use(Middleware.json());

// Rate limiting
app.use(Middleware.rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Authentication
app.use(Middleware.auth());
```

## Custom Middleware

Create custom middleware functions:

```typescript
import type { MiddlewareFunction } from 'flush-core';

export const customMiddleware: MiddlewareFunction = (req, res, next) => {
  console.log('Custom middleware executed');
  next();
};
```

## Generating Middleware

Use the CLI to generate middleware:

```bash
flush make middleware AuthMiddleware
```

This creates:

```typescript
import type { FlushRequest, FlushResponse, MiddlewareFunction } from 'flush-core';

export class AuthMiddleware {
  static handle(): MiddlewareFunction {
    return async (req: FlushRequest, res: FlushResponse, next: () => void) => {
      // Your middleware logic here
      console.log('AuthMiddleware executed');
      
      // Call next() to continue to the next middleware or route handler
      next();
    };
  }
}

export default AuthMiddleware.handle();
```

## Route-Specific Middleware

Apply middleware to specific routes:

```typescript
import { authMiddleware } from '../middleware/AuthMiddleware';

export function routes(app: FlushApp) {
  // Public routes
  app.get('/', HomeController.index);
  
  // Protected routes
  app.group('/api', (router) => {
    router.use(authMiddleware);
    router.get('/profile', UserController.profile);
  });
}
```