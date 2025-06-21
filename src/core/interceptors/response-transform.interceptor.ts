import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPaginatedResponse, IResponse } from '@/core/types/response.type';
import { PaginatedData } from '@/core/types/data.type';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T> | IPaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T> | IPaginatedResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode: number = response.statusCode;

    return next.handle().pipe(
      map((data: unknown): IResponse<T> | IPaginatedResponse<T> => {
        if (
          data !== null &&
          typeof data === 'object' &&
          'items' in data &&
          'meta' in data
        ) {
          const paginatedData = data as PaginatedData<T>;
          return {
            statusCode,
            message: 'Success',
            data: paginatedData.items,
            total: paginatedData.meta.totalItems,
            page: paginatedData.meta.currentPage,
            limit: paginatedData.meta.itemsPerPage,
          };
        }

        return {
          statusCode,
          message: 'Success',
          data: data as T,
        };
      }),
    );
  }
}
