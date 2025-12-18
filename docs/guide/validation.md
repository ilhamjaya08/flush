# Validation

Flush uses Zod for powerful, type-safe request validation with comprehensive error handling.

## Basic Validation

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
    const validation = Validator.validate(req.body, userSchema);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    // Use validated data (type-safe)
    const user = await User.create(validation.data);
    res.status(201).json({ user });
  }
}
```

## Validation Schemas

### Common Validators

```typescript
// String validation
const nameSchema = z.string().min(1).max(100);
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

// Number validation
const ageSchema = z.number().min(0).max(120);
const priceSchema = z.number().positive();

// Boolean validation
const activeSchema = z.boolean();

// Array validation
const tagsSchema = z.array(z.string());

// Object validation
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string()
});
```

### Complex Schemas

```typescript
const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  age: z.number().min(18, 'Must be at least 18 years old'),
  terms: z.boolean().refine(val => val === true, 'Must accept terms')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
```

## Validator Helpers

Flush provides common validation helpers:

```typescript
// Email validation
Validator.email()

// Password validation (min 8 characters)
Validator.password()

// Required string
Validator.required()

// Optional string
Validator.optional()

// Number validation
Validator.number()

// Boolean validation
Validator.boolean()

// Array validation
Validator.array(z.string())

// Object validation
Validator.object({
  name: z.string(),
  email: z.string().email()
})
```

## Error Handling

Validation errors are automatically formatted:

```typescript
const validation = Validator.validate(data, schema);

if (!validation.success) {
  // validation.errors contains field-specific errors
  console.log(validation.errors);
  // Output: { "email": "Invalid email format", "age": "Must be at least 18" }
}
```

## Custom Validation

Create custom validation rules:

```typescript
const customSchema = z.object({
  username: z.string().refine(
    val => !val.includes(' '),
    'Username cannot contain spaces'
  ),
  email: z.string().refine(
    async val => {
      const exists = await User.findByEmail(val);
      return !exists;
    },
    'Email already exists'
  )
});
```