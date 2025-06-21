import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '@/core/types/pagination.dto';

export class BookFilterQueryDto extends PaginationDto {
  /**
   * @example 'The Art of War'
   * @description The search query for the book
   */
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * @example '123e4567-e89b-12d3-a456-426614174000'
   * @description The ID of the author
   */
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
