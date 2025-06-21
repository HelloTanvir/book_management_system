import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/core/types/pagination.dto';

export class AuthorFilterQueryDto extends PaginationDto {
  /**
   * @example 'John'
   * @description The search query for the author
   */
  @IsOptional()
  @IsString()
  search?: string;
}
