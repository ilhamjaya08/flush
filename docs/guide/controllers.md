# Controllers

Controllers handle incoming HTTP requests and return responses. They act as the bridge between your routes and business logic.

## Basic Controllers

Create a controller by extending the base `Controller` class:

```typescript
import { Controller } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';

export class UserController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    const users = await User.all();
    res.json(this.success(users));
  }
}
```

## Generating Controllers

Use the CLI to generate controllers:

```bash
# Basic controller
flush make controller UserController

# Resource controller (with CRUD methods)
flush make controller UserController --resource
```

## Controller Methods

### Static Methods

Controllers use static methods for route handlers:

```typescript
export class PostController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    // Handle GET /posts
  }
  
  static async show(req: FlushRequest, res: FlushResponse) {
    // Handle GET /posts/:id
  }
  
  static async store(req: FlushRequest, res: FlushResponse) {
    // Handle POST /posts
  }
}
```

### Instance Methods

Use instance methods for shared logic:

```typescript
export class UserController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    const controller = new UserController();
    const users = await User.all();
    res.json(controller.success(users));
  }
  
  private validateUser(data: any) {
    // Shared validation logic
  }
}
```

## Request Handling

### Accessing Request Data

```typescript
export class UserController extends Controller {
  static async store(req: FlushRequest, res: FlushResponse) {
    // Route parameters
    const { id } = req.params;
    
    // Query parameters
    const { page, limit } = req.query;
    
    // Request body
    const { name, email } = req.body;
    
    // Headers
    const userAgent = req.header('user-agent');
    
    // All input data
    const allData = req.all();
    
    // Specific fields only
    const userData = req.only(['name', 'email']);
    
    // Exclude fields
    const safeData = req.except(['password']);
  }
}
```

## Response Methods

### JSON Responses

```typescript
export class ApiController extends Controller {
  static async getData(req: FlushRequest, res: FlushResponse) {
    const data = { message: 'Hello World' };
    res.json(data);
  }
  
  static async getUsers(req: FlushRequest, res: FlushResponse) {
    const users = await User.all();
    res.status(200).json(users);
  }
}
```

### Response Helpers

The base controller provides helper methods:

```typescript
export class UserController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    const controller = new UserController();
    const users = await User.all();
    
    // Success response
    res.json(controller.success(users));
    
    // Success with custom message
    res.json(controller.success(users, 'Users retrieved successfully'));
  }
  
  static async show(req: FlushRequest, res: FlushResponse) {
    const controller = new UserController();
    const { id } = req.params;
    const user = await User.find(id);
    
    if (!user) {
      return res.status(404).json(controller.error('User not found', 404));
    }
    
    res.json(controller.success(user));
  }
}
```

## Validation

### Request Validation

```typescript
import { Validator } from 'flush-core';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old')
});

export class UserController extends Controller {
  static async store(req: FlushRequest, res: FlushResponse) {
    const controller = new UserController();
    
    // Validate request data
    const validation = Validator.validate(req.body, userSchema);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    // Use validated data
    const user = await User.create(validation.data);
    res.status(201).json(controller.success(user, 'User created successfully'));
  }
}
```

## Error Handling

### Try-Catch Blocks

```typescript
export class UserController extends Controller {
  static async show(req: FlushRequest, res: FlushResponse) {
    try {
      const controller = new UserController();
      const { id } = req.params;
      const user = await User.find(parseInt(id));
      
      if (!user) {
        return res.status(404).json(controller.error('User not found'));
      }
      
      res.json(controller.success(user));
    } catch (error) {
      console.error('Error fetching user:', error);
      const controller = new UserController();
      res.status(500).json(controller.error('Internal server error'));
    }
  }
}
```

## Resource Controllers

Resource controllers provide all CRUD operations:

```typescript
export class PostController extends Controller {
  // GET /posts
  static async index(req: FlushRequest, res: FlushResponse) {
    const controller = new PostController();
    const posts = await Post.all();
    res.json(controller.success(posts));
  }
  
  // GET /posts/:id
  static async show(req: FlushRequest, res: FlushResponse) {
    const controller = new PostController();
    const { id } = req.params;
    const post = await Post.find(parseInt(id));
    
    if (!post) {
      return res.status(404).json(controller.error('Post not found'));
    }
    
    res.json(controller.success(post));
  }
  
  // POST /posts
  static async store(req: FlushRequest, res: FlushResponse) {
    const controller = new PostController();
    const post = await Post.create(req.body);
    res.status(201).json(controller.success(post, 'Post created successfully'));
  }
  
  // PUT /posts/:id
  static async update(req: FlushRequest, res: FlushResponse) {
    const controller = new PostController();
    const { id } = req.params;
    const post = await Post.find(parseInt(id));
    
    if (!post) {
      return res.status(404).json(controller.error('Post not found'));
    }
    
    await post.update(req.body);
    res.json(controller.success(post, 'Post updated successfully'));
  }
  
  // DELETE /posts/:id
  static async destroy(req: FlushRequest, res: FlushResponse) {
    const controller = new PostController();
    const { id } = req.params;
    const post = await Post.find(parseInt(id));
    
    if (!post) {
      return res.status(404).json(controller.error('Post not found'));
    }
    
    await post.delete();
    res.json(controller.success(null, 'Post deleted successfully'));
  }
}
```

## Pagination

```typescript
export class PostController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    const controller = new PostController();
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    
    const posts = await Post.all();
    const paginatedPosts = controller.paginate(posts, page, limit);
    
    res.json(controller.success(paginatedPosts));
  }
}
```

## Best Practices

### 1. Keep Controllers Thin

Move business logic to services:

```typescript
// Good: Thin controller
export class UserController extends Controller {
  static async store(req: FlushRequest, res: FlushResponse) {
    const controller = new UserController();
    
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(controller.success(user));
    } catch (error) {
      res.status(400).json(controller.error(error.message));
    }
  }
}

// UserService handles business logic
export class UserService {
  static async createUser(userData: any) {
    // Validation, business rules, database operations
  }
}
```

### 2. Consistent Response Format

```typescript
// Always use controller helpers for consistent responses
res.json(controller.success(data, message));
res.json(controller.error(message, code));
```

### 3. Proper HTTP Status Codes

```typescript
// 200 - OK (successful GET, PUT)
res.status(200).json(controller.success(data));

// 201 - Created (successful POST)
res.status(201).json(controller.success(data, 'Created'));

// 400 - Bad Request (validation errors)
res.status(400).json(controller.error('Validation failed'));

// 404 - Not Found
res.status(404).json(controller.error('Resource not found'));

// 500 - Internal Server Error
res.status(500).json(controller.error('Internal server error'));
```

### 4. Input Validation

Always validate input data:

```typescript
static async store(req: FlushRequest, res: FlushResponse) {
  const validation = Validator.validate(req.body, schema);
  
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      errors: validation.errors
    });
  }
  
  // Use validation.data (type-safe)
}
```