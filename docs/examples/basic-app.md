# Basic Application

This example shows how to create a simple Flush application with basic CRUD operations.

## Project Setup

Create a new Flush project:

```bash
bunx create-flush todo-app
cd todo-app
bun install
```

## Application Structure

```
todo-app/
├── src/
│   ├── controllers/
│   │   ├── HomeController.ts
│   │   └── TodoController.ts
│   ├── models/
│   │   └── Todo.ts
│   ├── routes/
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Main Application

```typescript
// src/index.ts
import { FlushApp, Middleware } from 'flush-core';
import { routes } from './routes';

const app = new FlushApp({
  port: 3000,
  host: 'localhost'
});

// Register middleware
app.use(Middleware.logger());
app.use(Middleware.cors());
app.use(Middleware.json());

// Register routes
routes(app);

// Start server
app.listen().then(() => {
  console.log('🚀 Todo app running on http://localhost:3000');
});
```

## Models

```typescript
// src/models/Todo.ts
import { Model } from 'flush-core';

export interface TodoData {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Todo extends Model {
  static tableName = 'todos';
  
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: TodoData) {
    super();
    Object.assign(this, data);
  }

  static async all(): Promise<Todo[]> {
    // In a real app, this would query the database
    return mockTodos.map(todo => new Todo(todo));
  }

  static async find(id: number): Promise<Todo | null> {
    const todoData = mockTodos.find(t => t.id === id);
    return todoData ? new Todo(todoData) : null;
  }

  static async create(data: Omit<TodoData, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const newTodo: TodoData = {
      id: mockTodos.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockTodos.push(newTodo);
    return new Todo(newTodo);
  }

  async update(data: Partial<TodoData>): Promise<Todo> {
    const index = mockTodos.findIndex(t => t.id === this.id);
    if (index !== -1) {
      mockTodos[index] = { ...mockTodos[index], ...data, updatedAt: new Date() };
      Object.assign(this, mockTodos[index]);
    }
    return this;
  }

  async delete(): Promise<boolean> {
    const index = mockTodos.findIndex(t => t.id === this.id);
    if (index !== -1) {
      mockTodos.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Mock data (replace with real database)
const mockTodos: TodoData[] = [
  {
    id: 1,
    title: 'Learn Flush Framework',
    description: 'Go through the documentation and build a sample app',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Build Todo API',
    description: 'Create a RESTful API for managing todos',
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
```

## Controllers

```typescript
// src/controllers/HomeController.ts
import { Controller } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';

export class HomeController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    res.json({
      message: 'Welcome to Todo API',
      version: '1.0.0',
      endpoints: {
        todos: '/api/todos',
        health: '/api/health'
      }
    });
  }
}
```

```typescript
// src/controllers/TodoController.ts
import { Controller, Validator } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';
import { z } from 'zod';
import { Todo } from '../models/Todo';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().default(false)
});

export class TodoController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    try {
      const todos = await Todo.all();
      const controller = new TodoController();
      
      res.json(controller.success(todos));
    } catch (error) {
      const controller = new TodoController();
      res.status(500).json(controller.error('Failed to fetch todos'));
    }
  }

  static async show(req: FlushRequest, res: FlushResponse) {
    try {
      const { id } = req.params;
      const todo = await Todo.find(parseInt(id));
      const controller = new TodoController();

      if (!todo) {
        return res.status(404).json(controller.error('Todo not found'));
      }

      res.json(controller.success(todo));
    } catch (error) {
      const controller = new TodoController();
      res.status(500).json(controller.error('Failed to fetch todo'));
    }
  }

  static async store(req: FlushRequest, res: FlushResponse) {
    try {
      const controller = new TodoController();
      const validation = Validator.validate(req.body, todoSchema);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const todo = await Todo.create(validation.data);
      res.status(201).json(controller.success(todo, 'Todo created successfully'));
    } catch (error) {
      const controller = new TodoController();
      res.status(500).json(controller.error('Failed to create todo'));
    }
  }

  static async update(req: FlushRequest, res: FlushResponse) {
    try {
      const { id } = req.params;
      const todo = await Todo.find(parseInt(id));
      const controller = new TodoController();

      if (!todo) {
        return res.status(404).json(controller.error('Todo not found'));
      }

      const validation = Validator.validate(req.body, todoSchema.partial());

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      await todo.update(validation.data);
      res.json(controller.success(todo, 'Todo updated successfully'));
    } catch (error) {
      const controller = new TodoController();
      res.status(500).json(controller.error('Failed to update todo'));
    }
  }

  static async destroy(req: FlushRequest, res: FlushResponse) {
    try {
      const { id } = req.params;
      const todo = await Todo.find(parseInt(id));
      const controller = new TodoController();

      if (!todo) {
        return res.status(404).json(controller.error('Todo not found'));
      }

      await todo.delete();
      res.json(controller.success(null, 'Todo deleted successfully'));
    } catch (error) {
      const controller = new TodoController();
      res.status(500).json(controller.error('Failed to delete todo'));
    }
  }
}
```

## Routes

```typescript
// src/routes/index.ts
import type { FlushApp } from 'flush-core';
import { HomeController } from '../controllers/HomeController';
import { TodoController } from '../controllers/TodoController';

export function routes(app: FlushApp) {
  // Home route
  app.get('/', HomeController.index);

  // API routes
  app.group('/api', (router) => {
    // Health check
    router.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Todo routes
    router.get('/todos', TodoController.index);
    router.get('/todos/:id', TodoController.show);
    router.post('/todos', TodoController.store);
    router.put('/todos/:id', TodoController.update);
    router.delete('/todos/:id', TodoController.destroy);
  });
}
```

## Running the Application

Start the development server:

```bash
bun run dev
```

## Testing the API

### Get all todos

```bash
curl http://localhost:3000/api/todos
```

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "title": "Learn Flush Framework",
      "description": "Go through the documentation and build a sample app",
      "completed": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create a new todo

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false
  }'
```

### Update a todo

```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Delete a todo

```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## Next Steps

This basic example demonstrates:

- ✅ MVC architecture
- ✅ RESTful API design
- ✅ Request validation
- ✅ Error handling
- ✅ Response formatting

To extend this application:

1. **Add Database**: Replace mock data with real database using Prisma
2. **Add Authentication**: Implement user login and JWT tokens
3. **Add Middleware**: Create custom middleware for logging and validation
4. **Add Tests**: Write unit and integration tests
5. **Add Pagination**: Implement pagination for large datasets