import type { FlushResponse } from '../types';

export class Response implements FlushResponse {
  private statusCode = 200;
  private headers: Record<string, string> = {};
  private responseData: any = null;

  status(code: number): FlushResponse {
    this.statusCode = code;
    return this;
  }

  json(data: any): FlushResponse {
    this.headers['Content-Type'] = 'application/json';
    this.responseData = JSON.stringify(data);
    return this;
  }

  send(data: string): FlushResponse {
    this.headers['Content-Type'] = 'text/plain';
    this.responseData = data;
    return this;
  }

  html(data: string): FlushResponse {
    this.headers['Content-Type'] = 'text/html';
    this.responseData = data;
    return this;
  }

  render(view: string, data?: any): FlushResponse {
    // TODO: Implement view rendering
    this.headers['Content-Type'] = 'text/html';
    this.responseData = `<h1>View: ${view}</h1><pre>${JSON.stringify(data, null, 2)}</pre>`;
    return this;
  }

  redirect(url: string): FlushResponse {
    this.statusCode = 302;
    this.headers['Location'] = url;
    this.responseData = '';
    return this;
  }

  header(name: string, value: string): FlushResponse {
    this.headers[name] = value;
    return this;
  }

  cookie(name: string, value: string, options?: any): FlushResponse {
    // Simple cookie implementation
    let cookieString = `${name}=${value}`;
    
    if (options?.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`;
    }
    if (options?.httpOnly) {
      cookieString += '; HttpOnly';
    }
    if (options?.secure) {
      cookieString += '; Secure';
    }
    if (options?.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }
    
    this.headers['Set-Cookie'] = cookieString;
    return this;
  }

  toResponse(data?: any): globalThis.Response {
    if (data !== undefined) {
      if (typeof data === 'string') {
        this.send(data);
      } else if (typeof data === 'object') {
        this.json(data);
      }
    }

  
    if (this.responseData === null) {
      this.responseData = '';
    }

    return new globalThis.Response(this.responseData, {
      status: this.statusCode,
      headers: this.headers
    });
  }
}