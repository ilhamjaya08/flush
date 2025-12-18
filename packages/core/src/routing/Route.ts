import type { HttpMethod, RouteHandler } from '../types';

export class Route {
  constructor(
    public method: HttpMethod,
    public path: string,
    public handler: RouteHandler,
    public middleware: string[] = []
  ) {}
  

  addMiddleware(middleware: string | string[]): this {
    if (Array.isArray(middleware)) {
      this.middleware.push(...middleware);
    } else {
      this.middleware.push(middleware);
    }
    return this;
  }
  

  matches(method: HttpMethod, path: string): boolean {
    return this.method === method && this.pathMatches(path);
  }
  
  private pathMatches(path: string): boolean {

    const pattern = this.path
      .replace(/\/:([^\/]+)/g, '/([^/]+)')
      .replace(/\//g, '\\/');
    
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  }
  

  extractParams(path: string): Record<string, string> {
    const params: Record<string, string> = {};
    const routeParts = this.path.split('/');
    const pathParts = path.split('/');
    
    routeParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[index];
      }
    });
    
    return params;
  }
}