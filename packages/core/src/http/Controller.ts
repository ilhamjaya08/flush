import type { FlushRequest, FlushResponse } from '../types';

export abstract class Controller {
  
  protected validate(data: any, rules: any): any {
    return data;
  }

  protected success(data: any, message = 'Success'): any {
    return {
      success: true,
      message,
      data
    };
  }

  protected error(message: string, code = 400): any {
    return {
      success: false,
      message,
      code
    };
  }

  protected paginate(data: any[], page = 1, limit = 10): any {
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit)
      }
    };
  }
}