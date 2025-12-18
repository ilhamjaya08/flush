import { Controller, Validator } from 'flush-core';
import type { FlushRequest, FlushResponse } from 'flush-core';
import { z } from 'zod';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() }
];

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format')
});

export class UserController extends Controller {
  static async index(req: FlushRequest, res: FlushResponse) {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    
    const controller = new UserController();
    const paginatedUsers = controller.paginate(users, page, limit);
    
    res.json(controller.success(paginatedUsers));
  }

  static async show(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));
    
    const controller = new UserController();
    
    if (!user) {
      res.status(404).json(controller.error('User not found', 404));
      return;
    }
    
    res.json(controller.success(user));
  }

  static async store(req: FlushRequest, res: FlushResponse) {
    const controller = new UserController();
    
    const validation = Validator.validate(req.body, userSchema);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
      return;
    }
    
    const newUser = {
      id: users.length + 1,
      ...validation.data,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json(controller.success(newUser, 'User created successfully'));
  }

  static async update(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    const controller = new UserController();
    
    if (userIndex === -1) {
      res.status(404).json(controller.error('User not found', 404));
      return;
    }
    
    const validation = Validator.validate(req.body, userSchema.partial());
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
      return;
    }
    
    users[userIndex] = { ...users[userIndex], ...validation.data };
    
    res.json(controller.success(users[userIndex], 'User updated successfully'));
  }

  static async destroy(req: FlushRequest, res: FlushResponse) {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    const controller = new UserController();
    
    if (userIndex === -1) {
      res.status(404).json(controller.error('User not found', 404));
      return;
    }
    
    users.splice(userIndex, 1);
    
    res.json(controller.success(null, 'User deleted successfully'));
  }
}