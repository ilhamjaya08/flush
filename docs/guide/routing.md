# Routing

Flush provides a powerful and intuitive routing system that makes it easy to define clean, RESTful routes for your application.

## Basic Routing

Routes are defined in the `src/routes/index.ts` file:

```typescript
import type { FlushApp } from 'flush-core';

export function routes(app: FlushApp) {
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });
  
  app.post('/users', (req, res) => {
    res.json({ message: 'User created' });
  });
}
```

## HTTP Methods

Flush supports all standard HTTP methods:

```typescript
app.get('/users', handler);       // GET
app.post('/users', handler);      // POST
app.put('/users/:id', handler);   // PUT
app.patch('/users/:id', handler); // PATCH
app.delete('/users/:id', handler);// DELETE
```

## Route Parameters

### Required Parameters

Capture dynamic segments in your URLs:

```typescript
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});

app.get('/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  res.json({ postId, commentId });
});
```

### Query Parameters

Access query string parameters:

```typescript
app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({ query: q, page: page || 1, limit: limit || 10 });
});
```

## Route Groups

Organize related routes with common prefixes:

```typescript
export function routes(app: FlushApp) {
  // API routes
  app.group('/api', (router) => {
    router.get('/health', healthCheck);
    
    // Versioned API
    router.group('/v1', (v1) => {
      v1.get('/users', UserController.index);
      v1.post('/users', UserController.store);
    });
  });
  
  // Admin routes
  app.group('/admin', (router) => {
    router.get('/dashboard', AdminController.dashboard);
    router.get('/users', AdminController.users);
  });
}
```

## Controller Routes

Link routes to controller methods:

```typescript
import { UserController } from '../controllers/UserController';

export function routes(app: FlushApp) {
  // Individual routes
  app.get('/users', UserController.index);
  app.get('/users/:id', UserController.show);
  app.post('/users', UserController.store);
  app.put('/users/:id', UserController.update);
  app.delete('/users/:id', UserController.destroy);
}
```

## Resource Routes

For RESTful resources, you can define all CRUD routes at once:

```typescript
// This creates all RESTful routes for users
app.group('/users', (router) => {
  router.get('/', UserController.index);        // GET /users
  router.get('/:id', UserController.show);      // GET /users/:id
  router.post('/', UserController.store);       // POST /users
  router.put('/:id', UserController.update);    // PUT /users/:id
  router.delete('/:id', UserController.destroy);// DELETE /users/:id
});
```

## Middleware on Routes

Apply middleware to specific routes:

```typescript
import { authMiddleware, adminMiddleware } from '../middleware';

export function routes(app: FlushApp) {
  // Public routes
  app.get('/', HomeController.index);
  app.post('/login', AuthController.login);
  
  // Protected routes
  app.group('/api', (router) => {
    // Apply auth middleware to all API routes
    router.use(authMiddleware);
    
    router.get('/profile', UserController.profile);
    router.put('/profile', UserController.updateProfile);
    
    // Admin only routes
    router.group('/admin', (adminRouter) => {
      adminRouter.use(adminMiddleware);
      adminRouter.get('/users', AdminController.users);
    });
  });
}
```

## Route Patterns

### Wildcard Routes

```typescript
// Catch-all route
app.get('/files/*', (req, res) => {
  const filePath = req.params['*'];
  res.json({ path: filePath });
});
```

### Optional Parameters

```typescript
// Optional parameter with default
app.get('/posts/:slug?', (req, res) => {
  const slug = req.params.slug || 'latest';
  res.json({ slug });
});
```

## Request Handling

### Accessing Request Data

```typescript
app.post('/users', (req, res) => {
  // Route parameters
  const { id } = req.params;
  
  // Query parameters
  const { page, limit } = req.query;
  
  // Request body
  const { name, email } = req.body;
  
  // Headers
  const userAgent = req.header('user-agent');
  
  // Helper methods
  const allData = req.all();           // All input data
  const onlyName = req.only(['name']); // Specific fields
  const exceptId = req.except(['id']); // Exclude fields
});
```

## Response Methods

### JSON Responses

```typescript
app.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'John' }];
  res.json(users);
});
```

### Status Codes

```typescript
app.post('/users', (req, res) => {
  // Success with custom status
  res.status(201).json({ message: 'Created' });
});

app.get('/users/:id', (req, res) => {
  const user = findUser(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});
```

### Redirects

```typescript
app.post('/login', (req, res) => {
  // Authenticate user...
  res.redirect('/dashboard');
});
```

## Error Handling

### Route-Level Error Handling

```typescript
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.find(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Global Error Handling

```typescript
// In your main app file
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
```

## Route Caching

For better performance, routes are compiled and cached:

```typescript
// Routes are automatically optimized
app.get('/users/:id/posts/:postId', handler);
// Compiles to efficient regex: /^\/users\/([^/]+)\/posts\/([^/]+)$/
```

## Testing Routes

Test your routes using Bun's built-in testing:

```typescript
import { test, expect } from 'bun:test';
import { FlushApp } from 'flush-core';

test('GET /users returns users list', async () => {
  const app = new FlushApp();
  
  app.get('/users', (req, res) => {
    res.json([{ id: 1, name: 'John' }]);
  });
  
  const response = await fetch('http://localhost:3000/users');
  const data = await response.json();
  
  expect(data).toEqual([{ id: 1, name: 'John' }]);
});
```

## Best Practices

### 1. Organize Routes by Feature

```typescript
// routes/api.ts
export function apiRoutes(app: FlushApp) {
  app.group('/api', (router) => {
    userRoutes(router);
    postRoutes(router);
  });
}

// routes/users.ts
export function userRoutes(router: Router) {
  router.get('/users', UserController.index);
  router.post('/users', UserController.store);
}
```

### 2. Use Descriptive Route Names

```typescript
// Good
app.get('/users/:id/posts', UserPostController.index);
app.post('/users/:id/posts', UserPostController.store);

// Avoid
app.get('/u/:i/p', handler);
```

### 3. Validate Parameters

```typescript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  // Continue with valid ID
});
```

### 4. Use Middleware for Common Logic

```typescript
// Apply logging to all routes
app.use(Middleware.logger());

// Apply auth to protected routes
app.group('/api', (router) => {
  router.use(Middleware.auth());
  // All routes here require authentication
});
```