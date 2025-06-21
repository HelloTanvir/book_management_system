import { Expose, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 1000;
export const DEFAULT_SORT_BY = 'createdAt';
export const DEFAULT_SORT_ORDER = SortOrder.DESC;

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  limit?: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  sortBy?: string = DEFAULT_SORT_BY;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(SortOrder))
  order: SortOrder = DEFAULT_SORT_ORDER;

  @Expose()
  get skip(): number {
    if (!this.page || !this.limit) return 0;
    return (this.page - 1) * this.limit;
  }

  set skip(_: number) {}
}
