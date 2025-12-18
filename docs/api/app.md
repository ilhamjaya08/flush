# FlushApp

The `FlushApp` class is the core of your Flush application. It handles routing, middleware, and server configuration.

## Constructor

```typescript
import { FlushApp } from 'flush-core';

const app = new FlushApp(config?: FlushConfig);
```

### Parameters

- `config` (optional): Configuration object for the application

```typescript
interface FlushConfig {
  port?: number;           // Default: 3000
  host?: string;           // Default: 'localhost'
  cors?: {
    origin?: string | string[];
    credentials?: boolean;
  };
  middleware?: string[];
  views?: {
    engine: 'jsx' | 'html';
    directory: string;
  };
}
```

## Methods

### Route Methods

#### `get(path, handler)`

Register a GET route.

```typescript
app.get('/users', (req, res) => {
  res.json({ users: [] });
});
```

#### `post(path, handler)`

Register a POST route.

```typescript
app.post('/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ user });
});
```

#### `put(path, handler)`

Register a PUT route.

```typescript
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  res.json({ id, ...updates });
});
```

#### `patch(path, handler)`

Register a PATCH route.

```typescript
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  res.json({ id, ...updates });
});
```

#### `delete(path, handler)`

Register a DELETE route.

```typescript
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `User ${id} deleted` });
});
```

### Middleware

#### `use(middleware)`

Register global middleware.

```typescript
import { Middleware } from 'flush-core';

app.use(Middleware.logger());
app.use(Middleware.cors());
app.use(Middleware.json());
```

### Route Groups

#### `group(prefix, callback)`

Create a group of routes with a common prefix.

```typescript
app.group('/api', (router) => {
  router.get('/users', UserController.index);
  router.post('/users', UserController.store);
  
  router.group('/v1', (v1Router) => {
    v1Router.get('/posts', PostController.index);
  });
});
```

### Server Control

#### `listen(port?)`

Start the HTTP server.

```typescript
// Use default port from config
await app.listen();

// Use custom port
await app.listen(8000);
```

**Returns:** `Promise<void>`

#### `close()`

Stop the HTTP server gracefully.

```typescript
await app.close();
```

**Returns:** `Promise<void>`

## Examples

### Basic Application

```typescript
import { FlushApp, Middleware } from 'flush-core';

const app = new FlushApp({
  port: 3000,
  host: 'localhost'
});

// Global middleware
app.use(Middleware.logger());
app.use(Middleware.cors());
app.use(Middleware.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Flush!' });
});

app.group('/api', (router) => {
  router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
});

// Start server
app.listen().then(() => {
  console.log('Server running on http://localhost:3000');
});
```

### With Configuration

```typescript
const app = new FlushApp({
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  cors: {
    origin: ['http://localhost:3000', 'https://myapp.com'],
    credentials: true
  }
});
```

### Error Handling

```typescript
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Graceful Shutdown

```typescript
const app = new FlushApp();

// Handle shutdown signals
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await app.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down...');
  await app.close();
  process.exit(0);
});

app.listen();
```