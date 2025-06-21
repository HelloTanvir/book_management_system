import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuthorDto {
  /**
   * @example 'John'
   * @description The first name of the author
   */
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * @example 'Doe'
   * @description The last name of the author
   */
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * @example 'John Doe is a software engineer'
   * @description The bio of the author
   */
  @IsOptional()
  @IsString()
  bio?: string;

  /**
   * @example '1990-01-01'
   * @description The birth date of the author
   */
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
