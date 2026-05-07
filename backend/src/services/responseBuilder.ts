import { ApiResponse } from '../types/dto';

export class ResponseBuilder {
  static success<T>(
    data: T,
    mode: string,
    slug?: string
  ): ApiResponse<T> {
    return {
      success: true,
      mode: mode as any,
      data,
      meta: {
        slug,
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    };
  }

  static error(message: string, mode?: string): ApiResponse<null> {
    return {
      success: false,
      mode: (mode as any) || 'showcase',
      data: null,
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
      error: message,
    };
  }
}