import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/core/types/pagination.dto';

export class AuthorFilterQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
