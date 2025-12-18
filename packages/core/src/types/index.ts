export interface FlushConfig {
  port?: number;
  host?: string;
  database?: {
    url: string;
    provider: 'sqlite' | 'postgresql' | 'mysql';
  };
  cors?: {
    origin?: string | string[];
    credentials?: boolean;
  };
  middleware?: string[];
  views?: {
    engine: 'jsx' | 'html';
    directory: string;
  };
}

export interface RouteHandler {
  (req: FlushRequest, res: FlushResponse): Promise<any> | any;
}

export interface FlushRequest {
  method: string;
  url: string;
  headers: Headers;
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  user?: any;
  header(name: string): string | null;
  input(key: string, defaultValue?: any): any;
  all(): Record<string, any>;
  only(keys: string[]): Record<string, any>;
  except(keys: string[]): Record<string, any>;
}

export interface FlushResponse {
  status(code: number): FlushResponse;
  json(data: any): FlushResponse;
  send(data: string): FlushResponse;
  html(data: string): FlushResponse;
  render(view: string, data?: any): FlushResponse;
  redirect(url: string): FlushResponse;
  header(name: string, value: string): FlushResponse;
  cookie(name: string, value: string, options?: any): FlushResponse;
  toResponse(data?: any): globalThis.Response;
}

export interface MiddlewareFunction {
  (req: FlushRequest, res: FlushResponse, next: () => void): Promise<void> | void;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';