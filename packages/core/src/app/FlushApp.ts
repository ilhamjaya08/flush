import { Router } from '../routing/Router';
import { Request } from '../http/Request';
import { Response } from '../http/Response';
import type { FlushConfig, MiddlewareFunction } from '../types';

export class FlushApp {
  private router: Router;
  private middlewares: MiddlewareFunction[] = [];
  private config: FlushConfig;
  private server?: any;

  constructor(config: FlushConfig = {}) {
    this.config = {
      port: 3000,
      host: 'localhost',
      ...config
    };
    this.router = new Router();
  }


  use(middleware: MiddlewareFunction): void {
    this.middlewares.push(middleware);
  }


  get(path: string, handler: any): void {
    this.router.get(path, handler);
  }

  post(path: string, handler: any): void {
    this.router.post(path, handler);
  }

  put(path: string, handler: any): void {
    this.router.put(path, handler);
  }

  delete(path: string, handler: any): void {
    this.router.delete(path, handler);
  }

  patch(path: string, handler: any): void {
    this.router.patch(path, handler);
  }


  group(prefix: string, callback: (router: Router) => void): void {
    this.router.group(prefix, callback);
  }


  async listen(port?: number): Promise<void> {
    const serverPort = port || this.config.port || 3000;
    
    this.server = Bun.serve({
      port: serverPort,
      hostname: this.config.host,
      fetch: this.handleRequest.bind(this),
    });

    console.log(`🚀 Flush server running on http://${this.config.host}:${serverPort}`);
  }


  private async handleRequest(request: globalThis.Request): Promise<globalThis.Response> {
    const req = new Request(request);
    const res = new Response();

    try {

      await this.runMiddlewares(req, res);
      

      const route = this.router.match(req.method as any, req.url);
      
      if (!route) {
        return new globalThis.Response('Not Found', { status: 404 });
      }


      req.params = route.params;
      

      const result = await route.handler(req as any, res as any);
      

      if (result && typeof result === 'object' && result.toResponse) {
        return result.toResponse();
      }
      
      return res.toResponse(result);
    } catch (error) {
      console.error('Request error:', error);
      return new globalThis.Response('Internal Server Error', { status: 500 });
    }
  }

  private async runMiddlewares(req: Request, res: Response): Promise<void> {
    for (const middleware of this.middlewares) {
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      
      await middleware(req as any, res as any, next);
      
      if (!nextCalled) {
        throw new Error('Middleware did not call next()');
      }
    }
  }


  async close(): Promise<void> {
    if (this.server) {
      this.server.stop();
    }
  }
}