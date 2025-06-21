import {
  IsDateString,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  /**
   * @example 'The Art of War'
   * @description The title of the book
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * @example '9780743273565'
   * @description The ISBN of the book
   */
  @IsISBN()
  @IsNotEmpty()
  isbn: string;

  /**
   * @example '1925-04-10'
   * @description The published date of the book
   */
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  /**
   * @example 'Fiction'
   * @description The genre of the book
   */
  @IsOptional()
  @IsString()
  genre?: string;

  /**
   * @example '123e4567-e89b-12d3-a456-426614174000'
   * @description The ID of the author
   */
  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
