# Models

Models represent your application's data and business logic. They provide an abstraction layer for database operations.

## Basic Models

Create a model by extending the base `Model` class:

```typescript
import { Model } from 'flush-core';

export class User extends Model {
  static tableName = 'users';
  
  id?: number;
  name?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Generating Models

Use the CLI to generate models:

```bash
# Basic model
flush make model User

# Model with migration
flush make model User --migration
```

## Database Operations

### Finding Records

```typescript
// Find all records
const users = await User.all();

// Find by ID
const user = await User.find(1);

// Find by condition
const users = await User.where('email', 'john@example.com');
```

### Creating Records

```typescript
// Create new record
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Updating Records

```typescript
// Update existing record
const user = await User.find(1);
await user.update({
  name: 'Jane Doe'
});
```

### Deleting Records

```typescript
// Delete record
const user = await User.find(1);
await user.delete();
```

## Custom Methods

Add custom methods to your models:

```typescript
export class User extends Model {
  static tableName = 'users';
  
  static async findByEmail(email: string): Promise<User | null> {
    return this.where('email', email);
  }
  
  static async getActiveUsers(): Promise<User[]> {
    return this.where('active', true);
  }
  
  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
```