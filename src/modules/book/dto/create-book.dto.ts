import {
  IsDateString,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsISBN()
  @IsNotEmpty()
  isbn: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
