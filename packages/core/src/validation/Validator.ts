import { z, ZodSchema, ZodError } from 'zod';

export class Validator {
  static validate<T>(data: any, schema: ZodSchema<T>): { success: true; data: T } | { success: false; errors: any } {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          errors: error.errors.reduce((acc, err) => {
            const path = err.path.join('.');
            acc[path] = err.message;
            return acc;
          }, {} as any)
        };
      }
      throw error;
    }
  }
  

  static email() {
    return z.string().email();
  }
  
  static password(minLength = 8) {
    return z.string().min(minLength);
  }
  
  static required() {
    return z.string().min(1, 'This field is required');
  }
  
  static optional() {
    return z.string().optional();
  }
  
  static number() {
    return z.number();
  }
  
  static boolean() {
    return z.boolean();
  }
  
  static array<T>(schema: ZodSchema<T>) {
    return z.array(schema);
  }
  
  static object<T extends Record<string, any>>(shape: { [K in keyof T]: ZodSchema<T[K]> }) {
    return z.object(shape);
  }
}