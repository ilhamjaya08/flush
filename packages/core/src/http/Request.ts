import type { FlushRequest } from '../types';

export class Request implements FlushRequest {
  public params: Record<string, string> = {};
  public query: Record<string, string> = {};
  public body: any = null;
  public user?: any;

  constructor(private request: globalThis.Request) {
    this.parseQuery();
    this.parseBody();
  }

  get method(): string {
    return this.request.method;
  }

  get url(): string {
    return this.request.url;
  }

  get headers(): Headers {
    return this.request.headers;
  }

  header(name: string): string | null {
    return this.request.headers.get(name);
  }

  private parseQuery(): void {
    const url = new URL(this.request.url);
    url.searchParams.forEach((value, key) => {
      this.query[key] = value;
    });
  }

  private async parseBody(): Promise<void> {
    if (this.method === 'GET' || this.method === 'HEAD') {
      return;
    }

    const contentType = this.header('content-type');
    
    try {
      if (contentType?.includes('application/json')) {
        this.body = await this.request.json();
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await this.request.formData();
        this.body = Object.fromEntries(formData.entries());
      } else if (contentType?.includes('multipart/form-data')) {
        const formData = await this.request.formData();
        this.body = Object.fromEntries(formData.entries());
      } else {
        this.body = await this.request.text();
      }
    } catch (error) {
      console.warn('Failed to parse request body:', error);
      this.body = null;
    }
  }


  input(key: string, defaultValue?: any): any {
    return this.body?.[key] ?? this.query[key] ?? defaultValue;
  }

  all(): Record<string, any> {
    return { ...this.query, ...this.body };
  }

  only(keys: string[]): Record<string, any> {
    const data = this.all();
    const result: Record<string, any> = {};
    
    keys.forEach(key => {
      if (key in data) {
        result[key] = data[key];
      }
    });
    
    return result;
  }

  except(keys: string[]): Record<string, any> {
    const data = this.all();
    const result = { ...data };
    
    keys.forEach(key => {
      delete result[key];
    });
    
    return result;
  }
}