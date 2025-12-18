import type { HttpMethod, RouteHandler } from '../types';

interface RouteMatch {
  handler: RouteHandler;
  params: Record<string, string>;
}

interface RouteDefinition {
  method: HttpMethod;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: RouteDefinition[] = [];
  private prefix = '';

  get(path: string, handler: RouteHandler): void {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: RouteHandler): void {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: RouteHandler): void {
    this.addRoute('PUT', path, handler);
  }

  delete(path: string, handler: RouteHandler): void {
    this.addRoute('DELETE', path, handler);
  }

  patch(path: string, handler: RouteHandler): void {
    this.addRoute('PATCH', path, handler);
  }

  group(prefix: string, callback: (router: Router) => void): void {
    const groupRouter = new Router();
    groupRouter.prefix = this.prefix + prefix;
    callback(groupRouter);
    this.routes.push(...groupRouter.routes);
  }

  private addRoute(method: HttpMethod, path: string, handler: RouteHandler): void {
    const fullPath = this.prefix + path;
    const { pattern, paramNames } = this.pathToRegex(fullPath);
    
    this.routes.push({
      method,
      path: fullPath,
      pattern,
      paramNames,
      handler
    });
  }

  match(method: HttpMethod, url: string): RouteMatch | null {
    const pathname = new URL(url, 'http://localhost').pathname;
    
    for (const route of this.routes) {
      if (route.method !== method) continue;
      
      const match = pathname.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        
        return {
          handler: route.handler,
          params
        };
      }
    }
    
    return null;
  }

  private pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    
    const pattern = path
      .replace(/\/:([^\/]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '/([^/]+)';
      })
      .replace(/\//g, '\\/');
    
    return {
      pattern: new RegExp(`^${pattern}$`),
      paramNames
    };
  }

  getRoutes(): RouteDefinition[] {
    return this.routes;
  }
}