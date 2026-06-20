import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(200, { message: 'O nome deve ter no máximo 200 caracteres' })
  name: string;

  @IsOptional()
  @IsString({ message: 'A nacionalidade deve ser uma string' })
  @MaxLength(100, { message: 'A nacionalidade deve ter no máximo 100 caracteres' })
  nationality?: string;
}
