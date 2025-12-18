import type { FlushRequest, FlushResponse, MiddlewareFunction } from '../types';

export class Middleware {
  static cors(options: { origin?: string | string[]; credentials?: boolean } = {}): MiddlewareFunction {
    return (req: FlushRequest, res: FlushResponse, next: () => void) => {
      const origin = options.origin || '*';
      
      res.header('Access-Control-Allow-Origin', Array.isArray(origin) ? origin.join(',') : origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (options.credentials) {
        res.header('Access-Control-Allow-Credentials', 'true');
      }
      
      if (req.method === 'OPTIONS') {
        res.status(200).send('');
        return;
      }
      
      next();
    };
  }


  static json(): MiddlewareFunction {
    return (req: FlushRequest, res: FlushResponse, next: () => void) => {
      next();
    };
  }


  static logger(): MiddlewareFunction {
    return (req: FlushRequest, res: FlushResponse, next: () => void) => {
      const start = Date.now();
      
      console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
      
      next();
      
      const duration = Date.now() - start;
      console.log(`Completed in ${duration}ms`);
    };
  }


  static rateLimit(options: { windowMs?: number; max?: number } = {}): MiddlewareFunction {
    const windowMs = options.windowMs || 15 * 60 * 1000;
    const max = options.max || 100;
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (req: FlushRequest, res: FlushResponse, next: () => void) => {
      const ip = req.header('x-forwarded-for') || req.header('x-real-ip') || 'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;

      let requestInfo = requests.get(ip);
      
      if (!requestInfo || requestInfo.resetTime < windowStart) {
        requestInfo = { count: 0, resetTime: now + windowMs };
        requests.set(ip, requestInfo);
      }

      requestInfo.count++;

      if (requestInfo.count > max) {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((requestInfo.resetTime - now) / 1000)
        });
        return;
      }

      next();
    };
  }


  static auth(): MiddlewareFunction {
    return (req: FlushRequest, res: FlushResponse, next: () => void) => {
      const token = req.header('authorization')?.replace('Bearer ', '');
      
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }


      req.user = { id: 1, name: 'Test User' };
      
      next();
    };
  }
}