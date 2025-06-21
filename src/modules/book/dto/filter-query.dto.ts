import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '@/core/types/pagination.dto';

export class BookFilterQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;
}
